---
title: State reference
description: Read-only snapshot branches exposed by nexGui4.
---

# State reference

`nexGui.state` is the read-only data surface. Reading it returns a fresh,
deeply frozen snapshot assembled from the runtime's domain models. Read it with
property access; do not call it.

```js
if (nexGui.state.character.balance) {
  // react to the current snapshot
}
```

## Branches

| Branch | Value | Contents |
| --- | --- | --- |
| `state.system` | object | `version`, `mounted`, and startup `phase`. |
| `state.character` | object | Your character model snapshot. |
| `state.target` | object | Current target model snapshot. |
| `state.party` | object | `members`, `leader`, `selfName`, `settings`. |
| `state.room` | object | `ref` (`id`, `name`), `items`, and `occupants` (`players`, `npcs`). |
| `state.stats` | object | Play-stat tracking for `instance`, `session`, and `month`. |
| `state.players` | object | `directory` (a name-keyed `Map`) and `cityPalette`. |
| `state.timers` | object | `list`: the unfiltered timer snapshot. |
| `state.customize` | object | `defences` (configured checklist) and `classBalance`. |

## Selected branch shapes

### `state.system`

```js
{
  version: "…",
  mounted: true,
  phase: "RUNNING"
}
```

`phase` is one of `INIT`, `PREPARING`, `BOOTING`, `MOUNTING_UI`,
`HYDRATING_LAYOUT`, `RUNNING`, `FAILED`, or `DESTROYED`.

### `state.character`

The character model snapshot includes `name`, `class`, `level`, `gender`,
`balance`, `equilibrium`, `classBalanceType`, `classBalanceReady`,
`currentAffs`, and `limbs`.

### `state.target`

The target model snapshot includes `id`, `name`, `isPlayer`, vitals such as
`hpPercent` / `hpText` / `hpDelta`, `gender`, `currentAffs`, and `limbs`. NPC
targets match room NPCs by `id`; player targets match room players by `name`.

### `state.players`

```js
{
  directory: Map<name, profile>,
  cityPalette: { /* city → color */ }
}
```

`directory` is a frozen `Map` keyed by canonical player name, giving O(1)
lookups (`directory.get("Argwin")`) and iteration (`directory.values()`)
without scanning. Profile values are frozen snapshots. The map is rebuilt only
when the directory changes, so repeated reads between mutations are cheap.

### `state.timers`

```js
{
  list: [ /* timer entries */ ]
}
```

Each entry includes `id`, `durationMs`, `startedAt`, `label`, `direction`,
`position`, `stayVisible`, `groupIds`, `enabled`, `running`, `elapsedMs`, and
`remainingMs`. Use [`nexGui.api.timers.list(filters)`](./api.md#nexguiapitimers)
for filtered queries.

## Serialization contract

The complete state tree is JSON-serializable and contains no function values:

```js
const report = JSON.parse(JSON.stringify(nexGui.state));
```

This is the preferred shape for debug captures and bug reports.

:::note `Map` and JSON

`state.players.directory` is a `Map`. `JSON.stringify` serializes a `Map` as
`{}`; enumerate it directly (`directory.values()`) when you need the entries.

:::

## Fresh reads

A captured branch does not update in place. Read the branch again after a state
transition:

```js
const before = nexGui.state.room;
// the room changes
const after = nexGui.state.room;
```

Stream transcripts (System / Combat) and the main display are **not** part of
`nexGui.state`; they remain internal to the React shell. Use the host
`eventStream` when an integration needs event-driven coordination — see the
[event reference](./events.md).
