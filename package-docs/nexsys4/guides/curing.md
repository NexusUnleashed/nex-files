---
title: Curing and priorities
description: How nexSys runs Achaea's server-side curing, and how your configuration, rules, and in-game changes fit together.
---

# Curing and priorities

nexSys doesn't cure by sending an `EAT` or `APPLY` for every affliction.
Achaea's server-side curing does the curing. nexSys configures it, keeps it
configured as the fight changes, and adds the cures the server doesn't know
how to use.

## What decides your curing

At any moment, your curing comes from these layers. Higher layers win:

| Layer | Set by | Lasts |
| --- | --- | --- |
| Active rules | [Rules](./rules.md) reacting to the situation | While the rule applies |
| Changes made in game this session | You, typing `CURING` commands | Until nexSys next loads |
| Your saved configuration | The configuration window, `hh`, scripts | Until you change it |
| nexSys's recommended defaults | nexSys | Until you change them |

nexSys combines these into the curing it wants, compares that with what the
game has confirmed, and sends only the differences. Most prompts send
nothing at all. When a rule switches on, nexSys typically sends a single
`CURING PRIORITY` command, and another when it switches off.

A value a rule controls can't be overridden from the game while the rule is
active: nexSys sets it back. Everything else you change in game is respected
until the end of the session.

## Priorities rank cures

Achaea cures a random affliction among those a given cure treats, so a
priority decides which **cure** goes first, not which affliction. Raising
one ginseng affliction means "eat ginseng sooner". It can't choose which
ginseng affliction is cured. See
[Affliction priorities](./configuration/affliction-priorities.md#how-priorities-work).

## Class cures

Server-side curing only uses the standard curatives. nexSys adds class
abilities that cure, and uses them automatically when your class has the
ability, its balance is ready, and nothing prevents it:

| Ability | Classes | Used when you have... |
| --- | --- | --- |
| Fitness | Runewarden, Monk, Shikudo, Blademaster, Infernal, Paladin, Sentinel, Druid, Unnamable | Asthma plus slickness or hellsight, together with paralysis, clumsiness, or sensitivity. Or asthma with a damaged head or leg and any of paralysis, clumsiness, sensitivity, slickness, hellsight, or disloyalty. |
| Bloodboil | Magi | Asthma and slickness, plus hypochondria or paralysis, or plus anorexia while you can't focus. |
| Educe salt | Alchemist | Asthma and slickness, plus hypochondria or paralysis, or plus anorexia while you can't focus. |
| Shrugging | Serpent | Asthma and slickness, plus hypochondria or paralysis, or plus anorexia while you can't focus. |
| Fling fool | Occultist | Asthma and slickness, plus hypochondria or impatience, or plus anorexia while you can't focus. |
| Alleviate | Blademaster | Asthma and slickness, plus hypochondria or impatience, or plus anorexia while you can't focus. |
| Dragonheal | Dragon | Asthma, slickness, and anorexia while you can't focus. |
| Dragonflex | Dragon | Webbed and entangled. Or either one while writhe is unavailable or you're transfixed. |
| Dwinnu | Bard | Webbed and entangled. Or either one while you're transfixed. |

"Can't focus" means your focus balance is used or you have impatience.

Each ability is a rule named `automatic-cure.<ability>`. To stop nexSys
using one, disable its rule, for example
`nexSys.api.rules.disable("automatic-cure.fitness")`. See [Rules](./rules.md).

## Predictions, prioaff, and the curing queue

Achaea's server-side curing also accepts `CURING PREDICT`, `CURING PRIOAFF`,
and `CURING QUEUE`. Scripters reach them through `nexSys.api.ss`:

```js
nexSys.api.ss.predictions.add("paralysis"); // CURING PREDICT paralysis
nexSys.api.ss.prioAff.set("asthma"); // CURING PRIOAFF asthma
nexSys.api.ss.prioAff.reset();
nexSys.api.ss.queue.add("kelp"); // a manual cure, in CURING QUEUE
nexSys.api.ss.queue.clear();
```

:::caution

The game uses up a prioaff or a queued cure, and nexSys can't see when that
happens. While you have one requested, nexSys keeps sending it, which re-arms
it after the game has used it. Clear the request when you're done. For
anything situational, a rule that raises a priority is the better tool.

:::

## Pausing and slow mode

`pp`, dying, typing `CURING OFF`, and switching curing sets all pause nexSys.
Under aeon, nexSys switches to slow mode. See
[How nexSys works](./how-it-works.md#pausing) for exactly what each one does.

## For scripters: inspecting server-side state

`nexSys.state.serverside` shows how nexSys sees server-side curing. It's the
first place to look when curing doesn't do what you expect:

| Branch | Meaning |
| --- | --- |
| `baseline` | Your saved configuration. |
| `sessionBaseline` | Your saved configuration plus the changes you've made in game this session. |
| `desired` | What nexSys wants the server to have right now: `sessionBaseline` plus active rule changes and requests. |
| `observed` | What the game has confirmed, including the active curing set. |
| `transient` | One-off requests: predictions, prioaff, and the manual curing queue. |
| `pending` | Commands sent and awaiting confirmation. |

`nexSys.state.rules` shows which rules are active and which rule won each
value. Scripts can change priorities with `setPriority()`, which lasts for
the session, or `setDefaultPriority()`, which changes your default. Both are
under `nexSys.api.affs` and `nexSys.api.defs`. See the
[API reference](../reference/api.md#apiaffs) for when defaults are saved.
