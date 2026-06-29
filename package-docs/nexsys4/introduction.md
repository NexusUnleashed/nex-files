---
title: nexSys4
sidebar_label: Overview
description: Character management and curing automation for Achaea in the Nexus client.
---

# nexSys4

nexSys4 is a character-management and curing-automation system for Achaea that
runs inside the Nexus web client. It observes GMCP, text, and prompt boundaries;
maintains a current model of your character; and coordinates curing, defences,
precache, and command queues.

Version 4 is a ground-up rebuild. Its public contract is deliberately small and
predictable:

```text
nexSys
|-- state     frozen, serializable snapshots
|-- api       domain-oriented functions
`-- events    public topic subscriptions
```

It is not a drop-in rename of nexSys3. Existing v3 integrations should be
reviewed against the v4 [state](./reference/state.md),
[API](./reference/api.md), and [event](./reference/events.md) contracts.

## What it manages

- Affliction, defence, balance, limb, target, room, and character state
- Server-side curing settings and priority reconciliation
- Prompt-bound curing and defence output
- Local and server-backed command queues
- Herb and mineral precache targets
- A configurable custom prompt
- Runtime rules for temporary priority and curing behavior
- Public JavaScript and EventStream events for other packages

## Where to begin

New users should follow [Installation](./getting-started/installation.md) and
then the [Quickstart](./getting-started/quickstart.md). The
[Configuration guide](./guides/configuration/index.md) explains every tab in
the built-in dialog.

Package authors and advanced users can start at the
[Reference overview](./reference/index.md).

:::note Version 3 documentation

nexSys3 documentation describes a different runtime and API. It will remain
available in the nexFiles archives once the rebuilt site is published.

:::

