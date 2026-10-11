---
title: Commands
description: Every in-game alias that ships with the nexSys4 package.
---

# Commands

You drive nexSys with short aliases typed on the game's command line. They
come with the nexSys4 package. `ns load`, `ns config`, `ns stuck`, and
`ns debug` are always available. The rest switch on once nexSys has finished
loading.

## Start and configure

| Command | What it does |
| --- | --- |
| `ns load` | Start nexSys. Only needed when it hasn't started automatically. See [Load on login](./configuration/system.md#nexsys-config). |
| `ns config` | Open the configuration window. |
| `ns prompt` | Re-apply the packaged prompt style. |
| `ns stuck` | Get nexSys moving again if it has stopped sending curing and defence commands. |
| `ns debug` | Echo every command sent to the game, including nexSys's, and show the queue messages nexSys normally hides. Type it again to turn this off. |

## Pausing and curing

| Command | What it does |
| --- | --- |
| `pp` | Pause nexSys, or resume it if it's paused. |
| `pp on` | Pause nexSys. |
| `pp off` | Resume nexSys. |
| `hh` | Swap sip priority between health and mana. The change is saved. |

Pausing turns Achaea's server-side curing off (`CURING OFF`) and holds your
queued commands. Resuming turns curing back on. The prompt shows `(p)` while
nexSys is paused. See [Pausing](./how-it-works.md#pausing) for the other
things that pause nexSys.

## Targeting

| Command | What it does |
| --- | --- |
| `t <name>` or `tt <name>` | Set your target. nexSys sends `SETTARGET <name>`, so the game and every package share one target. |

## Defences

| Command | What it does |
| --- | --- |
| `defup` | Raise your defences: every missing defence with a priority, including those marked **Defup**. |
| `defoff` | Lower your defences. nexSys stops raising all of them and switches off the ones that have an off command, such as metawake and endure. Type `defup` to go back to normal. |
| `ma` | Turn density (mass) upkeep on or off. |
| `br` | Turn held breath upkeep on or off. |
| `ss` | Turn rebounding upkeep on or off. |
| `cl` | Turn cloak upkeep on or off. |
| `block <direction>` | Block an exit, and keep blocking it if you're knocked out of it. |
| `ub` | Unblock, and stop keeping the block up. |

The upkeep toggles switch a defence between priority `0` (off) and `25`.

### Parrying

`p` followed by a limb code parries that limb and keeps parrying it. Classes
that guard instead of parrying guard the limb, and Dragons use clawparry.

| Command | Limb |
| --- | --- |
| `ph` | Head |
| `ptt` | Torso |
| `pla` / `pra` | Left arm / right arm |
| `pll` / `prl` | Left leg / right leg |
| `pl` / `pr` / `pc` | Left / right / centre, for classes that parry those |

## Queues

| Command | What it does |
| --- | --- |
| `qa <command>` | Add a command to the end of the free queue. |
| `qp <command>` | Put a command at the front of the free queue. |
| `qcp <command>` | Put a command at the front of the class queue. |
| `dor <command>` | Repeat a command: nexSys queues it again every time the free queue fires. |
| `dor` | Stop repeating and clear the free queue. |

See [Queues](./queues.md) for what each queue waits for and how queued
commands are sent.

## Adding your own

Add your own aliases to the `nexSys4.userSettings` group so updates keep
them. [Customizing nexSys](./customizing.md) shows how, with examples.
