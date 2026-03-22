import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(rootDir, "docs", "bazaar", "items1000.jsonc");
const outputPath = path.join(rootDir, "docs", "bazaar", "items1000.json");

function stripJsonComments(input) {
  let output = "";
  let inString = false;
  let stringDelimiter = "";
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
        output += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && nextChar === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      output += char;

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === stringDelimiter) {
        inString = false;
        stringDelimiter = "";
      }

      continue;
    }

    if (char === "/" && nextChar === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && nextChar === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    output += char;

    if (char === '"' || char === "'") {
      inString = true;
      stringDelimiter = char;
    }
  }

  return output;
}

async function main() {
  const sourceText = await fs.readFile(sourcePath, "utf8");
  const jsonText = stripJsonComments(sourceText);

  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Unable to parse ${sourcePath}: ${error.message}`);
  }

  await fs.writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  const itemCount = Array.isArray(data)
    ? data.filter((item) => typeof item?.name === "string" && item.name.trim()).length
    : 0;

  console.log(`Generated docs/bazaar/items1000.json (${itemCount} Bazaar items).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
