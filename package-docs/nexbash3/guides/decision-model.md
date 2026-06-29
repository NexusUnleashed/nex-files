---
title: The decision model
description: How nexBash4 chooses what to do each prompt — lanes, gates, and first-valid selection.
---

# The decision model

Everything nexBash does in combat comes down to one idea: on each game prompt it
walks a **priority lane** top-to-bottom and uses the **first action that is legal
right now**. This page explains that loop, and where the idea of "rules" fits.

## The pieces

| Piece | What it is |
| --- | --- |
| **Action** | One ability: `{ id, queue, canExecute(ctx), execute(ctx) }`. `canExecute` is a pure yes/no gate; `execute` returns the command(s) to send. |
| **Lane** | A curated, ordered list of actions. The order *is* the priority. nexBash classes have a `primary` lane and (usually) a `battlerage` lane. |
| **Strategy** | A class expressed as data: its lanes plus a small config object. See [Strategies](./strategies.md). |
| **Context (`ctx`)** | A fresh, per-prompt bundle of *answers* — derived tactical facts and player-state predicates — that every gate reads. |
| **Selector** | The "first-valid" walk over a lane that produces the chosen action. |

## The loop

On every prompt, while in combat:

1. nexBash builds a fresh **decision context** for this instant.
2. It walks the active strategy's `primary` lane in order.
3. For each action it asks `canExecute(ctx)`. The first action that answers `true`
   is chosen; the rest are skipped.
4. The chosen action's `execute(ctx)` produces a command, which nexBash queues.

The battlerage lane runs the same way on its own trigger (rage/freerage changes).
See [Battlerage](./battlerage.md).

:::note Execution Machine
The prompt-level combat decision loop runs entirely within the `combat` state of the core state machine. To see how combat fits into the overall room-navigation and player-detection loop, see the [Overview](../introduction.md#the-state-machine) for the complete visual state chart.
:::

Because selection is a fresh walk every prompt, priority is an *order of
preference*, not a fixed script: a high-priority ability that isn't currently
legal (off balance, wrong target state, a resisted damage type) is passed over in
favor of the next valid one, automatically.

## The decision context

`canExecute(ctx)` is the entire "brain" of an action, and it is **pure** — it
reads only the context, never host globals, and has no side effects. The context
is the single place that reads nexSys, nexGui, GMCP, and the target model and
turns them into answers. The most useful fields:

| Field | Meaning |
| --- | --- |
| `ctx.target` | Active target facts: `id`, `name`, `hp` (0–100%), `shielded`, `shouldCC`, `cc`, `resistances`, `damageTypes`, `damage`, `canHeal`. |
| `ctx.hasTarget` / `ctx.targetCount` | Whether a target exists and how many mobs are in the room. |
| `ctx.aoeTargetIds` | Unshielded mob ids — the candidates for multi-target abilities. |
| `ctx.hitsToKill` / `ctx.killableThisHit` | Estimated hits to finish the target (Infinity if unknown). |
| `ctx.party` | Party `members`, `leader`, `size`, `isMember`, `isLeader`. |
| `ctx.haveAff` / `ctx.haveAnyAff` / `ctx.haveDef` / `ctx.haveBal` / `ctx.isClass` | Player-state predicates that delegate live to nexSys4. |
| `ctx.selfHp` / `ctx.selfMana` | Self vitals as 0–1 ratios. |
| `ctx.rage` / `ctx.spark` / `ctx.transcendence` | Class resource pools. |
| `ctx.battlerage` | Battlerage facts: `balance`, `freerage`, `matic`, the buffers, `razeReady`. |
| `ctx.room` | `canFly`, `canBurrow`, `fleeDirection` for movement defences. |
| `ctx.config` | The player [option flags](./configuration/options.md) plus the area `targetThreshold`. |

A damaging action is automatically rejected before its own gate runs if the
active target **resists** the action's damage type — which is how a class
"settles" on the best element after probing (see [Strategies](./strategies.md)).

## The action catalog

Every ability lives in a flat, namespaced **catalog**, keyed like `magi.erode`,
`battlerage.disintegrate`, `general.fly`. Lanes reference these keys, and the
config UI's "Available" bench is drawn from the keys flagged for your class. You
can inspect the catalog from the console:

```js
nexBash.actionCatalog.list({ namespace: "magi" });
nexBash.actionCatalog.get("magi.dissolution");
```

## Where "rules" fit

If you are coming from a curing-style system, you might expect a per-tick **rules
engine** that overlays priority changes when conditions are met. nexBash
deliberately does **not** use one in its core. The job a rules engine would do —
"use this ability only when these conditions hold" — is expressed directly and
more cheaply as each action's pure `canExecute(ctx)` gate over a rich context,
resolved by the first-valid walk. There is no priority mutation at runtime.

A general-purpose rule registry (lifecycle + ordered evaluation with
activate/deactivate transitions) exists in the codebase as **reserved**
infrastructure for a future need that genuinely cannot be expressed as a gate. It
is intentionally **not wired into** the runtime, machines, or strategies today, so
it is not part of the public contract. If and when it is adopted, it will be
documented here.

## Seeing why an action was chosen

A **decision trace** can record each selection pass — what was considered and why
the winner won — for debugging or a config overlay. It is off by default so the
hot path stays free:

```js
nexBash.trace.enable();
// …fight for a bit…
nexBash.trace.list();   // inspect the recent decisions
nexBash.trace.disable();
```

You can also subscribe to a live stream with `nexBash.trace.subscribe(fn)`.
