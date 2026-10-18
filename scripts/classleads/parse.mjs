// Turns the raw classleads news posts into dated change entries, keyed by the
// section heading each change was posted under.
//
// A typical post looks like:
//
//   Intro paragraph (ignored).
//
//   Groves                     <- section heading, underlined with dashes
//   ------
//   * (234): A change.         <- each top-level bullet is one change
//   * Another change:
//   - with a sub-point         <- a bullet in a different style, or indented,
//                                 directly below a change is a sub-point of it
//   Continued text             <- a line directly below a bullet continues it
//
//   Enjoy!                     <- prose after a blank line is commentary (ignored)
//
// Posts the parser can't read on its own (no headings, headings that only make
// sense in context, stray lines) are steered by rules in overrides.json. A
// "group" rule sets a post's sections aside under a top-level group of their
// own (such as Mnemosyne boons, posted under class names) instead of filing
// them with the class skills.

// Post timestamps are rendered as calendar dates in a fixed zone so that local
// and CI builds produce identical output.
export const TIME_ZONE = "America/Los_Angeles";

const UNDERLINE = /^\s*-{3,}\s*$/;
// "*" may run straight into its text ("*All STANCES"); "-" needs a space so
// it is not confused with an underline.
const BULLET = /^(\s*)(?:\*|-(?=\s))\s*(.*)$/;
const SIGN_OFF = /^(Penned by\b|Enjoy!*$)/i;
const RULE_KEYS = new Set(["note", "skip", "skill", "group", "headings", "prefix", "exclude"]);

const dateParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function postDate(unixSeconds) {
  const { year, month, day } = Object.fromEntries(
    dateParts.formatToParts(new Date(unixSeconds * 1000)).map((p) => [p.type, p.value])
  );
  return {
    date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    dateDisplay: `${month}/${day}/${year}`,
  };
}

// Case- and spacing-insensitive name used to match skills, classes and
// headings, so "Twoarts" finds "TwoArts" and "Firelord" finds "Fire Lord".
export function nameKey(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cleanText(line) {
  return line.trim().replace(/\s+/g, " ");
}

// "Warrior tertiaries:" -> "Warrior tertiaries"
function cleanHeading(line) {
  return cleanText(line).replace(/:$/, "");
}

function splitSections(lines) {
  const sections = [];
  let current = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() && !BULLET.test(line) && UNDERLINE.test(lines[i + 1] ?? "")) {
      current = { heading: cleanHeading(line), lines: [] };
      sections.push(current);
      i += 1;
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections;
}

function sameLevel(level, marker, indent) {
  return level.marker === marker && Math.abs(level.indent - indent) < 2;
}

// Reads one section's lines into a list of { text, details } changes, where
// details holds nested sub-points of the same shape. Authors alternate "*" and
// "-" between levels, so a bullet nests under the one above it when it ends
// with ":" or switches marker or indent, and returns to an outer level when it
// matches that level's marker. A blank line or prose paragraph ends the list.
function parseItems(lines) {
  const items = [];
  let levels = []; // open lists, outermost first: { marker, indent, items }
  let last = null;
  let afterBlank = false;

  for (const line of lines) {
    if (!line.trim()) {
      afterBlank = true;
      continue;
    }

    const bullet = line.match(BULLET);
    if (bullet) {
      const text = cleanText(bullet[2]);
      if (!text) continue;
      const marker = line.trim()[0];
      const indent = bullet[1].length;
      const outer = levels.findLastIndex((level) => sameLevel(level, marker, indent));

      if (afterBlank || !last) {
        levels = [{ marker, indent, items }];
      } else if (last.text.endsWith(":") || outer < 0) {
        levels.push({ marker, indent, items: last.details });
      } else {
        levels.length = outer + 1;
      }
      last = { text, details: [] };
      levels.at(-1).items.push(last);
    } else if (last && !afterBlank) {
      if (levels.length > 1) {
        // A sub-point that lost its bullet ("- a" / "- b" / " c").
        last = { text: cleanText(line), details: [] };
        levels.at(-1).items.push(last);
      } else {
        // A change that runs over several lines, such as a list of commands.
        last.text += `\n${cleanText(line)}`;
      }
    } else {
      // A prose paragraph: commentary, which also ends the list above it.
      levels = [];
      last = null;
    }
    afterBlank = false;
  }
  return items;
}

// Posts without headings that are written as plain paragraphs: each
// paragraph, minus the sign-off, is one change.
function parseParagraphs(lines) {
  const paragraphs = [];
  let current = null;
  for (const line of lines) {
    if (!line.trim()) {
      current = null;
    } else if (current) {
      current.text += ` ${cleanText(line)}`;
    } else {
      current = { text: cleanText(line), details: [] };
      paragraphs.push(current);
    }
  }
  return paragraphs.filter((p) => !SIGN_OFF.test(p.text));
}

// Merges every rule that applies to a post: subject patterns first, then the
// post's own entry, so a post entry can refine a subject rule.
function ruleFor(post, overrides) {
  const matching = [
    ...Object.entries(overrides.subjects ?? {})
      .filter(([pattern]) => new RegExp(pattern, "i").test(post.subject))
      .map(([, rule]) => rule),
    overrides.posts?.[post.id],
  ].filter(Boolean);

  return matching.reduce(
    (merged, rule) => ({
      ...merged,
      ...rule,
      headings: { ...merged.headings, ...rule.headings },
      exclude: [...merged.exclude, ...(rule.exclude ?? [])],
    }),
    { headings: {}, exclude: [] }
  );
}

function validateOverrides(overrides, postsById) {
  const warnings = [];
  const check = (label, rule) => {
    for (const key of Object.keys(rule)) {
      if (!RULE_KEYS.has(key)) warnings.push(`${label}: unknown rule "${key}"`);
    }
  };
  for (const [pattern, rule] of Object.entries(overrides.subjects ?? {})) {
    check(`overrides.json subject "${pattern}"`, rule);
  }
  for (const [id, rule] of Object.entries(overrides.posts ?? {})) {
    check(`overrides.json post #${id}`, rule);
    if (!postsById.has(Number(id))) warnings.push(`overrides.json post #${id}: no such post`);
  }
  return warnings;
}

// Returns { skills, groups, warnings, stats }. skills is { [heading]: change[] };
// groups is { [group]: { [heading]: change[] } } for posts with a "group" rule.
// A change is { date, dateDisplay, text, details?, post }.
export function parsePosts(posts, overrides = {}) {
  const warnings = validateOverrides(overrides, new Map(posts.map((p) => [p.id, p])));
  const skills = {};
  const groups = {};
  const stats = { posts: 0, changes: 0 };

  for (const post of [...posts].sort((a, b) => a.id - b.id)) {
    const rule = ruleFor(post, overrides);
    const label = `post #${post.id} "${post.subject}"`;
    if (rule.skip) continue;

    const lines = String(post.message ?? "").split(/\r?\n/);
    let sections = splitSections(lines);
    if (rule.skill) {
      if (sections.length) {
        warnings.push(`${label}: has section headings, so its "skill" rule is ignored`);
      } else {
        const items = parseItems(lines);
        sections = [{ heading: rule.skill, items: items.length ? items : parseParagraphs(lines) }];
      }
    }
    if (!sections.length) {
      warnings.push(
        `${label}: no section headings found, so nothing was recorded. ` +
          `Give it a "skill" (or "skip") rule in overrides.json.`
      );
      continue;
    }

    const renames = new Map(Object.entries(rule.headings).map(([from, to]) => [nameKey(from), to]));
    const usedRenames = new Set();
    const usedExcludes = new Set();
    const { date, dateDisplay } = postDate(post.date);
    const target = rule.group ? (groups[rule.group] ??= {}) : skills;
    stats.posts += 1;

    for (const section of sections) {
      const items = (section.items ?? parseItems(section.lines)).filter((item) => {
        const pattern = rule.exclude.find((p) => item.text.startsWith(p));
        if (pattern) usedExcludes.add(pattern);
        return !pattern;
      });
      if (!items.length) {
        warnings.push(`${label}: section "${section.heading}" has no bullet points`);
        continue;
      }

      const renamed = renames.get(nameKey(section.heading));
      if (renamed) usedRenames.add(nameKey(section.heading));
      const heading = renamed ?? section.heading;
      target[heading] ??= [];
      for (const item of items) {
        target[heading].push({
          date,
          dateDisplay,
          text: rule.prefix ? `${rule.prefix}: ${item.text}` : item.text,
          ...(item.details.length && { details: item.details }),
          post: post.id,
        });
        stats.changes += 1;
      }
    }

    for (const heading of Object.keys(rule.headings)) {
      if (!usedRenames.has(nameKey(heading))) warnings.push(`${label}: no "${heading}" section to rename`);
    }
    for (const pattern of rule.exclude) {
      if (!usedExcludes.has(pattern)) warnings.push(`${label}: nothing starts with excluded "${pattern}"`);
    }
  }

  return { skills, groups, warnings, stats };
}
