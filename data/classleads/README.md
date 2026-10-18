# Classleads data

The [Classleads page](../../compendium/classleads/class_skills_tree.mdx) is
generated from the files in this folder. Don't edit the page itself; every
build regenerates it.

| File                   | What it holds                                              | Edited by          |
| ---------------------- | ---------------------------------------------------------- | ------------------ |
| `classleads.raw.json`  | Every post from the Achaea classleads news section         | the scraper only   |
| `classes.json`         | Which skills belong to which class or group, plus aliases  | hand               |
| `overrides.json`       | Hints for the few posts the parser can't read on its own   | hand               |

## Updating

```bash
npm run update:classleads
```

This fetches any posts newer than the archive, then regenerates the page.
Read the `[classleads] warning:` lines it prints (see below), then commit
`classleads.raw.json` and `compendium/classleads/class_skills_tree.mdx`
together. `npm run update:classleads:full` rebuilds the archive from post 1.

To regenerate without fetching, run `npm run gen-classleads`. `npm start` and
`npm run build` also regenerate the page.

## How a post is read

The parser lives in `scripts/classleads/parse.mjs`. Each heading underlined
with dashes starts a section, and each top-level bullet (`*` or `-`) in it is
one change, dated by the post. A bullet in the other style, indented, or under
a line ending in `:` becomes a sub-point. A line directly under a bullet
continues it. Paragraphs after a blank line (intros, notes, "Enjoy!") are left
out.

Section headings then go through `classes.json`: an alias renames a heading,
a class or group claims it as one of its skills, and a heading that names a
class (`Bard`, `Priest general`, `Firelord`) becomes that class's General
node.

## Fixing warnings

Warnings never stop the build; the page is generated either way.

| Warning                                    | Fix                                                                                                                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"X" (post #N) belongs to no class or group` | A new or misspelled heading. Add an alias in `classes.json` if it's another name for a known skill, add it to a class or group, or add it to `standalone` if it belongs at the top level (like `Misc`). |
| `post #N … no section headings found`      | Give the post a `skill` rule in `overrides.json`, or `skip` it if it records no changes.                                                                               |
| `unknown rule`, `no such post`, `nothing starts with excluded …` | A typo in `overrides.json`, or a rule that no longer matches its post.                                                                       |

## `classes.json`

- `classes`: class name → its skills. A skill listed under several classes
  is shown under each, marked "shared with".
- `groups`: like classes, for non-class groupings (`Tradeskills`). Shown after
  the classes.
- `standalone`: skills shown at the top level on their own. Listing them here
  is what tells the generator they are expected.
- `aliases`: heading → skill. The value can be a skill name,
  `{ "skill": "Weaponmastery", "prefix": "(Dual blunt)" }` to also label each
  change, or a list of either when one heading covers several skills
  (`"Puppetry/Vodun": ["Puppetry", "Vodun"]`).

Names match regardless of case, spacing and punctuation, so one alias covers
`Discipline (and clones)`, `Discipline (and clones):` and
`Discipline and clones`.

## `overrides.json`

Rules under `posts` apply to one post by id. Rules under `subjects` apply to
every post whose subject matches the regular expression, including future
ones. When both match, the post rule wins.

| Rule       | Effect                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------- |
| `skill`    | For a post with no headings: treat the whole post as this one section.                       |
| `group`    | File every section of the post under this top-level group, one entry per section, instead of with the class skills. |
| `headings` | Rename a section for this post only, e.g. `{ "General": "Serpent" }`.                        |
| `exclude`  | Drop changes whose text starts with any of these strings.                                    |
| `prefix`   | Label every change in the post, e.g. `"(PvE)"` gives `(PvE): …`.                             |
| `skip`     | Ignore the post.                                                                             |
| `note`     | Free text for the next maintainer; ignored by the parser.                                    |

The `^Mnemosyne` subject rule uses `group`. Mnemosyne boon and affix updates
head their sections with class names, so without it they would land in each
class's General node. With it, each section becomes an entry under Mnemosyne:
categories such as Affixes first, then classes in page order, using the page's
spelling ("Firelord" is shown as Fire Lord). New categories and classes in
later posts need no configuration.

## Dates and post numbers

Each change is shown with the date and number of the post it came from, e.g.
`(9/28/2026 · post #177)`, so readers can check it against the source
(`https://api.achaea.com/news/classleads/177.json`).

Post timestamps are shown as `America/Los_Angeles` calendar dates
(`TIME_ZONE` in `parse.mjs`), so a build on any machine or CI runner
produces the same page.
