---
title: Custom prompt
description: Read the nexSys prompt, change its colors and abbreviations, and replace its layout.
---

# Custom prompt

nexSys replaces Achaea's prompt with a compact one of its own. To go back to
the game's prompt, switch off **Custom Prompt** on the System tab.

## Reading the prompt

The prompt is built from these parts:

| Part | Meaning |
| --- | --- |
| `(p)` | nexSys is paused. |
| `(a)` | You have aeon. |
| `(r)` | Slow mode is on. |
| `[[` and `]]` | Prismatic is up. They wrap the prompt. |
| `((` and `))` | Shield is up. They wrap the prompt. |
| `\|B\|` | Bloodshield is up. |
| Health and mana | Your current health and mana, colored from green to red as they fall, each followed by its percentage. |
| `K` | Karma, for Occultists. |
| `R` | Rage, when you have any. |
| `e` and `x` | Equilibrium and balance. Each disappears while you don't have it. |
| `c`, `k`, `d`, `b` | Cloak, kola, deafness, and blindness, while each defence is up. |
| `[AST ANO ...]` | Your afflictions, most urgent first, colored by the cure that treats them. Stacking afflictions show a count, such as `(2)`. Missing deafness, blindness, or insomnia defences are listed at the end. |
| `-120h(2.9%)` | How much your health or mana changed since the last prompt. |
| `-` | You're dead. The prompt shows only a dash. |

## Where prompt changes go

Prompt changes are made with short scripts that use `nexSys.api.prompt`.
They last until nexSys next loads, so put them in a `SystemLoaded` function
in your `nexSys4.userSettings` group. [Customizing nexSys](./customizing.md)
explains both.

When nexSys starts automatically at login, the package applies its own prompt
style about five seconds after loading, and that replaces any layout set
before then. Apply your changes after a short delay so yours come last:

```js
// Function "SystemLoaded" in nexSys4.userSettings
setTimeout(() => {
  const { prompt } = nexSys.api;
  // your prompt changes go here
}, 6000);
```

Don't edit the package's own prompt function (`promptCustomization` in the
`prompt` group). Updates replace it. The `ns prompt` alias re-applies that
packaged style.

## Change colors and abbreviations

Each affliction on the prompt has an abbreviation and colors. Change them with
`updateAffs()`:

```js
const { prompt } = nexSys.api;

prompt.updateAffs({
  asthma: { text: "ASTHMA", fg: "gold" }, // new text and color
  paralysis: "PARA", // a plain string changes only the text
  corruption: null, // null removes the entry
});
```

The cure colors are a named palette you can reuse, keyed by cure: `ferrum`,
`aurum`, `mending`, `restoration`, and so on. Changing a palette color
doesn't recolor afflictions that already use it, so apply it as you update
them:

```js
prompt.updateCureColors({ ferrum: { fg: "orange" } });

const colors = prompt.cureColors;
prompt.updateAffs({
  darkshade: { text: "dark", ...colors.ferrum },
  addiction: { text: "add", ...colors.ferrum },
});
```

`updateVars()` changes the colors of the other prompt values, such as
`prompt.updateVars({ h: { fg: "lime" } })`. Colors can be any CSS color name
or hex code.

## Replace the layout

`prompt.set()` replaces the whole layout with a function of your own. nexSys
runs your function at every prompt and hands it a builder `b`:

```js
nexSys.api.prompt.set((b) => {
  const { vars } = b;

  if (vars.blackout) {
    b.add("-");
    return;
  }

  b.add("paused").add("aeon").add("retard");
  b.add("h").add(`(${vars.ph.text}) `, vars.h.fg);
  b.add("m").add(`(${vars.pm.text}) `, vars.m.fg);

  if (nexSys.api.class.is("Occultist")) {
    b.add(`${vars.karma.text}K `, vars.karma.fg);
  }

  b.add("eq").add("bal").add(" ").addAffs().addDiff().addTarget();
});
```

Because the function runs at every prompt, it can check anything about your
character, such as your class, and always shows the current state. You never
need to refresh it.

### The builder

| Method | Adds |
| --- | --- |
| `b.add(name)` | A prompt value with its own colors, such as `b.add("h")`. See the table below. |
| `b.add(text, fg, bg)` | Your own text, with optional foreground and background colors. If the text is the name of a prompt value, the value is shown instead. |
| `b.addAffs()` | The affliction list. |
| `b.addDiff()` | The health and mana change since the last prompt. |
| `b.addTarget()` | Your target and their health, such as `[Name: 85%]`. Shows nothing without a target. |
| `b.addHTML(html)` | Raw HTML. Use only HTML you trust. |

`b.vars`, `b.affs`, and `b.cureColors` hold the current values, and every
method returns `b`, so calls can be chained.

### Prompt values

| Name | Shows |
| --- | --- |
| `h`, `m`, `e`, `w` | Current health, mana, endurance, and willpower, colored by percentage |
| `maxh`, `maxm`, `maxe`, `maxw` | Maximum health, mana, endurance, and willpower |
| `ph`, `pm`, `pe`, `pw` | The same as percentages, such as `91.6%` |
| `eq`, `bal` | `e` and `x` while you have equilibrium and balance |
| `c`, `k`, `d`, `b` | `c`, `k`, `d`, `b` while cloak, kola, deafness, and blindness are up |
| `shield`, `prismatic`, `curseward`, `reflections`, `bloodshield` | A marker while that defence is up |
| `paused`, `aeon`, `retard` | `(p)`, `(a)`, and `(r)` |
| `karma`, `rage`, `transcendence`, `essence`, `kai` | Class resources, while your class has them |
| `target`, `targetHP` | Your target and their health |
| `blackout` | `true` while you're dead. A flag to test, not text to show. |

Each value has `text`, `fg`, and `bg`, such as `b.vars.ph.text`.

### If your layout has an error

If your function throws an error, nexSys logs it to the browser console and
shows the standard layout for that prompt. Your function is tried again at the
next prompt.

## Restore the standard layout

```js
nexSys.api.prompt.reset();
```

`reset()` removes your layout. Color and abbreviation changes stay until
nexSys next loads.

## For scripters

- `nexSys.api.prompt.enabled` reads or sets the Custom Prompt setting.
- `nexSys.state.prompt` holds a read-only copy of the current `vars`, `affs`,
  and `cureColors`.
- The full list of prompt methods is in the
  [API reference](../reference/api.md#apiprompt).
