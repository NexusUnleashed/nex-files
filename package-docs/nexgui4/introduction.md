---
title: nexGui4
sidebar_label: Overview
description: A React UI overlay for the Nexus client that renders the game display, panels, and HUD for Achaea.
---

# nexGui4

nexGui4 is the user-interface layer for Achaea in the Nexus web client. It
replaces the host's output area with a virtualized live transcript, adds a
searchable scrollback buffer, and surrounds the game with docked panels for
players, NPCs, items, party, timers, defences, stats, target, and the game feed.

It is a clean-room rebuild. The public contract it exposes to other Nexus
scripts is deliberately small and predictable:

```text
nexGui
|-- state     deeply frozen, JSON-serializable snapshots
`-- api       domain-oriented functions grouped by namespace
```

External event coordination flows through the host `eventStream`, not a
nexGui-specific bus. See the [event reference](./reference/events.md).

## What it provides

- A virtualized, hard-pinned live game display with an IndexedDB-backed
  scrollback buffer
- Docked, dockable FlexLayout panels for room, party, combat, and character
  state
- `System` and `Combat` side-stream transcripts
- A player directory with inline name coloring for allies, enemies, and your
  target
- Configurable countdown / count-up timer bars
- The Achaea public game feed
- Per-character persisted options for display, panels, and game behavior
- A public JavaScript API (`nexGui.state` / `nexGui.api`) for other packages

## Where to begin

New users should follow [Installation](./getting-started/installation.md) and
then the [Quickstart](./getting-started/quickstart.md). The
[Guides](./guides/index.md) explain each panel and option group.

Package authors and advanced users can start at the
[Reference overview](./reference/index.md).

:::note Relationship to nexSys and nexMap

nexGui is one of the three pillars of the Nexus ecosystem alongside **nexSys**
(curing and automation) and **nexMap** (mapping). They share the global `GMCP`
object as the single source of truth; nexGui reads and keeps it in sync but
never stores nexGui-specific fields on it.

:::
