---
title: Troubleshooting
description: First checks for nexMap4 startup, pathing, the map, and state issues.
---

# Troubleshooting

## `nexMap` is missing

The runtime bundle has not loaded or has not bootstrapped. Confirm the nexMap4
package groups are enabled, then call `nexMap.start()` if you installed through
the JavaScript bundle. After successful startup the global exposes `state`,
`api`, and `settings`.

## The map is blank or startup never finishes

Inspect the startup phase:

```js
nexMap.getStartupState();
```

A phase of `DEGRADED` means startup finished with a recoverable problem — most
often the remote crowdmap fetch failed. nexMap4 still runs with whatever data it
loaded. If it is stuck before `READY`, the host capabilities (`GMCP`,
`eventStream`, `nexAction`, `nexusclient`) may not all be present yet.

## "No nexMap4 route" when traveling

The destination is unreachable under your current settings. Check, in order:

1. **Travel classes.** A needed method may be disabled. Review the
   [Pathing & Travel tab](./guides/configuration/pathing-travel.md) or
   `nexMap.settings.get().disabledTravelClasses`.
2. **City Lockouts / excluded rooms.** The only route may pass through an
   excluded room. Review `nexMap.settings.get().excludedRoomIds` and the
   [City Lockouts tab](./guides/configuration/city-lockouts.md).
3. **Charted rooms.** Both endpoints must exist in the graph. Confirm with
   `nexMap.api.map.getNode(roomId)` — a `null` result means the room is
   uncharted.

`nexMap.api.travel.planRoute(roomId)` returns `null` for the same reasons and is
a quick way to test reachability without moving.

## The settings dialog does not open

Use the v4 path:

```js
nexMap.api.system.openSettings();
```

Older nexMap3 commands and global shortcuts are not the v4 contract.

## Settings appear not to save

The dialog edits a draft — select **Save**, not Cancel. Then inspect the live
document:

```js
nexMap.settings.get();
```

A **Default Zoom** change previews live but only persists on Save; cancelling
restores the previous zoom.

## NPC search fails immediately

`nm npc` and `nexMap.api.search.denizens` require a configured remote denizen
client. If it is not configured the search raises "Denizen search requires a
configured remote denizen client." Room and area search use the local graph and
do not need the remote service.

## My room is wrong or the header says "Loading room context"

`nexMap.state.location` reports `charted: false` when the current room is not in
the graph. The header and map can only resolve charted rooms. Capture a
diagnostic for a bug report:

```text
nm info
```

## Collecting a bug report

Capture the startup state and a serialized state snapshot:

```js
copy(JSON.stringify({
  startup: nexMap.getStartupState(),
  state: nexMap.state,
  settings: nexMap.settings.get(),
}, null, 2));
```

State and settings may include character, room, and landmark information. Review
the snapshot before sharing it publicly.
