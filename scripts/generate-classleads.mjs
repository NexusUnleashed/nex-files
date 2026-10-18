import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const classleadsDir = path.join(root, "compendium", "classleads");
const dataPath = path.join(classleadsDir, "classleads_data.json");
const classesPath = path.join(classleadsDir, "classes.json");
const outPath = path.join(classleadsDir, "class_skills_tree.mdx");

// Case- and spacing-insensitive name used to match skills and classes, so
// "Twoarts" finds "TwoArts" and "Firelord" finds "Fire Lord".
function nameKey(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;");
}

// Wrap any ALL-CAPS word or sequence of ALL-CAPS words in <strong> tags.
// Matches words with 2+ uppercase letters/digits and sequences like "CHRONO ASSERT".
function formatAllCapsToBold(str = "") {
  const re = /\b([A-Z][A-Z0-9]{1,}(?:\s+[A-Z][A-Z0-9]{1,})*)\b/g;
  const escaped = escapeHtml(str);
  return escaped.replace(re, (m) => `<strong>${m}</strong>`);
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function byName(a, b) {
  return a.name.localeCompare(b.name);
}

// Groups the recorded changes into a Class > Skill tree using classes.json.
// Custom groups (e.g. "Tradeskills") follow the classes. Entries headed by a
// class name (e.g. "Bard", "Priest general") become that class's General node.
// Skills no class or group claims stay at the top level.
function buildTree(data, config) {
  // An alias is a skill name, or { skill, prefix } to also prepend
  // "(prefix): " to each moved entry.
  const aliases = new Map(
    Object.entries(config.aliases || {}).map(([from, to]) => [
      nameKey(from),
      typeof to === "string" ? { skill: to } : to,
    ])
  );

  const changesByKey = new Map();
  const nameByKey = new Map();
  for (const [name, changes] of Object.entries(data.skills || {})) {
    const alias = aliases.get(nameKey(name));
    const skillName = alias?.skill ?? name;
    const key = nameKey(skillName);
    const moved = (changes || []).map((chg) =>
      alias?.prefix ? { ...chg, text: `${alias.prefix}: ${chg.text || ""}` } : chg
    );
    if (!changesByKey.has(key)) {
      changesByKey.set(key, []);
      nameByKey.set(key, skillName);
    }
    changesByKey.get(key).push(...moved);
  }
  // Aliased names merge into one list, so keep each list in date order.
  for (const changes of changesByKey.values()) {
    changes.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }

  const parents = [
    ...Object.entries(config.classes || {}).map(([name, skills]) => ({
      name,
      skills,
      isClass: true,
    })),
    ...Object.entries(config.groups || {}).map(([name, skills]) => ({
      name,
      skills,
      isClass: false,
    })),
  ];

  const parentsBySkill = new Map();
  for (const parent of parents) {
    for (const skill of parent.skills) {
      const key = nameKey(skill);
      if (!parentsBySkill.has(key)) parentsBySkill.set(key, []);
      parentsBySkill.get(key).push(parent.name);
    }
  }

  const claimed = new Set();
  const groups = parents.map((parent) => {
    const skills = parent.skills
      .map((name) => {
        const key = nameKey(name);
        claimed.add(key);
        return {
          name,
          changes: changesByKey.get(key) || [],
          sharedWith: parentsBySkill.get(key).filter((p) => p !== parent.name),
        };
      })
      .sort(byName);

    if (parent.isClass) {
      const classKey = nameKey(parent.name);
      const generalKeys = [classKey, `${classKey}general`];
      generalKeys.forEach((key) => claimed.add(key));
      const general = generalKeys.flatMap((key) => changesByKey.get(key) || []);
      if (general.length) {
        skills.unshift({ name: "General", changes: general, sharedWith: [] });
      }
    }

    return { name: parent.name, skills };
  });

  const unclassed = [...changesByKey]
    .filter(([key]) => !claimed.has(key))
    .map(([key, changes]) => ({ name: nameByKey.get(key), changes }))
    .sort(byName);

  return { groups, unclassed };
}

function renderSummary(name, meta) {
  return (
    "<summary>\n" +
    `<strong>${escapeHtml(name)}</strong>` +
    ` <span className="classlead-meta">${escapeHtml(meta)}</span>\n` +
    "</summary>\n"
  );
}

function renderChanges(changes) {
  if (!changes.length) {
    return '<p className="classlead-empty">No changes recorded.</p>\n';
  }

  let out = "<ul>\n";
  for (const chg of changes) {
    const date = chg.dateDisplay
      ? ` <em>(${escapeHtml(chg.dateDisplay)})</em>`
      : "";
    out += `<li>${formatAllCapsToBold(chg.text || "")}${date}</li>\n`;
  }
  return out + "</ul>\n";
}

function renderSkill(skill) {
  const meta = [plural(skill.changes.length, "change")];
  if (skill.sharedWith.length) {
    meta.push(`shared with ${skill.sharedWith.join(", ")}`);
  }

  return (
    '<details className="classlead-skill">\n' +
    renderSummary(skill.name, meta.join(" · ")) +
    renderChanges(skill.changes) +
    "</details>\n"
  );
}

function renderGroup(group) {
  const changeCount = group.skills.reduce((n, s) => n + s.changes.length, 0);
  const skillCount = group.skills.filter((s) => s.name !== "General").length;
  const meta = `${plural(skillCount, "skill")} · ${plural(changeCount, "change")}`;

  // Markdown heading recognized by Docusaurus ToC
  return (
    `## ${group.name}\n\n` +
    '<details className="classlead-node classlead-group">\n' +
    renderSummary(group.name, meta) +
    group.skills.map(renderSkill).join("") +
    "</details>\n\n"
  );
}

function renderUnclassed(skill) {
  return (
    `## ${skill.name}\n\n` +
    '<details className="classlead-node">\n' +
    renderSummary(skill.name, plural(skill.changes.length, "change")) +
    renderChanges(skill.changes) +
    "</details>\n\n"
  );
}

function buildDoc(tree) {
  let body = "";

  body += "# Class Skills Tree\n\n";
  // Wrap all generated sections so we can target headings via global CSS
  body += '<div id="classleads-skilltree">\n\n';
  body += tree.groups.map(renderGroup).join("");
  body += tree.unclassed.map(renderUnclassed).join("");
  body += "</div>\n";

  const frontMatter =
    `---\n` +
    `id: class-skills-tree\n` +
    `title: Class Skills Tree with Changes\n` +
    `sidebar_label: Class Skills Tree\n` +
    `slug: /classleads\n` +
    `---\n\n`;

  return frontMatter + body;
}

function main() {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const config = JSON.parse(fs.readFileSync(classesPath, "utf8"));
    const tree = buildTree(data, config);
    fs.writeFileSync(outPath, buildDoc(tree), "utf8");
    console.log(
      `[classleads] Generated ${path.relative(root, outPath)} from JSON ` +
        `(${tree.groups.length} classes and groups, ${tree.unclassed.length} unclassed skills).`
    );
  } catch (err) {
    console.error("[classleads] Failed to generate MDX:", err);
    process.exit(1);
  }
}

main();
