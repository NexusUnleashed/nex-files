---
title: Rules
description: The situational rules that ship with nexSys4, and how to write your own.
---

# Rules

Rules let nexSys change its curing as a fight develops. They can raise a
priority when a lock is close, change a setting in a particular situation, or
use a class cure. A rule describes what should be true right now. When the
situation passes, nexSys puts everything back by itself.

You don't need to write rules to use nexSys: a set of rules ships with it and
is always on. The first part of this page describes them. The rest is for
players who want to add their own.

## Rules that ship with nexSys

### General rules

| Rule | What it does |
| --- | --- |
| `aeon-threshold-and-priority` | While you have aeon: lowers sip and moss thresholds, turns off batching, raises the clotting threshold, and moves asthma, weariness, anorexia, impatience, and paralysis to the front of the curing order. |
| `nonfunctional-legs-paralysis` | When both of your legs are broken, damaged, or mangled, moves paralysis back to priority 25. |
| `paralysis-long-balance` | While you're off balance or equilibrium for a long time, as reported by the game, moves paralysis back to priority 24. You couldn't act anyway. It returns paralysis to normal just before you recover. |
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
| `vs.infernal`, `vs.psion`, `vs.shaman`, `vs.waterlord` | `haemophilia-bleeding` | With haemophilia and 200 or more bleeding, cures haemophilia sooner (priority 3), so you can clot before they can use your bleeding. |
| `vs.waterlord` | `latch-ginseng-over-weariness` | With weariness and two or more of addiction, haemophilia, nausea, and lethargy, eats ginseng before kelp. Latch counts those afflictions (plus heavy bleeding), and at four you can be desiccated. Weariness lets the Water Lord add two at once. |

Each rule's id starts with its pack, such as
`vs.shaman.haemophilia-bleeding`. Class packs are currently always on,
whoever you're fighting. You can switch a pack off and on yourself:

```js
nexSys.api.rules.disablePack("vs.shaman");
nexSys.api.rules.enablePack("vs.shaman");
```

### Turning a rule off

Disable any rule by its id, for example
`nexSys.api.rules.disable("darkshade-lightwall")`. This lasts until nexSys
next loads, so put it in your `SystemLoaded` function to make it stick. See
[Customizing nexSys](./customizing.md#run-your-setup-when-nexsys-is-ready).

## Writing your own rule

A rule is an object with an `id` and an `evaluate` function. nexSys calls
`evaluate` at every prompt with a set of helpers called `ctx`. Return `null`
when the rule doesn't apply. When it does, return the changes you want:

```js
nexSys.api.rules.add({
  id: "my.asthma-before-slickness",
  evaluate(ctx) {
    if (!ctx.haveAffs(["asthma", "slickness"])) return null;
    return { affPriorities: { asthma: 2 } };
  },
});
```

While both afflictions are present, asthma moves to priority 2. When either
is cured, the rule returns `null` and asthma goes back to its normal
priority. You never undo a rule's changes yourself.

Rules only last for the current session. Add yours in a `SystemLoaded`
function in `nexSys4.userSettings`, so they're added every time nexSys loads.
Give every rule a unique id. A short prefix of your own, such as `my.`, keeps
it clear of nexSys's ids.

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
| `pack: "my-pack"` | Group rules so you can switch them on or off together with `enablePack()` and `disablePack()`. |

To put a rule at a particular position, pass an index:
`nexSys.api.rules.add(rule, { index: 0 })`. To load a whole set of rules as
a pack, use `nexSys.api.rules.load("my-pack", [ruleA, ruleB])`.

## Managing rules

| Call | Does |
| --- | --- |
| `nexSys.api.rules.add(rule, options?)` | Add a rule. Returns `false` if the id is taken. |
| `nexSys.api.rules.remove(id)` | Remove a rule. |
| `nexSys.api.rules.enable(id)` / `disable(id)` | Switch a rule on or off. |
| `nexSys.api.rules.enablePack(packId)` / `disablePack(packId)` | Switch every rule in a pack on or off. |
| `nexSys.api.rules.load(packId, rules)` / `unload(packId)` | Add or remove a pack of rules. |
| `nexSys.api.rules.reorder(ids)` | Set the full order of rules. |
| `nexSys.api.rules.list()` | Every rule, with its position, pack, and whether it's active right now. |

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
