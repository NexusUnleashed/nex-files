---
title: Quickstart
description: Get oriented with the nexGui4 layout, panels, and options after install.
---

# Quickstart

This walkthrough assumes nexGui4 is installed and has reached the `RUNNING`
phase (see [Installation](./installation.md)).

## 1. Find the game display

nexGui4 takes over the Nexus output area with its own live transcript. Output
is **hard-pinned to the bottom** — it always follows the newest line. There is
no inline scroll-lock: rolling the mouse wheel up opens the
[scrollback modal](../guides/main-display.md) instead.

## 2. Open the panels

nexGui4 registers its panels as Nexus FlexLayout tabs. They can be docked,
floated, resized, and rearranged like any other Nexus tab. The
[Panels guide](../guides/panels.md) lists every tab and what it shows
(Players, NPCs, Items, Party, Timers, Defences, Stats, Target, Feed, the
System / Combat streams, Options, and Metrics).

## 3. Configure options

Open the **Options** panel. Its four tabs cover everything configurable:

1. **Game** — Nexus host toggles (echo input, prompts, timestamps) and nexGui
   behavior (side streams, damage numbers, message replacement).
2. **Panels** — panel font size, background image, opacity, and hue.
3. **Display** — game-display font, plus ally/enemy and target formatting.
4. **Advanced** — login tracker, log download, native display, and more.

See the [Options guide](../guides/options.md) for the meaning of each setting.
Options persist per character.

## 4. Save your layout

Once the panels are arranged how you like them, persist the arrangement:

```js
nexGui.api.layout.save();
```

Restore it later, or apply a built-in preset:

```js
nexGui.api.layout.list(); // available preset ids
nexGui.api.layout.restore(); // re-apply your saved layout
```

## 5. Inspect live state

Once logged in, read a few read-only snapshots from the console:

```js
nexGui.state.character;
nexGui.state.room;
nexGui.state.target;
nexGui.state.party;
```

For a complete, copyable debug snapshot:

```js
JSON.stringify(nexGui.state, null, 2);
```

`nexGui.state` is the preferred shape for bug reports — it is JSON-serializable
and contains no function values. Continue with the
[Reference overview](../reference/index.md).
