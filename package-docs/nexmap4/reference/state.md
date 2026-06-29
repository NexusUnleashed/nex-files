---
title: State reference
description: The read-only nexMap.state snapshot exposed by nexMap4.
---

# State reference

`nexMap.state` is the read-only status surface — the nexMap4 successor to
nexMap3's `nexMap.status` singleton. Reading it returns a fresh, frozen
snapshot built from the live runtime. It is the **nexMap-derived** view, not a
mirror of the host GMCP globals: consumers that want raw observed data already
have `GMCP.Room.Info` and `GMCP.Location`.

```js
const { location, pathing, path, tracking } = nexMap.state;

if (location.charted) {
  console.log(`In ${location.area?.name}: ${location.room.name} (${location.roomId})`);
}
```

## Top-level branches

| Branch | Value | Contents |
| --- | --- | --- |
| `state.location` | object | Resolved player location (see below). |
| `state.destination` | number \| `null` | Target room id while a route is active, else `null`. |
| `state.path` | object \| `null` | The active plan (`commands`, `rooms`, `segments`), or `null` when idle. |
| `state.pathing` | boolean | `true` while the walker is executing a plan. |
| `state.tracking` | array | Currently tracked subjects (targets, pets, dopplegangers). |

## `state.location`

`roomId` and `lastRoomId` always reflect the observed movement stream.
`room` and `area` are populated only when the current room is **charted** in the
graph; for an uncharted room they are `null` and `charted` is `false`.

| Field | Value | Meaning |
| --- | --- | --- |
| `location.roomId` | number \| `null` | Current observed room id. |
| `location.lastRoomId` | number \| `null` | Previous distinct room — the one fact GMCP cannot supply. |
| `location.charted` | boolean | Whether the room exists in the runtime graph. |
| `location.room` | object \| `null` | `{ id, name, areaId, environment, indoors, x, y, z }` when charted. |
| `location.area` | object \| `null` | `{ id, name, continent }` when charted. |

## `state.path`

Present only while `pathing` is `true`:

| Field | Value | Meaning |
| --- | --- | --- |
| `path.commands` | string[] | Raw movement/action commands for the route. |
| `path.rooms` | number[] | Ordered room ids along the route. |
| `path.segments` | array | Plan segments (per execution leg). |

To compute a plan **without** executing it, use
[`nexMap.api.travel.planRoute()`](./api.md) instead — it returns the same shape
plus `totalWeight`, `sourceRoomId`, and `targetRoomId`.

## Serialization contract

The complete state tree is JSON-serializable and contains no function values:

```js
const report = JSON.parse(JSON.stringify(nexMap.state));
```

This is the preferred shape for debug captures and bug reports. Snapshot objects
are frozen; call a method under `nexMap.api` to request a change.

## Fresh reads

A captured branch does not update in place — each read of `nexMap.state`
produces a new snapshot. Re-read after a movement or pathing transition:

```js
const before = nexMap.state.location;
// the player moves
const after = nexMap.state.location;
```

Use the [event surfaces](./events.md) when an integration needs to know *when*
to re-read.

## Reading a room without moving there

`nexMap.api.map.getNode(roomId)` is a synchronous, in-memory read of a single
graph node (`exits`, `coordinates`, `environment`, `gameArea`, …). It returns
the canonical, frozen node record, or `null` when the room is uncharted. Treat
it as read-only and re-read for fresh state rather than caching across moves.
