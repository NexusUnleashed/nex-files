import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const reposRoot = process.env.NEX_REPOS_ROOT
  ? path.resolve(process.env.NEX_REPOS_ROOT)
  : path.resolve(repoRoot, "..");
const snapshotRoot = path.join(repoRoot, "package-docs");

const packages = (
  process.env.NEX_DOC_REPOS || "nexsys4,nexgui4,nexmap4,nexbash3"
)
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const assertInside = (parent, candidate) => {
  const relative = path.relative(parent, candidate);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) {
    return;
  }

  throw new Error(`Refusing to write outside ${parent}: ${candidate}`);
};

const isRelevantDocsFile = (sourcePath) => {
  const basename = path.basename(sourcePath);
  if (basename === ".DS_Store") return false;
  if (basename === ".git") return false;
  if (basename.toLowerCase() === "readme.md") return false;
  return true;
};

await fs.mkdir(snapshotRoot, { recursive: true });

for (const repository of packages) {
  const source = path.join(reposRoot, repository, "docs", "docusaurus-content");
  const target = path.join(snapshotRoot, repository);

  assertInside(snapshotRoot, target);

  try {
    const stat = await fs.stat(source);
    if (!stat.isDirectory()) {
      throw new Error(`${source} is not a directory`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`[sync-package-docs] Missing source: ${source}`);
      console.error(
        "[sync-package-docs] Set NEX_REPOS_ROOT when sibling repositories live elsewhere.",
      );
      process.exit(1);
    }

    throw error;
  }

  await fs.rm(target, { recursive: true, force: true });
  await fs.cp(source, target, {
    recursive: true,
    filter: isRelevantDocsFile,
  });

  console.log(`[sync-package-docs] ${repository} -> ${path.relative(repoRoot, target)}`);
}

console.log("[sync-package-docs] complete");
