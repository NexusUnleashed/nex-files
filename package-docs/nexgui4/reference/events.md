---
title: Event reference
description: How to coordinate with nexGui4 over the host eventStream.
---

# Event reference

nexGui4 does **not** expose its own event bus. There is no `nexGui.events`
root, no per-domain `subscribe()`, and no public topic catalog on the runtime.

The public boundary for events is the host **`eventStream`**. nexGui4 listens to
a small, explicit set of host / `eventStream` events and keeps the shared
`GMCP` object in sync; external packages read that same `GMCP` and `eventStream`
rather than a nexGui-specific surface.

## Coordinating with nexGui4

### Push a line into a side stream

Several `eventStream` events already render into the System / Combat streams when
they reach the message pipeline:

```js
eventStream.raiseEvent("Char.Defences.Add", {
  name: "rebounding",
  desc: "A shimmering shield surrounds you.",
});
```

The full list of supported events and the side they render on is in the
[Side streams guide](../guides/streams.md). For custom rows that do not match a
supported event, use [`nexGui.api.stream.add(...)`](./api.md#nexguiapistream)
instead of raising an event.

### Read current state

To react to nexGui4's view of the world, read the relevant
[state branch](./state.md). State snapshots are fresh on every read, so poll or
re-read after the host event you already listen to:

```js
const target = nexGui.state.target;
const room = nexGui.state.room;
```

## GMCP is the shared source of truth

`GMCP` is the central, mutable state authority for the whole Nexus client and
its packages (nexGui, nexSys, nexMap). nexGui4 reads `GMCP` directly and, when
it computes something other packages should see, updates the **existing** GMCP
schema in place. It never freezes, clones, or adds nexGui-specific fields to
`GMCP`. Treat `GMCP` as the canonical cross-package model.

## Internal event bus (not public)

Internally, nexGui4 runs a private event bus over `nexgui4.*` topics (system,
ingress, domain, and UI groups) to move data between its own layers. This bus is
implementation detail: it is not installed on `nexGui`, its topic names are not a
stable contract, and external scripts should not depend on it. Use `eventStream`
and `nexGui.state` instead.
