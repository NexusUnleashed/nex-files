---
title: Quickstart
description: Review your curing setup, learn the everyday commands, and check that nexSys is working.
---

# Quickstart

This page walks you through your curing setup and the commands you'll use
every day. It assumes nexSys is installed and running. If it isn't, start
with [Installation](./installation.md).

nexSys works well out of the box. Expect to spend about ten minutes here,
most of it on defences.

## 1. Open the configuration window

```text
ns config
```

The window has five tabs: **System**, **Aff Priorities**, **Defences**,
**Precache**, and **Colors**. Nothing you change takes effect until you
select **Save**. **Cancel**, or closing the window, throws your changes away.

## 2. System

Check these settings first:

- **Load on login**: switch it on so nexSys starts every time you log in.
- **Curing type**: choose the curing skill your character uses,
  **Transmutation** (minerals) or **Concoctions** (herbs).
- **Sip priority**: what to sip first when both health and mana are low.
  The `hh` alias swaps it in game.
- **Thresholds**: when to sip and eat moss. The defaults suit most
  characters.

Every setting is explained in [System settings](../guides/configuration/system.md).

## 3. Aff Priorities

nexSys ships with recommended affliction priorities, so there's nothing you
have to change here. To make an affliction more or less urgent, drag it to
another column. **Prio 1** is cured first, and **Ignored 26** is never cured.

Leave columns 1 to 3 empty. nexSys's [rules](../guides/rules.md) use them to
push an affliction to the front when the situation calls for it.

## 4. Defences

The class list starts on your current class. For each defence:

- **Priority** `1` to `25` means nexSys looks after the defence. Lower numbers
  go up first. `0` means nexSys leaves it alone.
- **Defup** checked means the defence goes up only when you type `defup`.
  Unchecked means nexSys keeps it up all the time and raises it again if
  it's stripped.

Defence names are colored by cost. Red ones take balance or equilibrium to
raise, so give them the lowest priority or leave them for `defup`. See
[Defences](../guides/configuration/defences.md) for the details.

## 5. Precache

Each number is how many of that herb or mineral to carry. nexSys takes more
out of your rift when you're short and puts extras back. With the default of
`0`, that curative stays in your rift. See
[Precache](../guides/configuration/precache.md).

## 6. Save

Select **Save**. nexSys stores your configuration and updates Achaea's
server-side curing straight away.

## Everyday commands

| Command | What it does |
| --- | --- |
| `pp` | Pause or resume nexSys. Pausing also turns server-side curing off. |
| `defup` | Raise your defences. |
| `defoff` | Lower your defences. |
| `t <name>` | Set your target. |
| `qa <command>` | Queue a command to run as soon as you have balance. |
| `ns config` | Open the configuration window. |

All the aliases are on the [Commands](../guides/commands.md) page.

## Check that it's working

- Your prompt is the nexSys prompt. A `(p)` at the front means nexSys is
  paused. Type `pp` to resume.
- Notices such as `[-nexSys-] +aff asthma` appear as you gain and lose
  afflictions. You can choose which notices you see on the System tab.
- In game, `CURINGSET LIST` shows `nexsys4-default` as your active curing
  set.

## Next steps

- [How nexSys works](../guides/how-it-works.md) explains what nexSys does at
  login and on every prompt.
- The [Configuration](../guides/configuration/index.md) guide covers every
  setting.
- [Customizing nexSys](../guides/customizing.md) shows how to add your own
  aliases and scripts without losing them to updates.
