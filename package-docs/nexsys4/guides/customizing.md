---
title: Customizing nexSys
description: Add your own aliases, triggers, and scripts to nexSys without losing them when it updates.
---

# Customizing nexSys

nexSys is built to be extended. Your own aliases can call it, rules can
change how it cures, and your scripts can react to what it sees. This page
shows where to put your changes so they last, with a few examples to start
from. The examples are short JavaScript snippets you can paste into Nexus.

## Keep your changes in nexSys4.userSettings

nexSys updates itself every time it loads. The update replaces every group
in the nexSys4 package **except** `nexSys4.userSettings`. That group is
yours.

- Put your own aliases, triggers, keybinds, and functions in
  `nexSys4.userSettings`.
- Don't edit nexSys's other groups, such as `system`, `defs`, `queueing`, or
  `prompt`. Anything you change there is lost at the next update.
- A separate Nexus package of your own works just as well. nexSys never
  changes other packages.

To find the group, open Settings with the gear icon, go to the **Reflexes**
tab, and open the nexSys4 package's `nexSys4.userSettings` group.

The nexSys4 package, your group included, switches on when nexSys finishes
loading. Until then, aliases in `nexSys4.userSettings` don't respond.

## Run your setup when nexSys is ready

When nexSys finishes starting up, it runs every Nexus function named
`SystemLoaded`, in every package. Create a function with that name in
`nexSys4.userSettings` for anything that needs nexSys to be running, such as
adding rules or listening for events:

```js
// Function "SystemLoaded" in nexSys4.userSettings.
// Runs each time nexSys finishes loading.
nexSys.api.rules.add({
  id: "my.asthma-before-slickness",
  evaluate: (ctx) =>
    ctx.haveAffs(["asthma", "slickness"])
      ? { affPriorities: { asthma: 2 } }
      : null,
});
```

Rules and event listeners only last for the current session, so
`SystemLoaded` is where they belong. Your configuration, by contrast, is
saved for you.

## Examples

### An alias that toggles a defence

An alias `sf` with this script keeps selfishness up, or stops keeping it
up. The shipped `ma`, `br`, `ss`, and `cl` aliases work the same way.

```js
const current = nexSys.state.defs.selfishness.defaultPriority;
nexSys.api.defs.setDefaultPriority("selfishness", current ? 0 : 25);
```

### An alias that changes a setting

`applySettings()` changes and saves settings, just like the **Save** button:

```js
nexSys.api.control.applySettings({ ss: { sipHealthAt: 60 } });
```

The setting names are listed in the [State reference](../reference/state.md#statesystem).

### React to an affliction

Add this to your `SystemLoaded` function to show a warning whenever you're
paralysed:

```js
eventStream.removeListener("nexsys4.aff.got.paralysis", "my-paralysis-alert");
eventStream.registerEvent(
  "nexsys4.aff.got.paralysis",
  () => nexusclient.display_notice("PARALYSED!", "red"),
  { id: "my-paralysis-alert" },
);
```

Removing the listener first means it isn't registered twice if
`SystemLoaded` runs again.

### Check your state in a script

```js
if (nexSys.api.affs.have("prone")) {
  nexSys.api.queue.free.prepend("stand");
}
```

## Going further

- [Custom prompt](./custom-prompt.md): change the prompt's layout and colors.
- [Rules](./rules.md): write rules that adjust curing for specific
  situations.
- [Events](../reference/events.md): everything nexSys announces.
- [API reference](../reference/api.md) and
  [State reference](../reference/state.md): every function and every piece
  of state.

### Trying things in the browser console

To try a snippet before saving it in a reflex, open your browser's
developer tools (usually **F12**) and use the **Console** tab. For example,
`nexSys.state.affs` lists your afflictions. You never need the console for
everyday play.

## Things to avoid

- **Editing nexSys's own groups.** They're replaced at every update.
- **Importing the `.nxs` again to update.** nexSys updates itself, and
  re-importing also clears your saved configuration.
- **Sending `CURING` commands from scripts.** nexSys treats them as manual
  changes. Use `nexSys.api.affs.setPriority()` or a rule instead, so nexSys
  knows what you intend.
- **Slow code in rules and listeners.** Rules run at every prompt, and some
  events fire many times a second. Keep that code short.
