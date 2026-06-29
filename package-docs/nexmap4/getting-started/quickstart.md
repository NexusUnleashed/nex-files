---
title: Quickstart
description: Travel, configure, and verify state in nexMap4.
---

# Quickstart

This walkthrough assumes nexMap4 has started and the map tab is visible. See
[Installation](./installation.md) if `nexMap` is not yet available.

## 1. Find the map tab

The nexMap4 tab has three persistent regions:

- A **room header** showing the current area, room name, and room id.
- The **map** itself — pan with drag, zoom with the wheel, click a room to travel to it.
- An **exits footer** with a clickable button for each exit of the current room.

See [The map interface](../guides/interface.md) for the full layout.

## 2. Travel somewhere

Type an `nm` command in the client input, or call the API from the console.

```text
nm goto 315          # travel to room id 315
nm goto Delos        # travel to an area by name
nm goto cc1          # travel to a saved landmark
```

```js
nexMap.api.travel.toRoom(315);
nexMap.api.travel.goto("Delos");
nexMap.api.travel.stop();
```

`goto` resolves a room id, landmark, or area name and routes to it. Clicking a
room on the map does the same thing.

## 3. Open configuration

```text
nm config
```

```js
nexMap.api.system.openSettings();
```

The dialog has three tabs: **Pathing & Travel**, **Display**, and
**City Lockouts**. On Pathing & Travel, choose your pathing mode and enable the
fast-travel methods your character actually has. See
[Configuration](../guides/configuration/index.md) for every setting.

## 4. Save a landmark

Stand in a room you visit often and mark it:

```text
nm mark home
nm goto home
nm marks            # open the Landmarks panel
```

```js
nexMap.api.landmarks.add("home");
nexMap.api.landmarks.list();
```

See [Landmarks](../guides/landmarks.md).

## 5. Look up an NPC

```text
nm npc Orinula
```

The NPC explorer lists matching denizens and their known rooms; clicking a row
travels there. See [NPC lookups](../guides/npc-lookups.md).

## 6. Verify live state

```js
nexMap.state.location;     // { roomId, lastRoomId, charted, room, area }
nexMap.state.pathing;      // true while a route is executing
nexMap.state.path;         // the active plan, or null
nexMap.state.tracking;     // tracked subjects
```

For a complete, copyable debug snapshot:

```js
JSON.stringify(nexMap.state, null, 2);
```
