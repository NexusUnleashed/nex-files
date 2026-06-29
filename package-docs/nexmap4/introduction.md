---
title: nexMap4
sidebar_label: Overview
description: Map, pathfinding, and travel automation for Achaea in the Nexus client.
---

# nexMap4

nexMap4 is a mapping, pathfinding, and travel-automation system for Achaea that
runs inside the Nexus web client. It ingests the community crowdmap, builds a
runtime graph of every charted room, renders the current area on an interactive
map tab, and routes your character anywhere on the graph — by room id, landmark,
or area — using either server-assisted `path track` batches or client-stepped
movement.

Version 4 is a ground-up rebuild with strict ownership boundaries and a small,
predictable public contract:

```text
nexMap
|-- state      frozen, serializable location/path snapshot
|-- api        domain-oriented functions (travel, map, search, …)
`-- settings   persisted options and live subscriptions
```

It is **not** a drop-in replacement for nexMap3 — it is a clean redesign with a
testable core engine and a Nexus-isolated platform adapter. Existing v3
integrations should be reviewed against the v4
[state](./reference/state.md), [API](./reference/api.md), and
[settings](./guides/configuration/index.md) contracts.

## What it does

- Builds a runtime graph from the Achaea crowdmap and renders it as an SVG map tab
- Pathfinds between rooms, landmarks, and areas with travel-class–aware weights
- Executes routes in **Hybrid Track** (batched `path track`) or **Client Step** modes
- Manages fast-travel classes (wings, wormholes, sewer grates, universe, …)
- Saves and navigates to custom **landmarks**
- Searches rooms, areas, and **denizens (NPCs)**, with click-to-travel results
- Tracks targets, pets, and dopplegangers as live map overlays
- Highlights farsee / fullsense intelligence on the map
- Excludes hostile **city gate rooms** from pathing (City Lockouts)
- Exposes a public JavaScript API, a `nm` command surface, and `nexmap4.*`
  EventStream topics for other packages

## Where to begin

New users should follow [Installation](./getting-started/installation.md) and
then the [Quickstart](./getting-started/quickstart.md). The
[Guides](./guides/index.md) explain the map interface, configuration dialog,
landmarks, NPC lookups, and travel.

Package authors and advanced users can start at the
[Reference overview](./reference/index.md).

:::note Version 3 documentation

nexMap3 documentation describes a different runtime and API. It will remain
available in the nexFiles archives once the rebuilt site is published.

:::
