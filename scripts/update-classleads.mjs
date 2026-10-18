// Scrapes the Achaea "classleads" news section into a raw JSON archive.
//
// Posts are walked through each response's `next` link until the API reports
// `next: false`. The archive doubles as the resume point: later runs re-fetch
// the newest stored post, follow its (now populated) `next` link, and only
// download posts that are newer than what is already stored.
//
//   npm run update:classleads        fetch posts newer than the archive
//   npm run update:classleads:full   rebuild the archive from post 1

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const argv = new Set(process.argv.slice(2));
const full = argv.has("--full");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const archivePath = path.join(repoRoot, "data", "classleads", "classleads.raw.json");

const SECTION_URL = "https://api.achaea.com/news/classleads";
const FIRST_POST_ID = 1;
const postUrl = (id) => `${SECTION_URL}/${id}.json`;

const REQUEST_DELAY_MS = 250;
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 4;
const USER_AGENT = "nex-files classleads updater (+https://github.com/NexusUnleashed/nex-files)";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (message) => console.log(`[classleads] ${message}`);
const formatDate = (unixSeconds) => new Date(unixSeconds * 1000).toISOString().slice(0, 10);

// Returns the parsed `{ post, previous, next }` response for a post URL.
async function fetchPost(url) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { accept: "application/json", "user-agent": USER_AGENT },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.json();
      if (!Number.isInteger(body?.post?.id)) throw new Error("response has no post id");
      return body;
    } catch (err) {
      if (attempt >= MAX_ATTEMPTS) throw new Error(`${url}: ${err.message}`);
      const backoffMs = 1000 * 2 ** (attempt - 1);
      log(`  ${url} failed (${err.message}), retrying in ${backoffMs / 1000}s`);
      await sleep(backoffMs);
    }
  }
}

// `next` is either false (end of the section) or the URL of the following post.
function nextUrl(body) {
  if (body.next === false || body.next == null) return null;
  if (typeof body.next !== "string" || !body.next.startsWith(`${SECTION_URL}/`)) {
    throw new Error(`unexpected next link on post #${body.post.id}: ${JSON.stringify(body.next)}`);
  }
  return body.next;
}

function readArchive() {
  if (!fs.existsSync(archivePath)) return [];
  const archive = JSON.parse(fs.readFileSync(archivePath, "utf8"));
  if (!Array.isArray(archive.posts)) throw new Error(`${archivePath} has no posts array`);
  return [...archive.posts].sort((a, b) => a.id - b.id);
}

function writeArchive(posts) {
  const archive = {
    source: SECTION_URL,
    updatedAt: new Date().toISOString(),
    count: posts.length,
    lastId: posts.at(-1)?.id ?? null,
    posts,
  };
  fs.mkdirSync(path.dirname(archivePath), { recursive: true });
  // Write then rename so an interrupted run never leaves a truncated archive.
  const tmpPath = `${archivePath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(archive, null, 2)}\n`);
  fs.renameSync(tmpPath, archivePath);
}

// Works out where the walk should begin: post 1 for an empty archive, otherwise
// the `next` link of the newest stored post (false until a newer post exists).
async function resolveStartUrl(storedPosts) {
  if (storedPosts.length === 0) {
    log(`starting from post #${FIRST_POST_ID}`);
    return postUrl(FIRST_POST_ID);
  }

  const newest = storedPosts.at(-1);
  log(`checking for posts after #${newest.id}`);
  return nextUrl(await fetchPost(postUrl(newest.id)));
}

const storedPosts = full ? [] : readArchive();
const postsById = new Map(storedPosts.map((post) => [post.id, post]));
const added = [];
const seenThisRun = new Set();
let failure = null;

if (full) log("full rebuild requested, ignoring the existing archive");

try {
  let url = await resolveStartUrl(storedPosts);
  while (url) {
    await sleep(REQUEST_DELAY_MS);
    const body = await fetchPost(url);
    const { post } = body;
    if (seenThisRun.has(post.id)) throw new Error(`next links loop back to post #${post.id}`);
    seenThisRun.add(post.id);

    if (!postsById.has(post.id)) added.push(post);
    postsById.set(post.id, post);
    log(`  + #${post.id}  ${formatDate(post.date)}  ${post.subject}`);

    url = nextUrl(body);
  }
} catch (err) {
  failure = err;
}

// A failed --full run must not replace a complete archive with a partial one.
// An incremental run saves whatever it got, since the next run resumes from it.
const canSave = added.length > 0 && !(full && failure);
const posts = [...postsById.values()].sort((a, b) => a.id - b.id);

if (canSave) {
  writeArchive(posts);
  log(
    `saved ${added.length} new post(s) (#${added[0].id}-#${added.at(-1).id}); ` +
      `archive holds ${posts.length} posts, latest #${posts.at(-1).id}`,
  );
  log(`wrote ${path.relative(repoRoot, archivePath)}`);
} else if (!failure) {
  log(`already up to date; archive holds ${posts.length} posts, latest #${posts.at(-1)?.id}`);
}

if (failure) {
  console.error(`[classleads] ${failure.message}`);
  console.error(
    canSave
      ? "[classleads] progress up to the failure was saved; rerun to resume"
      : "[classleads] the archive was left unchanged",
  );
  process.exitCode = 1;
}
