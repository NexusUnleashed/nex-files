---
title: Troubleshooting
description: Fixes for common nexSys4 problems, from startup to stuck curing.
---

# Troubleshooting

Find the symptom that matches what you see.

## nexSys does not start

### Check your command separators first

This is the most common cause of startup problems. It can show up as a
`startup failed` message, as a startup that never finishes, or as queued
commands that run straight away instead of waiting.

nexSys joins the commands it sends with your in-game command separator. Two
things break that:

- Your in-game separator is the same symbol as Nexus's **Command Stack
  Delimiter** (gear icon, then **Advanced**). Nexus splits nexSys's commands
  apart before they reach Achaea.
- You've never set an in-game separator, so Achaea can't split them at all.

To fix it:

1. Type `CONFIG` and find **CommandSeparator**.
2. If it's missing or matches the Nexus delimiter, set a different one, such
   as `CONFIG COMMANDSEPARATOR ;;`. Do this while nexSys is loaded, even if
   its startup failed, so nexSys records the change.
3. Refresh the Nexus page and log in again.

nexSys remembers your separator between sessions. If you change it while
nexSys isn't loaded, nexSys keeps using the old one until it sees the game
report a change. Set the separator again with nexSys loaded to update it.

### `ns load` does nothing

- **eventStream3 isn't loaded yet.** nexSys needs the eventStream3 package,
  and `ns load` does nothing until it has loaded. Check that eventStream3 is
  in your **Reflex Packages** list and switched on. Right after installing
  nexSys, give eventStream3 a few seconds to finish setting up, then try
  again.
- **nexSys is already running.** `ns load` does nothing if nexSys has already
  started. Type `ns config`: if the configuration window opens, nexSys is
  running.

### A red `startup failed` message appears

nexSys stays paused and tells you why:

| Message starts with | What to do |
| --- | --- |
| `nexSys4 needs its own curing set but all ... slots are full` | Delete a curing set you don't use (`CURINGSET DELETE <name>`) or buy another slot with `CURINGSET EXPAND`. Then reload. |
| `nexSys4 could not confirm its curing set` or `could not secure its curing set` | The game didn't answer in time. [Check your command separators](#check-your-command-separators-first), then reload and try again. |
| `Startup snapshots did not converge` or `Startup closing fence` | nexSys didn't receive your curing status or priorities in time. [Check your command separators](#check-your-command-separators-first). If they're fine, it was probably lag: reload and try again. |

To reload, refresh the Nexus page and log in again. nexSys starts
automatically if **Load on login** is on; otherwise, type `ns load`.

### nexSys doesn't start by itself when I log in

Switch on **Load on login**: type `ns load`, then `ns config`, and on the
**System** tab switch on **Load on login** and select **Save**. After its
first start, nexSys only starts by itself when this setting is on.

## The configuration window doesn't open

`ns config` only works while nexSys is running. If nexSys hasn't started,
start it first. Most of nexSys's other aliases also stay off until it has
finished loading. nexSys3 commands and aliases don't work in nexSys4; see
[Commands](./guides/commands.md).

## Curing has stopped

Check your prompt. A `(p)` at the front means nexSys is paused:

| Cause | Fix |
| --- | --- |
| You typed `pp` | Type `pp` again. |
| You typed `CURING OFF` | Type `CURING ON` or `pp`. |
| You died | nexSys resumes when you're resurrected. |

nexSys can also hold back without showing `(p)`:

- **You switched to another curing set.** nexSys printed a notice saying so.
  Type `CURINGSET SWITCH nexsys4-default` to carry on.
- **A rule is holding curing off.** Curing resumes when the situation ends.
  Rules doing this are listed in `nexSys.state.rules.suspendingRules`.
- **nexSys is waiting for the game.** See the next section.

See [Pausing](./guides/how-it-works.md#pausing).

## nexSys has stopped sending commands, but isn't paused

After sending curing changes, nexSys waits until the game confirms them
before it plans again. If that confirmation is lost, nexSys recovers on its
own within a few seconds. To free it straight away, type:

```text
ns stuck
```

## Queued commands run straight away

Commands from `qa`, `qp`, and the other queue aliases should wait for
balance. If they run immediately, your in-game command separator matches the
Nexus Command Stack Delimiter. See
[Check your command separators first](#check-your-command-separators-first).

## My settings didn't save

- Changes in the configuration window only apply when you select **Save**.
- Curing changes typed directly in the game, such as `CURING PRIORITY`, last
  only until nexSys next loads. Use the configuration window for permanent
  changes.
- Importing `nexSys4.nxs` again clears your saved nexSys configuration. You
  never need to re-import it: nexSys updates itself.
- If you saw `Saved nexSys4 settings were in an older format and have been
  reset to defaults`, an update changed how settings are stored. Set them
  again in `ns config`.

## My own aliases or edits disappeared

nexSys updates itself every time it loads, replacing everything in the
nexSys4 package except the `nexSys4.userSettings` group. Recreate your
changes in that group. See
[Customizing nexSys](./guides/customizing.md).

## My custom prompt keeps being replaced

When nexSys starts automatically, the package applies its own prompt style
about five seconds after loading. Apply your layout after that. See
[Where prompt changes go](./guides/custom-prompt.md#where-prompt-changes-go).

## A defence isn't going up

- Its priority must be between 1 and 25 on the **Defences** tab.
- A defence marked **Defup** only goes up when you type `defup`, and only
  once per `defup`.
- After `defoff`, nothing goes up until you type `defup`.
- Defences that need balance or equilibrium wait until you have them, and an
  affliction can stop a defence from going up for a while.

## nexSys keeps moving curatives in and out of my rift

That's precache. Each number on the **Precache** tab is exactly how many of
that curative to carry: nexSys takes out what's missing and puts extras back.
Set the numbers to what you want to carry. See
[Precache](./guides/configuration/precache.md).

## Seeing what nexSys sends

- `ns debug` echoes every command sent to the game, including nexSys's, and
  shows the queue messages nexSys normally hides. Type it again to turn this
  off.
- The **General output** notice prints each batch of commands nexSys sends.
- **Debug output** on the System tab writes detailed diagnostics to the
  browser console.

## Reporting a bug

Include as much of this as you can:

1. What you expected, what happened instead, and the game output around it.
2. Your nexSys version, shown at the right of the configuration window's
   title bar (`ns config`).
3. Any red error messages in the console.
4. A full state snapshot. This console command copies it to your clipboard:

   ```js
   copy(JSON.stringify(nexSys.state, null, 2));
   ```

:::caution Review before sharing

The state snapshot includes character, target, room, and inventory details.
Check it before you post it publicly.

:::
