---
title: Commands (nm)
description: The in-client nexMap4 command and alias reference.
---

# Commands (`nm`)

nexMap4 exposes an in-client command surface under the `nm` prefix. Each `nm`
command parses to a canonical command id and runs through the same router the
[public API](../reference/api.md) uses. Type `nm help` in the client (or open the
shell's **Help** tab) for the live, version-accurate list.

```text
nm goto 315
nm help
```

## Travel

| Command | Action |
| --- | --- |
| `nm goto <room id\|landmark\|area>` | Resolve a destination and begin travel. |
| `nm stop` | Stop the active route. |

## Map

| Command | Action |
| --- | --- |
| `nm roominfo` | Print current room details. |
| `nm info` | Print a full GMCP + crowdmap diagnostic for the current room. |
| `nm zoom <level>` | Set the map zoom level. |
| `nm fit` | Fit the viewport to the visible area. |
| `nm center` | Center the viewport on the current room. |
| `nm refresh` | Refresh the map renderer. |
| `nm setbg <url>` / `nm background <url>` | Set the background image (`off` clears it). |

## Search

| Command | Action |
| --- | --- |
| `nm find <text>` | Search room names; opens the Results dialog. |
| `nm area <text>` | Search area names. |
| `nm gamearea <text>` | Resolve Game Area labels to crowdmap areas. |
| `nm npc <text>` | Search denizens; opens the Results dialog. |

## Landmarks

| Command | Action |
| --- | --- |
| `nm mark <name>` | Save the current room as a landmark. |
| `nm unmark <name>` | Remove a saved landmark by name. |
| `nm marks` | List saved landmarks (opens the Landmarks panel). |

## Wormholes

| Command | Action |
| --- | --- |
| `nm wormholes on\|off` | Enable or disable wormhole travel. |
| `nm wormholes [list]` | List loaded remote wormholes. |
| `nm wormholes refresh` | Reload wormholes and refresh pathing edges. |
| `nm wormholes probe [command]` | Send a probe command and arm the parser. |
| `nm wormholes add <source> <target>` | Create or replace a wormhole. |
| `nm wormholes remove [source]` | Remove a wormhole by source room. |

`nm wormhole …` (singular) is accepted as well.

## Travel-class toggles

| Command | Toggles |
| --- | --- |
| `nm clouds on\|off` | `eagleWings` + `atavianWings` |
| `nm highclouds on\|off` | `atavianWings` (alias: `nm atavianwings`) |
| `nm lowclouds on\|off` | `eagleWings` (alias: `nm eaglewings`) |
| `nm wings on\|off` | All three wing classes |
| `nm sewergrates on\|off` | `sewergrate` (aliases: `nm sewergrate`, `nm grates`) |
| `nm universe on\|off` | `universe` |
| `nm knocker on\|off` | `knocker` |
| `nm airharness on\|off` | `airHarness` |

## Tracking

| Command | Action |
| --- | --- |
| `nm track <room id> <name>` | Track a target at a known room. |
| `nm track-pet <room id> <name>` | Track a pet at a known room. |
| `nm untrack [subject]` | Clear one tracked subject, or all overlays. |

## Intelligence

| Command | Action |
| --- | --- |
| `nm fullsense <name>[, <name>…]` | Highlight one or more fullsense entries on the map. |

## System

| Command | Action |
| --- | --- |
| `nm config` / `nm settings` | Open the settings dialog. |
| `nm shell` | Open the shell (Landmarks / NPCs / Help). |
| `nm help` | Show command help. |

## Running commands from JavaScript

`parseAndExecute` runs an `nm` command body programmatically — the `nm` prefix is
optional:

```js
nexMap.api.commands.parseAndExecute("goto 315");
nexMap.api.commands.parseAndExecute("wormholes add 4270 328");
```

Unknown verbs return a friendly error notice; an `nm` command that maps to a
newer-than-installed feature asks you to update nexMap4 rather than failing
silently.
