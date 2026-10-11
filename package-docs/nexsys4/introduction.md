---
title: nexSys4
sidebar_label: Overview
description: Curing and character management for Achaea, running inside the Nexus web client.
---

# nexSys4

nexSys4 is a curing and character-management system for Achaea that runs
inside the Nexus web client. It keeps track of your afflictions, defences,
balances, limbs, and curatives, and it runs Achaea's server-side curing for
you, so you can concentrate on the fight.

You install it like any other Nexus package and set it up from an in-game
configuration window. **You do not need to write any code to use nexSys.**

## What nexSys does for you

- **Runs server-side curing.** nexSys sets up its own curing set, applies
  your affliction priorities, defence priorities, and curing settings, and
  keeps the game in step with them. It only ever sends the changes that are
  needed.
- **Adjusts curing as the fight changes.** Built-in rules move priorities
  for specific situations, such as while you have aeon or when a lock is
  close. When the situation passes, everything goes back to your settings
  on its own.
- **Uses class cures the server can't.** Abilities such as Fitness,
  Dragonheal, Shrugging, and Bloodboil are used automatically when the
  situation calls for them.
- **Keeps your defences up.** Choose which defences stay up all the time and
  which go up only when you type `defup`.
- **Manages your curatives.** Precache keeps a set number of each herb and
  mineral in your inventory and moves the rest to your rift.
- **Queues your commands.** Short aliases put commands into Achaea's queues,
  so they fire as soon as you have balance.
- **Replaces your prompt.** A compact prompt shows your vitals, balances, key
  defences, and current afflictions colored by cure.
- **Grows with you.** You can add your own rules, restyle the prompt, and
  react to events. Other packages, such as nexBash4, build on nexSys.

## Where to start

| If you are... | Start with |
| --- | --- |
| New to nexSys | [Installation](./getting-started/installation.md), then the [Quickstart](./getting-started/quickstart.md) |
| Coming from nexSys3 | The site-wide [Upgrading from Version 3](/docs/upgrading-to-v4/) checklist, then [Installation](./getting-started/installation.md) |
| Looking for an alias | [Commands](./guides/commands.md) |
| Wondering why nexSys did something | [How nexSys works](./guides/how-it-works.md) |
| Customizing or scripting | [Customizing nexSys](./guides/customizing.md), [Rules](./guides/rules.md), and the [Reference](./reference/index.md) |
| Stuck | [Troubleshooting](./troubleshooting.md) |

## nexSys4 and nexSys3

nexSys4 is a ground-up rebuild, not an update to nexSys3. The two cannot run
side by side, and nexSys3 scripts that call into nexSys need to be reviewed
against the v4 [Reference](./reference/index.md). When you install nexSys4,
it imports your nexSys3 curing settings, defence priorities, and precache
amounts automatically. See
[Coming from nexSys3](./getting-started/installation.md#coming-from-nexsys3).

:::note Version 3 documentation

nexSys3 documentation describes a different runtime and API. It will remain
available in the nexFiles archives once the rebuilt site is published.

:::
