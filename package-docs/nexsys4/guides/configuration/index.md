---
title: Configuration
description: Open the nexSys4 configuration window and find your way around its tabs.
---

# Configuration

Everything you need to set up lives in one window. Open it from the game's
command line:

```text
ns config
```

## Saving and cancelling

The window works on a draft copy of your configuration:

- **Save** applies your changes and stores them. nexSys reconciles affected
  curing settings and rule choices through its normal output cycle.
- **Cancel**, or closing the window, throws the draft away.

Saved configuration is kept in the Nexus variable `nexSys4Settings`, and it
survives nexSys's automatic updates. This includes rule and pack switches
saved from the **Rules** tab. Nexus handles server persistence through its
normal character-settings save mechanism.

## Tabs

| Tab | What you set there |
| --- | --- |
| [System](./system.md) | Load on login, notices, curing type, sip priority, and curing thresholds |
| [Aff Priorities](./affliction-priorities.md) | How urgently each affliction is cured |
| [Defences](./defences.md) | Which defences nexSys keeps up, and which go up only with `defup` |
| [Precache](./precache.md) | How many of each herb and mineral to carry |
| [Rules](../rules.md#using-the-rules-menu) | Inspect rule conditions and effects, enable individual rules or packs, and save or reset those choices |
| [Colors](./colors.md) | Not available yet |

The screenshots in this section show the layout. Your installed version,
shown at the right of the window's title bar, is the authority for which
settings, afflictions, and defences are available.

## Changing settings without the window

Some settings have their own alias, such as `hh` for sip priority. See
[Commands](../commands.md). Scripters can change any setting with
`nexSys.api.control.applySettings()`. See the [API reference](../../reference/api.md#apicontrol).
