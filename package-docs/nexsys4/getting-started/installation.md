---
title: Installation
description: Install nexSys4 in the Nexus web client and start it for the first time.
---

# Installation

Installing nexSys takes a few minutes and needs no code: check your command
separator, import one file into Nexus, start nexSys, and switch on automatic
loading.

## Before you begin

- You need an Achaea character and the Nexus web client.
- **Coming from nexSys3?** Work through the site-wide
  [Upgrading from Version 3](/docs/upgrading-to-v4/) checklist first.
  nexSys3 and nexSys4 cannot run together.
- nexSys works inside its own curing set, `nexsys4-default`, and creates it
  the first time it starts. Type `CURINGSET LIST` in game to see your sets.
  If every slot is already in use, delete a set you no longer need, or buy
  another slot with `CURINGSET EXPAND`.

## 1. Set your command separator

nexSys sends several commands at a time, joined with your in-game command
separator. It needs a separator that Nexus leaves alone.

1. In game, type `CONFIG` and find **CommandSeparator** in the list.
2. In Nexus, click the **gear icon**, open **Advanced**, and look at
   **Command Stack Delimiter**.
3. If the game shows no separator, or it's the same symbol as the Nexus
   delimiter, set a different one in game. For example, if Nexus uses `|`:

   ```text
   CONFIG COMMANDSEPARATOR ;;
   ```

:::warning Most common cause of startup problems

If your in-game separator and the Nexus Command Stack Delimiter are the same,
Nexus splits nexSys's commands apart before they reach Achaea. Startup then
fails, and queued commands run straight away instead of waiting. If you have
no in-game separator at all, Achaea can't split nexSys's commands either.

:::

## 2. Download the package

Download `nexSys4.nxs` from the
[version 4 download folder](https://www.dropbox.com/scl/fo/0zlqj0paorj6251q7eg64/AMnyOIzTb1WG7tBwVMSAORw/version%204?rlkey=zkf00szptvruwziqbji72q654&dl=0).
The same folder is linked from the [Packages](/docs/packages/) page.

It doesn't matter if the file is a little older than the newest release.
nexSys updates itself every time it loads.

## 3. Import it into Nexus

1. Click the **gear icon** in the status bar at the bottom of the Nexus
   client to open Settings.
2. Open the **Reflex Packages** tab.
3. Drag `nexSys4.nxs` onto the **Import Reflex Package** area and confirm.

nexSys4 appears in your package list. If you don't already have
**eventStream3**, the shared event package that the nex packages run on,
nexSys installs it for you.

When the import finishes, this message appears in the game window:

```text
[-nexSys-] nexSys4 successfully installed. Enter "ns load" to begin startup.
```

## 4. Start nexSys

nexSys sometimes starts on its own right after the install. If nothing
happens within a few seconds, type:

```text
ns load
```

The first start takes a few seconds. During it, nexSys:

- creates its curing set, `nexsys4-default`, and switches to it,
- reads your curing status, priorities, and defences from the game,
- and brings the server's curing settings in line with its configuration.

This startup output is hidden from your screen. When nexSys is ready, you
see `[-nexSys-] loaded using startup spam gag.`, your prompt changes to the
nexSys prompt, and you may hear a short spoken welcome.

:::tip

If startup doesn't finish, check your command separators first (step 1).
nexSys reports most other problems in a red `startup failed` message. See
[nexSys does not start](../troubleshooting.md#nexsys-does-not-start).

:::

## 5. Turn on Load on login

By default nexSys does **not** start by itself when you log in. To have it
start automatically every time:

1. Type `ns config` to open the configuration window.
2. On the **System** tab, switch on **Load on login**.
3. Select **Save**.

If you leave it off, type `ns load` after each login.

You're ready to play. Continue with the [Quickstart](./quickstart.md) to
review your curing setup before your first fight.

## What gets installed

| Item | What it is |
| --- | --- |
| `nexSys4` package | nexSys's aliases and triggers. The package downloads the nexSys program itself each time it loads. |
| `nexSys4.userSettings` group | An empty group inside the package for your own aliases, triggers, and scripts. Updates never touch it. |
| `eventStream3` package | Shared event and trigger services used by the nex packages. Installed only if you don't have it. |
| `nexsys4-default` curing set | nexSys's own curing set in Achaea. Your other curing sets are left alone. |
| `nexSys4Settings` variable | Your saved nexSys configuration, kept as a Nexus variable. |

The package's aliases are listed on the [Commands](../guides/commands.md)
page.

## Updates

nexSys keeps itself up to date. Each time it loads, it downloads the newest
nexSys4 package and applies it over your copy. Your saved configuration and
everything in the `nexSys4.userSettings` group are kept. The rest of the
package is replaced with the new version.

- Keep your own aliases, triggers, and scripts in `nexSys4.userSettings`.
  Changes made anywhere else in the package are lost at the next update. See
  [Customizing nexSys](../guides/customizing.md).
- You never need to import the `.nxs` file again to update. Importing it
  again also clears your saved nexSys configuration.

## Coming from nexSys3

The first time nexSys4 starts, if you have nexSys3 settings and no nexSys4
settings yet, nexSys imports them once and tells you:

```text
[-nexSys-] Imported curing, defence, and cache settings from your original nexSys installation.
```

| Imported | Not imported |
| --- | --- |
| Curing type, sip priority, thresholds, and the other curing switches | Affliction priorities. nexSys4 starts from its own recommended priorities; review them on the [Aff Priorities](../guides/configuration/affliction-priorities.md) tab. |
| Notices, Load on login, Custom Prompt, and the other system switches | Your nexSys3 aliases and scripts. See [Commands](../guides/commands.md) for the v4 aliases. |
| Defence priorities. nexSys3's keepup and static lists are combined into one list. | Your command separator. nexSys4 reads it from the game. |
| Precache amounts | |

## Uninstalling

1. Return to one of your own curing sets and delete nexSys's set. In game,
   type:

   ```text
   CURINGSET SWITCH <your set>
   CURINGSET DELETE nexsys4-default
   ```

2. Delete the nexSys4 package from the **Reflex Packages** tab.

Scripters can do step 1 with `nexSys.api.ss.unload()` while nexSys is
running.

## For scripters: starting nexSys from code

Players never need this section. Package authors and scripters who load
nexSys from their own code can import the published bundle directly:

```js
import("https://unpkg.com/nexsys4/dist/nexsys4.min.js").then(() => {
  // Enable the package's aliases and triggers (ns load does this for you).
  nexusclient
    .packages()
    .get("nexSys4")
    .items.filter((item) => item.type === "group")
    .forEach((group) => {
      group.enabled = true;
    });

  nexSys.bootstrapNexus({ startupGag: true });
});
```

Importing the bundle only publishes `nexSys.bootstrapNexus`. Nothing starts
until you call it. `bootstrapNexus()` installs the Nexus client hooks used by
the prompt and Tab handling, mounts the configuration window, starts the
runtime, begins the self-update, and replaces `globalThis.nexSys` with the
live runtime.

| Option | Default | Effect |
| --- | --- | --- |
| `startupGag` | `true` | Hide the commands and output of the startup snapshot. |
| `debug` | saved setting | Force diagnostic logging on or off for this load. |
| `publishRawGmcp` | `false` | Also publish every GMCP packet as `nexsys4.raw.gmcp`. |

Listen for `nexsys4.system.loaded` to know when startup has finished. See
[Events](../reference/events.md).
