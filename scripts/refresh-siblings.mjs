import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const argv = new Set(process.argv.slice(2));
const fetchOnly = argv.has("--fetch-only");
const rebuild = argv.has("--rebuild");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const reposRoot = process.env.NEX_REPOS_ROOT
  ? path.resolve(process.env.NEX_REPOS_ROOT)
  : path.resolve(repoRoot, "..");

const siblingRepos = (
  process.env.NEX_DOC_REPOS || "nexsys4,nexgui4,nexmap4,nexbash3"
)
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const run = (command, args, cwd) => {
  const isNpm = command === "npm";
  const resolvedCommand = isNpm ? process.execPath : command;
  const resolvedArgs = isNpm ? [process.env.npm_execpath, ...args] : args;

  const result = spawnSync(resolvedCommand, resolvedArgs, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(
      `[refresh] failed to run ${command}: ${result.error.message}`,
    );
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const refreshRepo = (repoName) => {
  const repoPath = path.join(reposRoot, repoName);

  console.log(`\n[refresh] ${repoName}`);
  run("git", ["-C", repoPath, "fetch", "--all", "--prune"], repoRoot);

  if (!fetchOnly) {
    run("git", ["-C", repoPath, "pull", "--ff-only"], repoRoot);
  }
};

for (const repoName of siblingRepos) {
  refreshRepo(repoName);
}

console.log("\n[refresh] clearing Docusaurus cache");
run("npm", ["run", "clear"], repoRoot);

if (rebuild) {
  console.log("\n[refresh] building site");
  run("npm", ["run", "build"], repoRoot);
}

console.log("\n[refresh] complete");
