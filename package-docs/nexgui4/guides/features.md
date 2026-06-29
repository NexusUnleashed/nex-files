---
title: Features
description: Headline nexGui4 features beyond the core panels.
---

# Features

This page summarises the higher-level features nexGui4 layers on top of the
panels and display. Each links to the relevant API where one exists.

## Player directory & name coloring

nexGui4 maintains a player directory keyed by name. At startup it warms the
directory from cache and then refreshes it from a crowdsourced remote service,
so it knows the city of thousands of players. That data drives **inline name
coloring** in the main display and panels: names are tinted by city and marked
by relationship (ally, enemy, city-enemy) and target.

Look players up from scripts:

```js
nexGui.api.players.get("Argwin"); // in-memory profile, or null
nexGui.api.players.color("Argwin"); // display color
await nexGui.api.players.fetch("Argwin"); // force a refresh
```

Enumerate the whole directory from state — it is a name-keyed `Map`, not an
array scan:

```js
nexGui.state.players.directory.get("Argwin");
```

### Quick-Who formatting

`nexGui.api.players.qwFormat(entries)` re-renders a captured Quick-Who (`qwc`)
list as a city-grouped table and paints it to the game window. Pass bare names
or `{ name, city }` records. See
[`nexGui.api.players`](../reference/api.md#nexguiapiplayers).

## Character database (CDB)

`nexGui.api.cdb` is a deliberately small window onto character data:

```js
await nexGui.api.cdb.get("Argwin"); // live Achaea public API lookup
await nexGui.api.cdb.query({ level: { $lt: 50 } }); // filtered store query
```

`get` reads the live Achaea API directly; `query` runs a filtered query against
the stored character database. An empty filter resolves to `[]` without a
network call. See [`nexGui.api.cdb`](../reference/api.md#nexguiapicdb).

## Timers

![Active Timers](../assets/timers-panel-active.png)

nexGui4 renders configurable timer bars in the Timers panel. Create countdown or
count-up timers from scripts:

```js
// A countdown that starts immediately
nexGui.api.timers.add("balance", 4000, "Balance", { autoStart: true });

// A dormant count-up "ready" indicator
nexGui.api.timers.add("treeTattoo", 60000, "Tree Tattoo", {
  direction: "countup",
});
```

Timers can carry group metadata for filtered `list` / `clear` calls. The full
option set is in [`nexGui.api.timers`](../reference/api.md#nexguiapitimers).

## Game feed

![Game Feed](../assets/feed-panel-live.png)

The Feed panel (`nexFeed`) displays the Achaea public game feed, polled in the
background while the runtime runs.

## Login tracker

When enabled (Advanced options), the login tracker emits formatted login /
logout notices by diffing the who list against Achaea's public roster. It honors
ally / enemy and target formatting and excludes your own character.

## Side streams

![Combat Stream Replacements](../assets/combat-stream-replacements.png)

The System and Combat streams give defences, afflictions, target info, and skill
replacements their own transcripts. See [Side streams](./streams.md).

## Scrollback & logs

The IndexedDB-backed scrollback buffer and HTML log export are covered in
[The main display & scrollback](./main-display.md).
