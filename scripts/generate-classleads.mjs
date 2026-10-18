// Builds the Classleads page from the scraped news archive.
//
//   data/classleads/classleads.raw.json   posts, as scraped by update-classleads.mjs
//   data/classleads/overrides.json        per-post fixes for posts the parser can't read alone
//   data/classleads/classes.json          which skills belong to which class or group
//
// Writes compendium/classleads/class_skills_tree.mdx. Anything that needs a
// human decision (a heading no class claims, a post without headings) is
// reported as a warning; the page is still generated.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nameKey, parsePosts } from "./classleads/parse.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(repoRoot, "data", "classleads");
const rawPath = path.join(dataDir, "classleads.raw.json");
const overridesPath = path.join(dataDir, "overrides.json");
const classesPath = path.join(dataDir, "classes.json");
const outPath = path.join(repoRoot, "compendium", "classleads", "class_skills_tree.mdx");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const relative = (file) => path.relative(repoRoot, file).replace(/\\/g, "/");

// Escapes HTML and the characters MDX would read as JSX expressions or
// markdown emphasis, code and links.
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/\*/g, "&#42;")
    .replace(/`/g, "&#96;")
    .replace(/\[/g, "&#91;")
    .replace(/]/g, "&#93;")
    .replace(/\\/g, "&#92;");
}

// Wrap any ALL-CAPS word or sequence of ALL-CAPS words in <strong> tags.
// Matches words with 2+ uppercase letters/digits and sequences like "CHRONO ASSERT".
function formatAllCapsToBold(str = "") {
  const re = /\b([A-Z][A-Z0-9]{1,}(?:\s+[A-Z][A-Z0-9]{1,})*)\b/g;
  const escaped = escapeHtml(str);
  return escaped.replace(re, (m) => `<strong>${m}</strong>`);
}

// Keeps the line breaks of multi-line changes, such as example commands.
function formatText(str = "") {
  return String(str).split("\n").map(formatAllCapsToBold).join("<br />");
}

function plural(count, word, many = `${word}s`) {
  return `${count} ${count === 1 ? word : many}`;
}

function byName(a, b) {
  return a.name.localeCompare(b.name);
}

function byDate(a, b) {
  return a.date.localeCompare(b.date) || a.post - b.post;
}

// An alias maps a heading to a skill name, to { skill, prefix } to also
// prepend "(prefix): " to each moved entry, or to a list of either when one
// heading covers several skills.
function aliasTargets(to) {
  return [to].flat().map((target) => (typeof target === "string" ? { skill: target } : target));
}

// Adds the sections a "group" rule set aside (see overrides.json) to a group's
// skills, one node per section. Sections named after a class take the class's
// spelling ("Firelord" -> "Fire Lord") and follow the other sections, in the
// same order as the classes on the page.
function addRuleSections(skills, sections, classes) {
  const byKey = new Map(skills.map((skill) => [nameKey(skill.name), skill]));
  for (const [heading, changes] of Object.entries(sections)) {
    const key = nameKey(heading);
    if (!byKey.has(key)) {
      const skill = { name: classes.get(key)?.name ?? heading, changes: [], sharedWith: [] };
      byKey.set(key, skill);
      skills.push(skill);
    }
    const skill = byKey.get(key);
    skill.changes = [...skill.changes, ...changes].sort(byDate);
  }

  const classOrder = (skill) => classes.get(nameKey(skill.name))?.order ?? -1;
  skills.sort((a, b) => classOrder(a) - classOrder(b) || byName(a, b));
}

// Groups the recorded changes into a Class > Skill tree using classes.json.
// Custom groups (e.g. "Tradeskills") follow the classes, then any group that
// only an overrides.json "group" rule defines. Entries headed by a class name
// (e.g. "Bard", "Priest general") become that class's General node. Skills no
// class or group claims stay at the top level; any that classes.json doesn't
// list as standalone are returned as unmapped.
function buildTree(data, config) {
  const aliases = new Map(
    Object.entries(config.aliases || {}).map(([from, to]) => [nameKey(from), aliasTargets(to)])
  );

  const changesByKey = new Map();
  const nameByKey = new Map(
    (config.standalone || []).map((name) => [nameKey(name), name])
  );
  for (const [name, changes] of Object.entries(data.skills || {})) {
    for (const alias of aliases.get(nameKey(name)) ?? [{ skill: name }]) {
      const key = nameKey(alias.skill);
      const moved = (changes || []).map((chg) =>
        alias.prefix ? { ...chg, text: `${alias.prefix}: ${chg.text || ""}` } : chg
      );
      if (!changesByKey.has(key)) changesByKey.set(key, []);
      if (!nameByKey.has(key)) nameByKey.set(key, alias.skill);
      changesByKey.get(key).push(...moved);
    }
  }
  // Aliased names merge into one list, so keep each list in date order.
  for (const changes of changesByKey.values()) {
    changes.sort(byDate);
  }

  const ruleGroups = new Map(
    Object.entries(data.groups || {}).map(([name, sections]) => [nameKey(name), { name, sections }])
  );
  const configuredGroups = new Set(Object.keys(config.groups || {}).map(nameKey));
  const classes = new Map(
    Object.keys(config.classes || {}).map((name, order) => [nameKey(name), { name, order }])
  );

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
    ...[...ruleGroups]
      .filter(([key]) => !configuredGroups.has(key))
      .map(([, { name }]) => ({ name, skills: [], isClass: false })),
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
      const general = generalKeys.flatMap((key) => changesByKey.get(key) || []).sort(byDate);
      if (general.length) {
        skills.unshift({ name: "General", changes: general, sharedWith: [] });
      }
    }

    // A rule group's children are categories and classes, not skills.
    const ruleGroup = !parent.isClass && ruleGroups.get(nameKey(parent.name));
    if (ruleGroup) {
      addRuleSections(skills, ruleGroup.sections, classes);
      return { name: parent.name, skills, childNoun: ["category", "categories"] };
    }
    return { name: parent.name, skills, childNoun: ["skill", "skills"] };
  });

  const standalone = new Set((config.standalone || []).map(nameKey));
  const unclassed = [...changesByKey]
    .filter(([key]) => !claimed.has(key))
    .map(([key, changes]) => ({ key, name: nameByKey.get(key), changes }))
    .sort(byName);
  const unmapped = unclassed
    .filter((skill) => !standalone.has(skill.key))
    .map((skill) => ({ name: skill.name, posts: [...new Set(skill.changes.map((c) => c.post))] }));

  return { groups, unclassed, unmapped };
}

function renderSummary(name, meta) {
  return (
    "<summary>\n" +
    `<strong>${escapeHtml(name)}</strong>` +
    ` <span className="classlead-meta">${escapeHtml(meta)}</span>\n` +
    "</summary>\n"
  );
}

// Sub-points stay on the change's line: MDX would treat a line break inside
// the <li> as the start of a markdown block.
function renderDetails(details = []) {
  if (!details.length) return "";
  const items = details.map((d) => `<li>${formatText(d.text)}${renderDetails(d.details)}</li>`);
  return `<ul className="classlead-details">${items.join("")}</ul>`;
}

function renderChanges(changes) {
  if (!changes.length) {
    return '<p className="classlead-empty">No changes recorded.</p>\n';
  }

  let out = "<ul>\n";
  for (const chg of changes) {
    // Date and post number, so readers can find the change in the source.
    // "post" keeps the number apart from classlead report tags like "(152)".
    const source = [chg.dateDisplay, chg.post && `post #${chg.post}`].filter(Boolean).join(" · ");
    const cite = source ? ` <em>(${escapeHtml(source)})</em>` : "";
    out += `<li>${formatText(chg.text || "")}${cite}${renderDetails(chg.details)}</li>\n`;
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
  const meta = `${plural(skillCount, ...group.childNoun)} · ${plural(changeCount, "change")}`;

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

  // A YAML comment, so the note never reaches the page or its meta description.
  const frontMatter =
    `---\n` +
    `# Generated by scripts/generate-classleads.mjs from data/classleads.\n` +
    `# Edit those files and run \`npm run gen-classleads\`; changes made here are overwritten.\n` +
    `id: class-skills-tree\n` +
    `title: Class Skills Tree with Changes\n` +
    `sidebar_label: Class Skills Tree\n` +
    `slug: /classleads\n` +
    // The page mirrors the scraped posts, so there is nothing to edit by hand.
    `custom_edit_url: null\n` +
    `---\n\n`;

  return frontMatter + body;
}

function main() {
  try {
    const archive = readJson(rawPath);
    const overrides = fs.existsSync(overridesPath) ? readJson(overridesPath) : {};
    const config = readJson(classesPath);

    const parsed = parsePosts(archive.posts, overrides);
    const tree = buildTree(parsed, config);
    fs.writeFileSync(outPath, buildDoc(tree), "utf8");

    const latest = archive.posts.reduce((a, b) => (b.id > a.id ? b : a));
    console.log(
      `[classleads] Generated ${relative(outPath)} from ${parsed.stats.posts} posts ` +
        `(latest #${latest.id} "${latest.subject}"): ${parsed.stats.changes} changes, ` +
        `${tree.groups.length} classes and groups, ${tree.unclassed.length} standalone skills.`
    );

    const warnings = [
      ...parsed.warnings,
      ...tree.unmapped.map(
        ({ name, posts }) =>
          `"${name}" (post ${posts.map((id) => `#${id}`).join(", ")}) belongs to no class or group, ` +
          `so it is shown on its own. Map it in ${relative(classesPath)} ` +
          `(classes, groups, aliases or standalone).`
      ),
    ];
    for (const warning of warnings) console.warn(`[classleads] warning: ${warning}`);
  } catch (err) {
    console.error("[classleads] Failed to generate MDX:", err);
    process.exit(1);
  }
}

main();
