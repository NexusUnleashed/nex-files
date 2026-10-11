---
title: Areas
description: The area model — targets, NPC flags, and discovery.
---

# Areas

An **area** is everything nexBash needs to grind one place: which mobs to fight,
in what order, and how to behave while there. nexBash ships a
library of area definitions and selects the right one from your location.

## What an area holds

| Field | Meaning |
| --- | --- |
| `gameName` / `gameId` | Area identity (a scalar or a list of IRE area names/ids). |
| `npcs` | A map of NPC name → combat facts (`aggro`, `canAssist`, `assistGroup`, `ccMinAttackers`, `attackerWeight`, `canShield`, `totalHp`, …). |
| `areaTargets` | The ordered target priority list (defaults to the `npcs` keys). |
| `avoidTargets` | NPC names whose presence makes nexBash skip the room. |
| `maxAttackers` | Maximum projected attackers nexBash may engage, each counting as its NPC's `attackerWeight` (default 99). |
| `stepDelay` / `startRoom` | Optional pacing and entry-room hints. |
| `setup(area, scope)` | Optional trusted package setup for scoped triggers, rules, and events. |
| `automations` | Persisted command actions run on activation or deactivation. |

Configure targets and NPC flags in the
[Area Configuration](./configuration/area-configuration.md) tab.

## Projected attackers

Room population and attackers are different facts. nexBash tracks the exact
GMCP IDs already expected to be attacking, then projects what each proposed
action would add:

- a directly attacked NPC is an attacker;
- every present NPC with `aggro: true` is an attacker;
- `canAssist: true` with no `assistGroup` defends any directly attacked NPC;
- a grouped assistant defends only a direct target with the same explicit
  `assistGroup`;
- `groupName` is unrelated display/squint metadata.

Each projected attacker counts as its NPC's `attackerWeight` — `1` unless the
area says otherwise — and an action is legal only when that weighted total is
within `area.maxAttackers`. With every weight at `1` the budget is a plain
headcount; a weight of `2` marks a denizen that uses two attackers' worth of the
area's survivable budget. The same total decides escape: once the engaged
attackers weigh more than `maxAttackers`, fly, burrow and flee become eligible.
Selection searches past unsafe high-priority candidates, so
an unsafe first target does not make nexBash abandon a room when a later target
is safe. Shield swaps, coupled rage plus primary attacks, autonomous rage, and
fixed-size AoE all use the same projection.

`ccMinAttackers` separately controls crowd control. `0` disables CC for that NPC;
otherwise CC is eligible when the current attacker count reaches the configured
minimum. That count is a plain headcount; attacker weights do not apply.

## No per-NPC danger field

`attackerWeight` says how much of the area's attacker budget a denizen uses. It
cannot say that one particular denizen must be fought alone in an area where
everything else may be fought together: pushed that far, a weight would make
nexBash flee a fight it had already committed to. `threatLevel` used to try: a non-negative integer that sorted above every live combat fact and refused
multi-target attacks while one was present.

It has been removed. The behaviours it was reaching for turned out to depend on
live state rather than on a static rank:

- *May I engage this at all?* An isolation requirement — "never fight this
  alongside anything else" — is a per-denizen constraint, and the only knob
  carrying it was the area-wide `maxAttackers`.
- *May I disengage once committed?* No ranking key can reach this: the shield-swap
  planner excludes the active target from its own candidates, so a target's rank
  has never had any bearing on whether nexBash leaves it.

Target selection is therefore a pure progress ordering — shielded last, then
lowest HP, then the area's declaration order — and every safety term lives at the
engagement boundary where the projected attacker set is known.

`ccMinAttackers` is unaffected and remains the CC axis: *"is controlling this
worth the rage right now?"*, player-tunable, per NPC.

Real play scenarios and the design work replacing this live in
`docs/scenarios/target-selection.md`.

## Selecting an area

nexBash matches your current `GMCP.Location` to a registered area and makes it
live. This happens automatically on area change (it listens for the nexMap
area-change event), and on `nb start`:

- `nb start` resolves the area for your location, makes it live, and begins.
- `nb clear` explicitly deactivates and reloads the current area, then restarts —
  use it after editing targets or lifecycle automations.
- Entering an unsupported area deactivates the old area, leaves
  `nexBash.area` as `null`, and stops a live run; resources and combat never
  leak from the previous location.

When an area is active, it is always an **owned clone** of the definition, never
the shared definition itself. Per-room combat mutations (a user-added target,
discovered damage data, lifecycle flags) live on the clone, so they can never
leak back into the shipped definition or a sibling area.

## Custom behavior at area boundaries

Use the extension surface that matches who owns the behavior:

1. In the config dialog, add command-only **On activation** or **On
   deactivation** automations. They are validated, persisted per area, and run
   at the matching lifecycle edge.
2. An external package subscribes to the semantic EventStream topics
   `nexbash4.area.activated` and `nexbash4.area.deactivated`. This keeps the
   package's code and cleanup under that package's ownership.
3. A code-authored area registered by nexBash or another package may provide
   `setup(area, scope)` when it must install low-level triggers, rules, or
   listeners. Register each resource with the supplied scope; it is disposed
   exactly when that activation ends.

For example, an external package can attach enter/exit behavior without
modifying the Area definition:

```js
const tags = ["my-package"];

eventStream.registerEvent(
  "nexbash4.area.activated",
  ({ area, reason }) => {
    if (area?.key === "id:207") console.log("Entered Tuar", reason);
  },
  { id: "my-package:tuar-enter", tags },
);

eventStream.registerEvent(
  "nexbash4.area.deactivated",
  ({ area, nextArea, reason }) => {
    if (area?.key === "id:207") console.log("Left Tuar", nextArea, reason);
  },
  { id: "my-package:tuar-exit", tags },
);

// When your package unloads:
eventStream.removeByTag(tags);
```

Lifecycle payloads contain frozen identity descriptors, not mutable live Area
instances. See the [event contract](../reference/events.md#area-lifecycle) for
the complete payload and ordering.

At its simplest, a code-authored area can run one piece of code when it loads
and return another piece of code to run when it unloads:

```js
const area = new nexBash.classes.Area({
  gameId: 207,
  gameName: "the Island of Tuar",
  setup(area) {
    nexusclient.send_commands(`say I have arrived at ${area.gameName}!`);

    return () => {
      nexusclient.send_commands("say Area complete!");
    };
  },
});

nexBash.api.config.registerArea(area);
```

`setup()` runs each time the area becomes active. The function it returns is the
area's teardown function, which runs when that activation ends. More advanced
area code can also accept `scope` as the second argument and use
`scope.registerEvent`, `scope.addTrigger`, or `scope.loadRules`; the scope cleans
those resources up automatically in reverse order.

## Combat Loop

While a run is live, the bash machine drives a loop: scan the room, check whether it is contested by non-party players, build and rank the target list, and fight until clear.

If you move to a new room (by walking or using a separate pathing command), nexBash detects the room change, scans the new room, and automatically resumes combat if valid targets are present.

## Adding your own area and targets

You can build area data live from the command line:

```text
nb addarea               # register the current GMCP area as a new, empty area
nb addnpc a cave troll   # add an NPC target to the active area (exact name)
```

`nb addarea` persists the new area and makes it live. `nb addnpc` adds to the live
area and, when the area is registered, persists the change too. Both keep the
area's derived lookup caches consistent.

Packages that build areas programmatically can hand a ready-made `Area` instance
to nexBash:

```js
const area = new nexBash.classes.Area({ gameId, gameName, npcs, areaTargets });
nexBash.api.config.setArea(area); // runs the full enter/exit lifecycle
```

Areas passed this way are ephemeral — they are made live but not added to
`nexBash.areas`.

A provider with a complete, authoritative area definition can register it
without activating it:

```js
nexBash.api.config.registerArea(area, { replace: false });
```

Registered areas participate in normal location resolution and can also supply
richer NPC metadata to an [owned hunt session](../reference/api.md#apihunt).
Configured metadata is preferred, while an unconfigured requested target uses
the standard `Npc` defaults only on the session's transient area clone. Those
defaults are not added to the registered definition or persisted settings.

## Discovery

As nexBash fights, class strategies that probe (for example Magi) record observed
damage ranges for each mob and damage type. Discoveries are de-duplicated per
run and reported when the run ends so you can vet the data before editing NPC
flags such as resistances. See [Session & automations](./session-and-automations.md).
