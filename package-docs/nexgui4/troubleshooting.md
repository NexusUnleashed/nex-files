---
title: Troubleshooting
description: First checks for nexGui4 installation, startup, display, and state issues.
---

# Troubleshooting

## `nexGui` only exposes `bootstrapNexus`

The bundle has loaded but the live runtime has not started. Confirm the nexGui4
package groups are enabled, then call `nexGui.bootstrapNexus()`. After a
successful start, `nexGui` is replaced by the live runtime and exposes `state`,
`api`, `mount`, `stores`, `debug`, and `destroy`.

## The display or panels never appear

Check the startup phase:

```js
nexGui.state.system.phase;
```

It should reach `RUNNING`. If it shows `FAILED`, the startup orchestrator hit an
error during boot. If it is stuck earlier, the host layout or styles may not
have been injected — reload the client so bootstrap runs cleanly.

## The panel tabs are missing

The panels are injected into the Nexus FlexLayout at startup. If they are absent,
the layout model was not ready when tabs were generated — reload the client. If a
specific panel is gone after enabling **Native Display Override**, note that the
standalone display tab is intentionally hidden in that mode; disable the override
and reload to restore it.

## I can't scroll the live display up

That is by design. The main display is hard-pinned to the newest output. Scroll
the mouse wheel **up** over it to open the scrollback modal, which holds the full
history. See [The main display & scrollback](./guides/main-display.md).

## A side-stream toggle didn't reroute output

The System / Combat toggles persist UI state only; they do not reroute arbitrary
output. A row appears when a supported event reaches the pipeline or when code
writes to the stream. See [Side streams](./guides/streams.md).

## Settings didn't persist

nexGui4 options are stored per character. Confirm you changed the setting on the
correct character, and inspect the relevant state branch
(`nexGui.state.customize`, `nexGui.state.party`) to see the runtime value.

## Collecting a bug report

Capture the runtime version and a serialized state snapshot:

```js
nexGui.version;
copy(JSON.stringify(nexGui.state, null, 2));
```

State may include character, target, room, and player-directory information.
Review the snapshot before sharing it publicly. (Note: `state.players.directory`
is a `Map` and will serialize as `{}` — enumerate it separately if needed.)
