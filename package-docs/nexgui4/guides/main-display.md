---
title: The main display & scrollback
description: How the live game transcript and the scrollback search modal behave.
---

# The main display & scrollback

nexGui4 renders the game itself, not just panels around it. The main display
replaces the Nexus output area with a virtualized transcript, and the full
history lives in a separate, searchable scrollback buffer.

## Live display behavior

The main display is a **hard-pinned live sink**: it always shows the newest
output and stays scrolled to the bottom. There is no inline scroll-lock — you
cannot scroll the live view up in place.

Instead, the live view receives only a capped live-tail window for performance,
and the prompt renders as a footer beneath the transcript rows. MXP / clickable
links in the output work as normal.

## Opening scrollback

Rolling the mouse wheel **up** over the main display opens the **scrollback
modal** — a resizable, draggable window over the full history. From there you
can scroll the entire buffer and search it without disturbing the live feed.

The scrollback buffer is backed by IndexedDB, so it can hold a long session's
history without bloating memory. The buffer is cleared at the start of each new
session.

## Downloading logs

Two Advanced options turn the scrollback into a saved log (see
[Options → Advanced](./options.md#advanced)):

- **Auto-Download Log on Logout** writes the buffer to an HTML log when you
  disconnect.
- **Virtualized HTML Logs** produces an interactive, virtualized HTML viewer
  suited to very long sessions.

## Display styling

The game-display font, font size, and wrapped-line indentation are configured
on the [Display options tab](./options.md#display). These apply to both the live
transcript and the scrollback modal.

## Native display override

By default the main display is its own surface. The **Native Display Override**
(Advanced options) instead mounts it directly into the Nexus output area. See
[Layout & presets → Native display](./layout.md#native-display).
