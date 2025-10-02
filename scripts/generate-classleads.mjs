import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const dataPath = path.join(root, "docs", "classleads", "classleads_data.json");
const outPath = path.join(root, "docs", "classleads", "class_skills_tree.mdx");

function skillSlug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Wrap any ALL-CAPS word or sequence of ALL-CAPS words in <strong> tags.
// Matches words with 2+ uppercase letters/digits and sequences like "CHRONO ASSERT".
function formatAllCapsToBold(str = "") {
  const re = /\b([A-Z][A-Z0-9]{1,}(?:\s+[A-Z][A-Z0-9]{1,})*)\b/g;
  const escaped = escapeHtml(str);
  return escaped.replace(re, (m) => `<strong>${m}</strong>`);
}

function buildDoc(data) {
  const classesMap = data.classes || {};
  const skillsMap = data.skills || {};
  const unmapped = data.unmappedSkills || [];

  const skillToClasses = Object.entries(classesMap).reduce(
    (acc, [className, skills]) => {
      (skills || []).forEach((s) => {
        if (!acc[s]) acc[s] = [];
        acc[s].push(className);
      });
      return acc;
    },
    {}
  );

  // Build candidate skills and dedupe by slug to avoid duplicate heading ids
  const candidates = [
    ...Object.keys(skillsMap),
    ...Object.values(classesMap).flat(),
    ...unmapped,
  ];
  const bySlug = new Map();
  for (const name of candidates) {
    const slug = skillSlug(name);
    if (!bySlug.has(slug)) {
      bySlug.set(slug, name);
    }
  }
  const allSkills = Array.from(bySlug.values()).sort((a, b) =>
    a.localeCompare(b)
  );

  let body = "";

  body += "# Class Skills Tree\n\n";
  body +=
    "Drag-and-drop update: replace `static/classleads_data.json` and rebuild. The list below renders from that JSON.\n\n";
  // Wrap all generated skill sections so we can target headings via global CSS
  body += '<div id="classleads-skilltree">\n\n';

  for (const skill of allSkills) {
    const id = skillSlug(skill);
    const classes = skillToClasses[skill] || [];
    const changes = skillsMap[skill] || [];
    const skillSummary = `${skill} ${classes.join(" ")}`.trim();

    // Markdown heading recognized by Docusaurus ToC
    body += `## ${skill}\n\n`;

    // Details block for the visible UI
    body += `<details data-skill-block data-text="${escapeHtml(
      skillSummary
    )}">\n`;
    body += "<summary>\n";
    body += `<strong>${escapeHtml(skill)}</strong>`;
    if (classes.length) {
      body += ` <span className=\"skill-classes\">(${escapeHtml(
        classes.join(", ")
      )})</span>`;
    }
    body += "\n</summary>\n";

    if (!classes.length) {
      body += "<p><em>Not currently mapped to a class.</em></p>\n";
    }

    if (changes.length) {
      body += "<ul>\n";
      for (const chg of changes) {
        const date = chg.dateDisplay
          ? ` <em>(${escapeHtml(chg.dateDisplay)})</em>`
          : "";
        const formatted = formatAllCapsToBold(chg.text || "");
        const liTextAttr = `${skill} ${chg.text || ""} ${
          chg.dateDisplay || ""
        }`.trim();
        body += `<li data-change-line data-text="${escapeHtml(liTextAttr)}">`;
        body += `${formatted}${date}`;
        body += "</li>\n";
      }
      body += "</ul>\n";
    } else {
      body += "<p>No changes recorded.</p>\n";
    }

    body += "</details>\n\n";
  }

  // Close wrapper
  body += "</div>\n";

  const frontMatter =
    `---\n` +
    `id: class-skills-tree\n` +
    `title: Class Skills Tree with Changes\n` +
    `sidebar_label: Class Skills Tree\n` +
    `sidebar: classleadsSidebar\n` +
    `---\n\n`;

  return frontMatter + body;
}

function main() {
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(raw);
    const mdx = buildDoc(data);
    fs.writeFileSync(outPath, mdx, "utf8");
    console.log(
      `[classleads] Generated ${path.relative(
        root,
        outPath
      )} from JSON (${allSkillsCount(data)} skills).`
    );
  } catch (err) {
    console.error("[classleads] Failed to generate MDX:", err);
    process.exit(1);
  }
}

function allSkillsCount(data) {
  const classesMap = data.classes || {};
  const skillsMap = data.skills || {};
  const unmapped = data.unmappedSkills || [];
  const set = new Set([
    ...Object.keys(skillsMap),
    ...Object.values(classesMap).flat(),
    ...unmapped,
  ]);
  return set.size;
}

main();
