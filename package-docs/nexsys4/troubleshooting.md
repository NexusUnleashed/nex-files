---
title: Troubleshooting
description: First checks for nexSys4 installation, startup, output, and state issues.
---

# Troubleshooting

## `nexSys` is missing or only exposes `bootstrapNexus`

The runtime bundle has either not loaded or has not been bootstrapped. Confirm
the nexSys4 package groups are enabled, then call `nexSys.bootstrapNexus()` if
you installed through the JavaScript bundle. After successful startup the live
global has `state`, `api`, and `events` roots.

## The configuration dialog does not open

Use the v4 API path:

```js
nexSys.api.ui.openConfig();
```

Older nexSys3 commands and global shortcuts are not the v4 contract.

## Settings appear not to save

Configuration controls edit a draft. Select **Save**, not Cancel. Then inspect
`nexSys.state.system.settings` for the persisted local settings and
`nexSys.state.serverside` for desired, observed, and pending server state.

## nexSys4 is not sending normal output

Inspect runtime controls:

```js
nexSys.state.system.runtime;
```

Check `paused`, `slowMode`, the startup phase, and any startup failure message.
Also review **Queue while paused** if the symptom only affects queues.

## A queue was changed locally but not on the server

`queue.clear()` clears only the local mirror. Use `queue.clearQueue()` when the
server queue must also be cleared. The queue `flushed`, `sent`, and `fired`
events represent different stages; see the [Queues guide](./guides/queues.md).

## Collecting a bug report

Capture the package version shown in the configuration title bar, the relevant
console error, and a serialized state snapshot:

```js
copy(JSON.stringify(nexSys.state, null, 2));
```

State may include character, target, room, and inventory information. Review
the snapshot before sharing it publicly.

