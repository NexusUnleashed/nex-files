---
title: Rules
description: Use the Rules menu to inspect, enable, and save situational rules, or write your own.
---

# Rules

Rules let nexSys change its curing as a fight develops. They can raise a
priority when a lock is close, change a setting in a particular situation, or
use a class cure. A rule describes what should be true right now. When the
situation passes, nexSys puts everything back by itself.

You don't need to write rules to use nexSys. Shipped rules are enabled by
default, and the **Rules** tab lets you choose which ones to use. Start with
the menu below; [Writing your own rule](#writing-your-own-rule) is for scripters.

## Using the Rules menu

Type `ns config` in the game command line, then select **Rules**. The list
groups rules into packs. Expand a pack with its arrow, select a name to read
its details, and use the switches to change which rules are enabled.

:::info Screenshot placeholder: Rules overview

Add a wide-window screenshot showing the Rules tab, General pack expanded,
pack and rule switches, search, and the Save and Cancel buttons.
Suggested asset: `assets/nexSys-config-rules-overview.png`.

:::

### Finding a rule

**Search rules** matches rule labels, rule ids, pack labels, pack ids, and
rule tags. Matching a pack shows all its rules. Clearing the search restores
the full list. Searching and selecting a rule do not change your configuration.

On a wide window, details appear beside the list. In a narrow or short
window, they appear beneath the selected row. The **Save** and **Cancel**
buttons remain available in either layout.

:::info Screenshot placeholder: Compact Rules layout

Add a narrow-window screenshot with a selected rule and its details beneath
the row, including the visible Save and Cancel buttons.
Suggested asset: `assets/nexSys-config-rules-compact.png`.

:::

### Rule switches and pack switches

| Control or label | Meaning |
| --- | --- |
| Rule switch | Whether that rule is allowed to run when its pack is enabled. Its condition still has to match. |
| Pack switch | Whether rules in that pack are allowed to run. Switching a pack off preserves each rule's own switch. |
| Count beside a pack | Rules whose own switches are on, out of all rules in the pack, including search results that are hidden. |
| **Eligible rules** in pack details | Rules with both their own switch and the pack switch on. This does not mean their conditions currently match. |
| **Current** in details | The configuration currently applied in nexSys. Switches show your pending choices until you save. |
| **Runtime controlled** | nexSys owns this entry, so its switch is read-only. The slow-mode rule follows slow mode, set by you or by aeon. |

For example, switch one rule off and then switch its whole pack off. When
you switch the pack on again, that individual rule stays off. A rule's
switch can also remain on while its name is dimmed because the pack is off.

### Saving, cancelling, and resetting

- **Save** applies the rule and pack choices together and saves them with
  the rest of your configuration. Changes take effect through nexSys's
  normal output cycle. If saving fails, the window stays open with a message.
- **Cancel**, or closing the window, discards your pending changes.
- **Reset loaded defaults** stages the default switches for every loaded,
  configurable rule and pack, including entries hidden by search. Select
  **Save** to keep the reset or **Cancel** to discard it. Runtime-controlled
  entries and preferences for packages that are not loaded are untouched.

Your pending rule choices survive switching to another configuration tab.
The menu lets you inspect and enable rules; editing their conditions or
effects requires changing the rule's defining script.

### What is remembered

Saved rule and pack switches are kept under `ruleSettings` in the Nexus
variable `nexSys4Settings`, alongside your other nexSys configuration.
Nexus handles their server storage through its normal character-settings
save mechanism. The nexSys **Save** button writes the variable; it does not
separately force or wait for a Nexus server save.

Only choices that differ from a rule or pack's default are stored. They
restore when nexSys starts, including for packages that load later. Choices
for an absent package are retained until it returns with the same ids.

Search text, expanded packs, and the selected row are not saved. Rule
definitions and descriptions come from the installed packages each session;
saving a switch does not save or install the script behind it. The rule and
pack choices are separate from Achaea's server-side curing settings.

## Rules that ship with nexSys

### General rules

| Rule | What it does |
| --- | --- |
| `aeon-threshold-and-priority` | While you have aeon: lowers sip and moss thresholds, turns off batching, raises the clotting threshold, and moves asthma, weariness, anorexia, impatience, and paralysis to the front of the curing order. |
| `nonfunctional-legs-paralysis` | When both of your legs are broken, damaged, or mangled, moves paralysis back to priority 25. |
| `paralysis-long-balance` | While you're off balance or equilibrium for a long time, as reported by the game, moves paralysis back to priority 24. You couldn't act anyway. It returns paralysis to normal just before you recover. |
| `paralysis-shield` | While you have the shield defence, moves paralysis back to priority 24. |
| `kelp-paralysis-slickness` | With paralysis, asthma, and slickness, and asthma as your only kelp affliction, cures asthma first. |
| `darkshade-lightwall` | Once you've had darkshade for 10 seconds with a lightwall in the room, moves darkshade to priority 2. |

### Class cures

Rules named `automatic-cure.<ability>` use class abilities that server-side
curing can't: Fitness, Bloodboil, Educe salt, Shrugging, Fling fool,
Alleviate, Dragonheal, Dragonflex, and Dwinnu. Each one only acts when your
class has the ability. [Curing and priorities](./curing.md#class-cures) lists
when each one is used.

### Opponent class packs

Some advice only makes sense against particular classes. Those rules live in
packs named after the opponent's class:

| Pack | Rule | What it does |
| --- | --- | --- |
| `infernal`, `psion`, `shaman`, `waterlord` | `haemophilia-bleeding` | With haemophilia and 200 or more bleeding, cures haemophilia sooner (priority 3), so you can clot before they can use your bleeding. |
| `infernal`, `paladin`, `runewarden`, `unnamable` | `nausea-parry-nothing` | While you have nausea, stops parrying (`parry nothing`), then parries your usual limb again once nausea is cured. Their attacks pass through parry against a nauseated target, and the message they see when it happens confirms your nausea. |
| `waterlord` | `latch-ginseng-over-weariness` | With weariness and two or more of addiction, haemophilia, nausea, and lethargy, eats ginseng before kelp. Latch counts those afflictions (plus heavy bleeding), and at four you can be desiccated. Weariness lets the Water Lord add two at once. |

Each rule's id starts with its pack, such as
`shaman.haemophilia-bleeding`. Class packs are off by default, because
nexSys can't yet tell which class you're fighting. To use one, turn on its
pack switch in the **Rules** tab, then select **Save** to keep your choice.
A pack that's on applies whoever you're fighting: with the warrior packs
on, for example, you stop parrying whenever you have nausea.

### Turning a rule off

In **Rules**, find the rule, turn its switch off, and select **Save**. You
can turn it back on later or use **Reset loaded defaults**. Scripters can
also [change and save choices through the API](#managing-rules).

## Reading rules in configuration

The **Rules** tab lists packs and their rules. Select a rule to read its
**When**, **Effect**, and optional **Recheck** and **Why** sections.
Shipped rules show their conditions and effects as pseudocode:

:::info Screenshot placeholder: Rule details

Add a screenshot of a selected shipped rule showing its label, id, Current
state, and the When and Effect blocks. Prefer a rule with nested ALL/ANY
conditions; include Recheck or Why when present.
Suggested asset: `assets/nexSys-config-rules-detail.png`.

:::

```text
When
  ALL:
    ANY(brokenleftleg, damagedleftleg, mangledleftleg)
    ANY(brokenrightleg, damagedrightleg, mangledrightleg)

Effect
  SET priority(paralysis) = 25
```

This is the rule for paralysis with both legs disabled. `ALL` requires every
condition; `ANY` requires at least one. An affliction name means you have it,
and `NOT` reverses a condition. Indentation shows which conditions belong together.

`supported` means the client has a configured cure for your class. A cure
request still passes through blocker, cooldown, and action-selection checks.
`SET` contributes a temporary priority or setting override. Later rules can
override the same value. When a condition clears, that rule releases its
override. `defence_priority` is a defence's keep-up priority, and `0` means
nexSys stops raising it. **Why** explains the strategy in ordinary language; **Recheck**
explains when a timed condition will be evaluated again.

The **Position** line shows the rule's place in the full evaluation order.
Later rules win when they change the same key. A **Terminal** badge means a
matching rule stops further rules from being checked in that pass.

**Shipped** entries come with nexSys. **External** entries come from your
scripts or other packages and may use ordinary prose, partial descriptions,
or no description. For an external rule, **Show Function source** displays
its evaluator when available; referenced helpers and captured values are
not included. This is a read-only view.

## Writing your own rule

A rule is an object with an `id` and an `evaluate` function. nexSys calls
`evaluate` at every prompt with a set of helpers called `ctx`. Return `null`
when the rule doesn't apply. When it does, return the changes you want:

```js
nexSys.api.rules.add({
  id: "my.asthma-before-slickness",
  label: "Asthma before slickness",
  logic: {
    format: "pseudocode",
    when: "ALL:\n  asthma\n  slickness",
    effect: "SET priority(asthma) = 2",
  },
  evaluate(ctx) {
    if (!ctx.haveAffs(["asthma", "slickness"])) return null;
    return { affPriorities: { asthma: 2 } };
  },
});
```

While both afflictions are present, asthma moves to priority 2. When either
is cured, the rule returns `null` and asthma goes back to its normal
priority. You never undo a rule's changes yourself.

Rule definitions only last for the current session. Add yours in a
`SystemLoaded` function in `nexSys4.userSettings`, so they're registered every
time nexSys loads. Saved enable/disable choices apply when they register.
Give every rule a unique id. A short prefix of your own, such as `my.`, keeps
it clear of nexSys's ids.

`logic` is optional display text and never runs as code. Use
`format: "pseudocode"` for structured **When** and **Effect** blocks, or
omit the format for ordinary prose. Optional `why` and `recheck` fields use
prose. Keep explanations accurate when changing `evaluate`, and share
tuning values rather than maintaining separate copies. The full notation is
documented in the repository's `docs/reference/nexsys4-rules-reference.md`.

### What a rule can change

| Key | Example | Effect |
| --- | --- | --- |
| `affPriorities` | `{ asthma: 2 }` | Affliction priorities. `0` or `26` ignores an affliction. |
| `defPriorities` | `{ rebounding: 0 }` | Defence priorities, for every kind of defence. |
| `settings` | `{ batch: false, sipHealthAt: 60 }` | Server-side curing settings, using the names from the [State reference](../reference/state.md#statesystem). |
| `cureActions` | `{ fitness: true }` | Turn on a class cure. |

In `affPriorities`, `defPriorities`, and `cureActions`, a value of `"RESET"`
hands that key back to its normal value, even if an earlier rule changed it.
`settings` doesn't support `"RESET"`.

`settings` also accepts the booleans `focusWithGuilt` and
`focusWithFulminated`: `true` allows focus with that affliction, and `false`
prevents it. When your rule stops applying, nexSys restores the session's
normal preference.

To switch curing off entirely while a rule applies, return
`ctx.suspendCuring()`. You can pass other changes to it, as in
`ctx.suspendCuring({ settings: { batch: false } })`. Curing comes back when no
rule is suspending it and nexSys isn't otherwise paused.

:::tip Use priorities 1 to 3

nexSys's recommended priorities start at 4, which leaves 1 to 3 free for
rules. Raising an affliction into that range puts it ahead of everything
else without disturbing the rest of your order. Remember that a priority
ranks cures, not afflictions. See
[Affliction priorities](./configuration/affliction-priorities.md#how-priorities-work).

:::

Rules can also return `predictions`, `prioAff`, and `manualQueue`, but avoid
them. The game uses those up without telling nexSys, so nexSys can't tell
when they're done. Raising a priority does the same job reliably.

### What a rule can check

| Helper | Answers |
| --- | --- |
| `ctx.haveAff(name)`, `ctx.haveAffs([...])`, `ctx.haveAnAff([...])` | Do you have this affliction, all of them, or any of them? |
| `ctx.affCount(name)` | How many stacks of an affliction you have |
| `ctx.affElapsed(name)` | Milliseconds since you gained (or lost) an affliction |
| `ctx.cureAffCount(cure)` | How many of your afflictions a cure treats, such as `ctx.cureAffCount("kelp")` |
| `ctx.canUseCure(name)` | Whether your class can use a class cure |
| `ctx.getCuringSetting(name)` | Your configured curing preference, including `"focusWithGuilt"` and `"focusWithFulminated"`, before any rule overrides |
| `ctx.sortedActiveAffs()` | Your afflictions, most urgent first |
| `ctx.haveDef(name)`, `ctx.haveDefs([...])`, `ctx.haveADef([...])` | Do you have this defence, all of them, or any of them? |
| `ctx.haveBal(name)`, `ctx.haveBals([...])`, `ctx.haveABal([...])` | Is this balance available? |
| `ctx.balElapsed(name)`, `ctx.balRemaining(name)` | Milliseconds since a balance was used, and until it returns |
| `ctx.isBalReported(name)` | Whether the game reported how long the current balance loss lasts |
| `ctx.bleeding()` | Your current bleeding |
| `ctx.limbDamage(limb)`, `ctx.limbStage(limb)`, `ctx.isLimbBroken(limb)` | Limb damage percentage, `"healthy"`, `"damaged"`, or `"mangled"`, and whether an arm or leg is broken |
| `ctx.isClass(name)` | Whether you're in this class, or in any class of an array, such as `ctx.isClass(["Dragon", "Magi"])` |
| `ctx.isTarget(name)` | Whether this is your current target |
| `ctx.roomHasItem(name)` | Whether an item with exactly this name is in the room |
| `ctx.haveTrackable(name)`, `ctx.trackableElapsed(name)`, `ctx.trackableRemaining(name)` | Tracked effects, such as `snapTrack` after you're snapped |

Rules only see these helpers, never nexSys's internal state, and they should
only answer questions. Don't send commands or change anything from inside
`evaluate`.

`getCuringSetting(name)` reads the preference saved in nexSys, using the
default when none was saved. Temporary overrides and game confirmations do
not change what it returns. Unsupported or unset settings return `undefined`.

### Time-based conditions

Rules run when something happens, usually at a prompt. A condition that
depends on how long something has lasted can become true while nothing
happens in the game. Tell nexSys when to check again with
`ctx.recheckIn(ms)`:

```js
nexSys.api.rules.add({
  id: "my.late-darkshade",
  evaluate(ctx) {
    if (!ctx.haveAff("darkshade")) return null;
    const untilThreshold = 8000 - ctx.affElapsed("darkshade");
    if (untilThreshold > 0) {
      ctx.recheckIn(untilThreshold);
      return null;
    }
    return { affPriorities: { darkshade: 2 } };
  },
});
```

- Ask every time `evaluate` runs. A request only lasts until the next run.
- Work out the delay from the current values, not from something you saved.
- Make the boundary inclusive: `>=` for time elapsed, `<=` for time
  remaining. A recheck can land exactly on the boundary, and a strict
  comparison would still say "not yet".

## Order and precedence

Rules run from top to bottom, and when two rules change the same key, the
later one wins. nexSys's general rules run first, then the opponent class
packs, then the rules you add. So your rules win.

| Option | Effect |
| --- | --- |
| `terminal: true` | Stop checking further rules while this one applies. |
| `enabled: false` | Add the rule switched off. |
| `pack: "my-pack"` | Group rules under one pack switch, also controlled by `api.rules.packs.enable()` and `api.rules.packs.disable()`. |

To put a rule at a particular position, pass an index:
`nexSys.api.rules.add(rule, { index: 0 })`. To load a whole set of rules as
a pack, use
`nexSys.api.rules.packs.load({ id: "my-pack", label: "My rules", rules: [ruleA, ruleB] })`.

## Managing rules

| Call | Does |
| --- | --- |
| `nexSys.api.rules.add(rule, options?)` | Add a rule. Returns `false` if the id is taken. |
| `nexSys.api.rules.remove(id)` | Remove a rule. |
| `nexSys.api.rules.enable(id)` / `disable(id)` | Switch a rule on or off. |
| `nexSys.api.rules.reset(id)` | Restore a rule's default switch. |
| `nexSys.api.rules.packs.enable(packId)` / `packs.disable(packId)` | Change the pack switch, preserving each rule's own switch. |
| `nexSys.api.rules.packs.reset(packId)` | Restore the pack's default switch, preserving each rule's own switch. |
| `nexSys.api.rules.packs.load(pack)` / `packs.unload(packId)` | Add or remove a pack of rule definitions. |
| `nexSys.api.rules.updateEnabled({ rules, packs })` | Apply several switch changes together. Values are `true`, `false`, or `null` to restore defaults. |
| `nexSys.api.rules.reorder(ids)` | Set the full order of rules for this session. Order is not persisted. |
| `nexSys.api.rules.list()` | Every rule, with its position, pack, and whether it's active right now. |
| `nexSys.api.rules.packs.list()` | Every loaded pack and its own switch and default. |

API switch changes apply immediately in memory. To persist them, call
`nexSys.api.control.applySettings()` after making your changes:

```js
nexSys.api.rules.disable("darkshade-lightwall");
nexSys.api.rules.packs.disable("shaman");
nexSys.api.control.applySettings();
```

Reset calls also need a subsequent save to remove the stored choice.
Internal runtime entries cannot be changed through this API. See the
[API reference](../reference/api.md#apirules) for read helpers and return values.

`nexSys.state.rules` shows the combined changes from all active rules, and
which rule won each one.

## Reacting when a rule switches on or off

Run code when a rule starts or stops applying, keeping your `evaluate`
function free of side effects:

```js
const stop = nexSys.api.rules.bindTransition("my.asthma-before-slickness", {
  onActivate(payload) {
    nexusclient.display_notice("Asthma first!", "yellow");
  },
  onDeactivate(payload) {},
});

// Later, to stop listening:
stop();
```

The same moments are published as the `nexsys4.rule.activated.<id>` and
`nexsys4.rule.deactivated.<id>` [events](../reference/events.md).
