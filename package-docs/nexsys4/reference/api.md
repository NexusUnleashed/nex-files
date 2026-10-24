---
title: API reference
description: Every function under nexSys.api, grouped by area.
---

# API reference

Functions live under `nexSys.api`, grouped by area. Questions and actions
for an area sit together: `nexSys.api.affs.have()` and
`nexSys.api.affs.setPriority()` are neighbours. Data lives separately under
[`nexSys.state`](./state.md).

```js
nexSys.api.affs.have("asthma"); // ask a question
nexSys.api.defs.defup(); // do something
nexSys.api.queue.free.add("touch tree"); // use a queue
```

| Namespace | Area |
| --- | --- |
| [`api.affs`](#apiaffs) | Afflictions: checks, timing, priorities |
| [`api.defs`](#apidefs) | Defences: checks, priorities, defup |
| [`api.balances`](#apibalances) | Balances and cooldowns |
| [`api.trackables`](#apitrackables) | Tracked effects such as snap |
| [`api.limbs`](#apilimbs) | Limb damage |
| [`api.room`](#apiroom) | Room walls, frozen ground, and items |
| [`api.target`](#apitarget) | Your target |
| [`api.class`](#apiclass) | Your class |
| [`api.command`](#apicommand) | Sending commands |
| [`api.queue`](#apiqueue) | Command queues |
| [`api.control`](#apicontrol) | Pausing, settings, and diagnostics |
| [`api.ss`](#apiss) | Server-side curing extras and the curing set |
| [`api.rules`](#apirules) | Rules |
| [`api.prompt`](#apiprompt) | The custom prompt |
| [`api.observe`](#apiobserve) | Telling nexSys about things it can't see |
| [`api.ui`](#apiui) | The configuration window |
| [`api.line`](#apiline) | Changing game lines from triggers |

Questions return `true` or `false`. Timing and lookup functions return
`null` for names nexSys doesn't know. Most actions return `true` when they
changed something. An action that talks to the game returns as soon as the
command is sent, not when the game confirms it. Use state and
[events](./events.md) to see the confirmed result.

## `api.affs`

| Function | Returns |
| --- | --- |
| `have(name)` | Whether you have the affliction |
| `haveAll(names)` / `haveAny(names)` | Whether you have every one, or any one. Takes an array or a single name. |
| `elapsedMs(name)` / `elapsedSeconds(name)` | Time since the affliction was gained or lost |
| `remainingMs(name)` / `remainingSeconds(name)` | Time until a timed affliction wears off, or `0` |
| `timing(name)` | `{ have, sinceMs, lastChangeAtMs, elapsedMs, timedDurationMs, remainingMs, ... }` |
| `setPriority(name, priority)` | Set the priority for this session. |
| `setDefaultPriority(name, priority)` | Change your default priority. |
| `resetPriority(name)` | Return a session priority to your default. |
| `resetAllPriorities()` | Return every affliction to its default. |

Priorities run from `1` (most urgent) to `25`. `0` or `26` ignores the
affliction. Changes apply to server-side curing at the next prompt.

`setDefaultPriority()` changes the default straight away, but it's stored
the next time your configuration is saved, for example with **Save** in the
configuration window or with `nexSys.api.control.applySettings()`. Until
then, it lasts for the session.

## `api.defs`

| Function | Returns |
| --- | --- |
| `have(name)` / `haveAll(names)` / `haveAny(names)` | Whether the defence (or defences) are up |
| `setPriority(name, priority)` | Set the priority for this session. `0` stops nexSys raising it. |
| `setDefaultPriority(name, priority)` | Change your default priority. Stored when your configuration is next saved, as for afflictions. |
| `setStatic(name, isDefup)` | Mark a defence **Defup** (`true`) or keep-up (`false`). |
| `setCommand(name, command)` | Change the command used to raise a defence for this session, such as `"block n"`. |
| `resetPriority(name)` / `resetAllPriorities()` | Return session priorities to your defaults. |
| `defup()` | Raise your defences, as the `defup` alias does. |
| `defoff()` | Lower your defences, as the `defoff` alias does. |
| `parry(limb)` | Parry (or guard) a limb and keep parrying it. Takes a code such as `"rl"` or a name such as `"right leg"`. `"nothing"` stops parrying and keeps your parry down. |

## `api.balances`

Balance names include `balance`, `equilibrium`, `herb`, `salve`, `smoke`,
`focus`, `tree`, `sip`, `moss`, and class cooldowns. See
[`state.balances`](./state.md#statebalances).

| Function | Returns |
| --- | --- |
| `have(name)` / `haveAll(names)` / `haveAny(names)` | Whether the balance (or balances) are available |
| `elapsedMs(name)` / `elapsedSeconds(name)` | Time since the balance was used or recovered |
| `remainingMs(name)` / `remainingSeconds(name)` | Time until a used balance is expected back, or `0` |
| `timing(name)` | Full timing, including whether the game reported the length (`activeDurationReported`) |

## `api.trackables`

| Function | Returns |
| --- | --- |
| `get(name)` | The record, or `null` |
| `list()` | Every trackable name, such as `["snapTrack"]` |
| `have(name)` | Whether it's active |
| `elapsedMs(name)` | Time since it started, or `Infinity` when inactive |
| `remainingMs(name)` | Time until it ends, or `0` when inactive |
| `timing(name)` | Full timing |

To start or end one, use [`api.observe.trackables`](#apiobserve).

## `api.limbs`

| Function | Returns |
| --- | --- |
| `get(limb)` | A limb record by id (`"leftleg"`) or name (`"left leg"`), or `null` |
| `list()` | `["head", "torso", "leftarm", "rightarm", "leftleg", "rightleg"]` |

## `api.room`

| Function | Returns |
| --- | --- |
| `get()` | The current room. The same as [`state.room`](./state.md#stateroom). |
| `isGroundFrozen()` | Whether the ground is known to be frozen |
| `walls.get(direction)` | The walls at an exit, such as `[{ type: "icewall" }]`. Takes `"n"` or `"north"`. |
| `walls.list()` | Every wall, as `{ direction, type }` |
| `walls.have(direction, type?)` | Whether there's a wall at an exit, optionally of a given type |
| `items.have(name)` | Whether an item with exactly this name is in the room |
| `items.isKnown()` | Whether nexSys has a complete, current list of the room's items |

`items.have()` returns `false` when the room's items aren't known yet, so
check `items.isKnown()` when that matters.

## `api.target`

| Function | Returns |
| --- | --- |
| `get()` | Your target: `{ id, text, isPlayer, hp }` |
| `set(name)` | Sends `SETTARGET <name>`. Returns `{ target, dispatched, dispatchResult }`. `state.target` updates when the game confirms. |
| `is(name)` | Whether this is your current target |

## `api.class`

| Function | Returns |
| --- | --- |
| `get()` | Your class, such as `"Occultist"` |
| `is(classes)` | Whether you're in this class, or in any class of an array, such as `is(["Dragon", "Magi"])` |
| `check(name)` | Whether you're in this one class |

Class names aren't case-sensitive, and any colour of dragon counts as
`"Dragon"`.

## `api.command`

| Function | Does |
| --- | --- |
| `send(command, raw?)` | Send a command now. Pass `true` as the second argument to skip Nexus alias expansion. |
| `sendInline(commands, context?)` | Send several commands together in one batch. |
| `addOutput(commands)` | Add commands to nexSys's next output batch. |
| `evaluateNow()` | Run nexSys's output cycle now instead of waiting for the next prompt. |

```js
nexSys.api.command.send("stand");
nexSys.api.command.send("block n", true); // don't expand as an alias
```

## `api.queue`

Each queue has a handle under its name and its id: `queue.free` and
`queue.freeQueue` are the same. The queues are `class`, `free`, `full`,
`shield`, `ship`, `bloodcloak`, `battlerage`, and `stun`. See
[Queues](../guides/queues.md).

| Handle method | Does |
| --- | --- |
| `add(commands, options?)` | Add commands to the end. Commands already queued are skipped unless `{ allowDuplicate: true }`. |
| `prepend(commands, options?)` | Add commands to the front. |
| `addClear(commands, options?)` | Replace your queued commands, keeping the front ones. |
| `clear()` | Empty nexSys's copy of the queue only. |
| `clearQueue()` | Empty nexSys's copy and the game's queue. |
| `flush(options?)` | Send the queue to the game now. `{ force: true }` sends even if nothing changed. |
| `isQueued(command)` | Whether a command is in the queue |
| `inspect()` | The queue's current contents |

`commands` is a string or an array of strings. Adding sends the queue to the
game straight away unless you pass `{ autoFlush: false }`.

The same methods are available at the top level with the queue as the first
argument, such as `queue.add("free", "touch tree")`. The top level also has
`list()` for the queue ids, `get(queue)` for a handle, and `flushAll()`.

## `api.control`

| Function | Does |
| --- | --- |
| `pause()` / `unpause()` / `pauseToggle()` | Pause or resume nexSys, as `pp` does. |
| `setSlowMode(on)` / `slowOn()` / `slowOff()` | Turn slow mode on or off. Aeon turns it on by itself. |
| `applySettings(changes)` | Change settings, save your configuration, and apply it. |
| `setDebug(on)` / `debugOn()` / `debugOff()` | Turn diagnostic logging on or off. |
| `debug()` | A diagnostic snapshot for bug reports |
| `start()` / `stop()` | Start or stop the runtime. Normal loading does this for you. |
| `updateNxs()` | Download and apply the latest nexSys4 package now. This also happens at every load. |

`applySettings()` merges your changes into the current settings. Setting
names are listed in the [State reference](./state.md#settings):

```js
nexSys.api.control.applySettings({
  queueWhilePaused: true,
  ss: { sipHealthAt: 70, batch: false },
});
```

It saves your whole configuration, including priorities and precache
amounts changed by scripts.

## `api.ss`

| Function | Does |
| --- | --- |
| `predictions.add(aff)` / `predictions.remove(aff)` | Ask for, or cancel, a `CURING PREDICT`. |
| `prioAff.set(aff)` / `prioAff.reset()` | Set or clear `CURING PRIOAFF`. |
| `queue.add(cure)` / `queue.insert(index, cure)` / `queue.remove(cure)` / `queue.clear()` | Manage the manual curing queue (`CURING QUEUE`). |
| `precache.set(amounts)` | Change and save precache amounts, such as `{ kelp: 5, aurum: 3 }`. |
| `syncSnapshots()` | Read curing status and priorities from the game again. |
| `startupStatus()` | Which startup readings have arrived. |
| `unload(options?)` | Leave nexSys's curing set: switch back to your previous set and delete `nexsys4-default`. Pass `{ remove: false }` to keep the set. |

The game uses up a prioaff and queued cures without telling nexSys, so clear
them when you're done. See
[Curing and priorities](../guides/curing.md#predictions-prioaff-and-the-curing-queue).

## `api.rules`

| Function | Does |
| --- | --- |
| `add(rule, options?)` | Add a rule. `{ index }` puts it at a position. Returns `false` if the id is taken. |
| `remove(id)` | Remove a rule. |
| `enable(id)` / `disable(id)` | Switch a rule on or off. |
| `reset(id)` | Restore the rule's default enabled flag. |
| `isEnabled(id)` | Read the rule's own enabled flag, independently of its pack. Unknown ids return `false`. |
| `updateEnabled({ rules, packs })` | Apply a partial batch of enabled choices. Each map is keyed by id, with `true`, `false`, or `null` to restore defaults. Returns `{ ok, changed, errors }`; invalid entries reject the whole batch. |
| `packs.load({ id, label?, description?, enabled?, rules })` | Register a pack and its rules. Rule ids must be unique; the pack id is not automatically prefixed to them. |
| `packs.unload(packId)` | Remove a pack and its rule definitions. Saved enabled choices remain available if it loads again. |
| `packs.enable(packId)` / `packs.disable(packId)` | Change the pack's enabled flag without changing the rules' own flags. |
| `packs.reset(packId)` | Restore the pack's default flag without resetting individual rules. |
| `packs.isEnabled(packId)` | Read the pack's own flag. Unknown ids return `false`. |
| `packs.list()` | Loaded pack descriptors, including `id`, `label`, `description`, `origin`, `defaultEnabled`, `enabled`, and `registrationId`. |
| `reorder(ids)` | Set the complete evaluation order for this session. Order is not persisted. |
| `list()` | Rules in evaluation order, including descriptions, defaults, own/effective enabled flags, and current activity. |
| `getSource(id)` | Read an external rule's evaluator source, or `null` when unavailable. Does not execute it; referenced helpers and captured values are not included. |
| `bindTransition(id, { onActivate, onDeactivate })` | Run code when a rule switches on or off. Returns a function that stops listening. |

`list()` entries include `id`, `pack`, `label`, `logic`, `origin`, `tags`,
`meta`, `terminal`, `defaultEnabled`, `enabled`, `effectiveEnabled`,
`registrationId`, `ruleOrder`, `isActive`, and `suspendsCuring`.
`effectiveEnabled` requires both the rule and pack flags. `isActive` means
the rule matched in the completed evaluation; neither enabled flag proves
that a command was sent.

Public registrations have origin `external`. Entries with origin `internal`
are runtime-controlled and cannot be toggled, reset, removed, or unloaded
through these methods. Single-entry mutations return whether anything
changed; malformed rule or pack definitions throw. Batch errors identify
the `kind`, `id`, and `reason` (`invalid`, `unknown`, or `internal`).

API changes apply in memory immediately. Persist rule and pack enabled
choices with `nexSys.api.control.applySettings()`; resets also need this
save. Only deviations from defaults are stored under
`nexSys4Settings.ruleSettings`. Definitions, source, activity, and rule order
are not persisted. Definitions must be registered each session with stable
ids so saved choices can apply, including to packages loaded after startup.

The [Rules menu](../guides/rules.md#using-the-rules-menu) stages these choices
until **Save**. The [Rules guide](../guides/rules.md#writing-your-own-rule)
describes the rule format and context helpers.

## `api.prompt`

| Member | Does |
| --- | --- |
| `set(layout)` | Replace the prompt layout with your own function. |
| `reset()` | Go back to the standard layout. |
| `updateAffs(changes)` | Change affliction abbreviations and colors. `null` removes an entry. |
| `updateCureColors(changes)` | Change the cure color palette. |
| `updateVars(changes)` | Change prompt values' colors, or add your own values. |
| `vars` / `affs` / `cureColors` | The current values |
| `enabled` | Read or set the Custom Prompt setting. |
| `colorGradation(percent)` | The green-to-red color nexSys uses for a percentage |

See [Custom prompt](../guides/custom-prompt.md).

## `api.observe`

Tells nexSys about things it can't see for itself, such as an affliction
message it doesn't recognize. Calls go through the same path as nexSys's
own triggers, so state, events, and curing all update.

| Function | Does |
| --- | --- |
| `affs.<name>.got()` / `affs.<name>.lost()` | You gained, or were cured of, an affliction. |
| `defs.<name>.got()` / `defs.<name>.lost()` | A defence went up or down. |
| `balances.<name>.got()` / `balances.<name>.lost()` | A balance came back or was used. |
| `balances.<name>.used(seconds)` | A balance was used for a known number of seconds. |
| `limbs.hit(limb, amount)` / `limbs.reset(limb)` / `limbs.setStage(limb, stage)` | Limb damage changed. Each limb also has its own handle, such as `limbs.torso.hit(amount)`. |
| `trackables.got(name, options?)` / `trackables.lost(name)` | Start or end a tracked effect. New names need `{ durationMs }`. |
| `mount.set({ name, id })` / `mount.reset()` | You mounted or dismounted. |
| `room.walls.got(direction, type)` / `room.walls.lost(direction, type)` | A wall appeared or disappeared. |
| `room.frozenGround.got()` / `room.frozenGround.lost()` | The ground froze or thawed. |

For example, in a trigger on an affliction line nexSys misses:

```js
nexSys.api.observe.affs.asthma.got();
```

Each function returns `true` if it changed anything.

## `api.ui`

| Function | Does |
| --- | --- |
| `openConfig()` | Open the configuration window, as `ns config` does. |
| `closeConfig()` | Close it. |
| `setConfigOpen(open)` | Open (`true`) or close (`false`) it. |

## `api.line`

Helpers for Nexus trigger scripts that change the current line of game
output:

| Function | Does |
| --- | --- |
| `replace(text, fg, bg, ...)` | Replace the line with colored text. Repeat the three arguments for more chunks. |
| `replaceHTML(html)` | Replace the line with HTML you trust. |
| `replaceWord(word, replacement, fg?, bg?)` | Replace a word in the line. |
| `replaceWordHTML(word, html)` | Replace a word with HTML you trust. |
| `prevLine(pattern)` / `nextLine(pattern)` | Whether the line before or after matches a string or regular expression |
| `checkLine(pattern, offset)` | Whether the line `offset` lines away matches |
| `prependNotice(text, fg, bg, ...)` | Add a line before the current block. |
| `say(text)` | Speak text aloud with the browser's speech synthesis. |

## `nexSys.events`

`nexSys.events` is nexSys's own event bus. It carries the
[EventStream events](./events.md) plus some JavaScript-only ones, which are
listed in [All event topics](./generated/nexsys4-event-dictionary.md).

| Member | Does |
| --- | --- |
| `on(topic, listener)` | Listen to a topic. Returns a function that stops listening. |
| `off(topic, listener)` | Stop listening. |
| `topics` | Every topic name, keyed in capitals, such as `topics.AFF_GOT` for `"nexsys4.aff.got"`. |

```js
const stop = nexSys.events.on("nexsys4.system.settings.changed", (payload) => {
  // settings changed
});
```

Packages should normally listen through the Nexus `eventStream` instead. See
[Events](./events.md).
