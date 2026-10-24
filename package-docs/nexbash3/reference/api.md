---
title: API reference
description: Callable namespaces and top-level helpers on the nexBash global.
---

# API reference

Callable behavior is grouped by domain under `nexBash.api`. A small set of
lifecycle helpers and accessors also live directly on the global.

## `nexBash.api` namespaces

| Namespace | Purpose | Methods |
| --- | --- | --- |
| `api.control` | Manual run lifecycle and internal run-control mechanics | `start`, `stop`, `enableLokiCheck`, `hold`, `release`, `isHeld` |
| `api.hunt` | Correlated, externally owned PvE executions | `start`, `stop`, `get`, `subscribe` |
| `api.config` | Area / NPC configuration | `setArea`, `registerArea`, `addArea`, `addNpc` |
| `api.observe` | Report observed game-state into the owned models | `npc.shield.*`, `npc.cc.*`, `self.effects.*`, `self.battlerage.*` |
| `api.strategy` | Strategy profile management | `profiles.list`, `profiles.active`, `profiles.apply`, `profiles.save`, `profiles.remove` |
| `api.diagnostics` | Read-only troubleshooting snapshots | `report` |

### `api.control`

The manual lifecycle verbs. `start` and `stop` each flip the master `enabled`
switch, toggle the in-game "Bashing" reflex group, and drive the bash actor —
there is intentionally no separate enable/disable. Package and routine
automation must use `api.hunt`; `api.control` does not provide ownership,
correlation, or scoped cancellation.

```js
nexBash.api.control.start();        // resolve the area for this location, go live
nexBash.api.control.stop();         // go inert; report the run summary
nexBash.api.control.enableLokiCheck(); // arm a one-shot Loki affliction probe
```

`start()` is a visible no-op with a notice when no area matches your location.
`stop()` is silent when no run was active.

#### Holding the bash machine

`hold(reason)` pauses the bash machine without ending the run, and
`release(reason)` lets it go. Holds are reason-scoped, so independent holders
never undo each other: the machine pauses on the first reason and resumes only
when the last reason is released. While any reason is held, `start()` and a
room refresh leave the machine paused instead of scanning the room.

```js
nexBash.api.control.hold("my-package"); // → true when the reason was new
nexBash.api.control.isHeld();           // → true
nexBash.api.control.release("my-package"); // → true when the reason was held
```

On resume the machine requests a fresh room push before it re-evaluates the
room. nexBash holds the machine itself under the `"system"` reason while nexSys
is paused. Use a reason of your own, and always release it.

### `api.hunt`

`hunt` is the sole versioned automation boundary for a package that needs
nexBash to perform PvE while retaining ownership of its own workflow. The caller supplies
the objective, route, target names, and correlation identity; nexBash owns the
temporary area lease, combat, room coverage, progress, cancellation, and
restoration of the player's normal area.

```js
const result = nexBash.api.hunt.start({
  owner: {
    package: "task-runner",
    routineId: "task-runner:daily-clear",
    invocationId: crypto.randomUUID(),
  },
  targets: ["a cave rat"],
  route: [12001, 12002, 12003],
  startRoom: 12001,
  slow: true,
  objective: { type: "killQuota", requiredKills: 5 },
  onEvent(event) {
    console.log(event.runId, event.type, event.progress);
  },
});

if (result.ok) {
  // Cancellation is correlated: a stale or foreign run id cannot stop it.
  nexBash.api.hunt.stop({ runId: result.runId, reason: "callerCancelled" });
}
```

Every hunt is exactly one route pass. The supported objectives are:

- `{ type: "routePass" }`: succeed with `routeCompleted` when the route ends,
  regardless of skipped rooms.
- `{ type: "killQuota", requiredKills }`: count exact objective-target deaths,
  stop immediately with `killQuotaReached` when the quota is met, or fail with
  `killQuotaNotMet` when the route ends below quota.

The optional `slow` boolean selects slow-mode for this session and defaults to
`false`; the prior setting is restored when the session finishes. The optional
`area` may be a complete `Area` instance. Without it, the
API resolves a registered area for the current location. Configured NPC metadata
is preserved whenever available. A requested target missing from that area gets
the standard `new Npc()` defaults on the session's transient clone. If the
location has no registered area, nexBash builds a transient area from the current
GMCP identity, requested targets, and route. These inferred definitions are
never registered or persisted.

`start()` returns either `{ ok: true, runId, unsubscribe, snapshot }` or a
structured rejection. Only one normal run or hunt session may own nexBash at a
time. `get(runId)` returns a frozen active or recently completed snapshot.
`subscribe(runId, fn)` attaches an additional run-scoped listener and returns an
unsubscribe function. The callback and `nexbash4.hunt.*` topics carry the same
correlated event shapes.

Reaching a kill quota commits the hunt's terminal outcome before notifying
`targetSlain` subscribers. From that point, nexBash refuses further target
selection, attacks, battlerage, and route advancement, including signals in
the same received block while actor shutdown is deferred.

The `finished` callback is a handoff boundary: the old combat actor and its
listeners have stopped, pending offensive queue lanes have been cleared,
and the area lease and runtime settings have been restored. A subscriber may
start its next task or another hunt from that callback. Stale stop events and
deferred callbacks cannot stop the new run. Queues that no longer contain a
submitted attack, such as a lane holding only gold pickup, are preserved.

Terminal outcomes have one of these verdicts:

| Outcome | Meaning | Reasons |
| --- | --- | --- |
| `success` | The route pass completed and the objective was met. | `routeCompleted`, `killQuotaReached` |
| `failure` | The route pass completed but the objective was not met. | `killQuotaNotMet` |
| `aborted` | The route pass did not complete. | `bashingStopped`, or the caller's cancellation reason |

Every terminal and `get()` snapshot includes frozen, route-ordered coverage.
Duplicate room IDs appear once, and each room reflects the last decision made
there:

```js
coverage: {
  clearedRooms: [12001],
  skippedRooms: [
    {
      room: 12002,
      reason: "contested",
      detail: { players: ["Someone"] },
    },
  ],
  unreachedRooms: [12003],
}
```

Skip reasons are `contested` (`{ players }`), `avoidTarget` (`{ target }`), and
`noSafeTarget` (`{ attackable, maxAttackers }`). Coverage is evidence only; a
skip never decides the terminal outcome.

Feature detection is explicit:

```js
nexBash.capabilities.huntSession;          // "2.0.0"
nexBash.api.hunt.version;                  // "2.0.0"
nexBash.api.hunt.capabilities.objectives;  // ["killQuota", "routePass"]
nexBash.api.hunt.capabilities.slowMode;    // true
nexBash.api.hunt.capabilities.transientNpcDefaults; // true
```

### The `nexBash:hunt` routine

When nexConductor is loaded, nexBash registers `nexBash:hunt`: the hunt
session wrapped as a conductor routine. A routine in any package reaches
bashing through it, by registry id, instead of driving `api.hunt` itself:

```js
huntingMigri: {
  invoke: {
    src: "runRoutine",
    input: {
      id: "nexBash:hunt",
      input: {
        owner: { package: "nexQuest", routineId: "nexQuest:ancientGrudges" },
        targets: ["Dakk, leader of the Migri", "a Migri warrior"],
        route: [35104, 35809, 34871],
        startRoom: 35104,
        objective: { type: "killQuota", requiredKills: 6 },
      },
    },
    onDone: [{ guard: "succeeded", target: "claimingBounty" }, { target: "failed" }],
  },
  // A caller bounds the whole hunt with its own timer.
  after: { 600000: "timedOut" },
},
```

The routine first gets onto the route: it travels to `startRoom` when one is
given, otherwise it begins in the current room when that room is on the route
and travels to the route's first room when it is not. It then runs one hunt
session and finishes with the hunt terminal (`{ outcome, reason, runId,
progress, coverage, ... }`). A start nexBash refuses ends as
`{ outcome: "aborted", reason: "hunt-rejected", rejection }`, and an
unreachable route ends with the travel output. Leaving the invoking state
cancels exactly this hunt with `cancelReason` (default `routineCancelled`).
`runRoutine` reports `{ outcome: "aborted", reason: "unresolved" }` when nexBash
is not loaded.

### `api.config`

```js
// Make a ready-made Area instance the live bashing area (runs its lifecycle).
nexBash.api.config.setArea(areaInstance);

// Add a complete Area definition to the runtime catalog without activating it.
nexBash.api.config.registerArea(areaInstance, { replace: false });

// Register the current GMCP area as a new (empty) area definition and persist it.
nexBash.api.config.addArea();

// Add an NPC target to the active area. Persisted when the area is registered.
nexBash.api.config.addNpc("a Nelbennir alchemist");
```

`setArea` is the programmatic entry point for driving nexBash through an `Area`
built by a caller; ephemeral areas passed this way
are not added to `nexBash.areas`. It returns `true` when the Area crossed the
ownership boundary and `false` for invalid input or a re-entrant transition.
The replacement emits `nexbash4.area.deactivated`, `.activated`, and one final
`.changed` event with `reason: "api"`; integrations should subscribe to those
events instead of adding callbacks to the Area instance.

`registerArea` accepts a complete `Area`, clones it into the runtime catalog,
and returns `{ ok, added, area }`. Identity is the canonical game area id/name.
An existing definition is retained unless `{ replace: true }` is explicit. This
is the generic extension point for private catalogs and independently shipped
area providers; registration does not activate the area or start combat.

### `api.observe`

The ingress vocabulary mirroring nexSys4's `api.observe.*`: triggers, skill
matches, and GMCP bridges *report what they observed* with `got` / `lost`, and
the owner models decide what changed. Scoped by subject so the two are never
conflated — `npc.*` is a combatant's attributes, `self.*` is your character's
nexBash-owned state.

```js
// A combatant gained / lost a shield (name optional → the active target).
nexBash.api.observe.npc.shield.got("a tuar warrior");
nexBash.api.observe.npc.shield.lost();

// A crowd-control type landed on / faded from a combatant.
nexBash.api.observe.npc.cc.got("sensitivity");
nexBash.api.observe.npc.cc.lost("sensitivity");

// A nexBash-tracked effect changed. got/lost flip availability (bloodcloak, maya);
// charge accrues a deathcape charge (0–50) and flips availability on the first one.
nexBash.api.observe.self.effects.got("bloodcloak");
nexBash.api.observe.self.effects.lost("maya");
nexBash.api.observe.self.effects.charge("deathcape");

// Battlerage availability: the shared balance, or a named ability's own cooldown.
nexBash.api.observe.self.battlerage.got();
nexBash.api.observe.self.battlerage.lost();
nexBash.api.observe.self.battlerage.ability.got("disintegrate");
nexBash.api.observe.self.battlerage.ability.lost("disintegrate");
```

### `api.strategy.profiles`

Named customization variants of the **active class's** strategy. See
[Profiles](../guides/profiles.md).

```js
nexBash.api.strategy.profiles.list();        // ["default", "solo", "group"]
nexBash.api.strategy.profiles.active;         // "default" (getter)
nexBash.api.strategy.profiles.apply("group"); // swap to a profile (persists)
nexBash.api.strategy.profiles.save("solo");   // snapshot current tuning as a profile
nexBash.api.strategy.profiles.remove("solo"); // delete a profile (default is protected)
```

Each command resolves against the active strategy: an unsupported class or an
unknown profile surfaces an in-client notice and is a no-op — it never throws.

### `api.diagnostics`

```js
const report = nexBash.api.diagnostics.report();
```

`report()` prints one JSON block to the developer console and returns the same
structured object. It correlates the run machine, room/area matching, target
priorities, exact attacker projections and budgets, strategy/profile lanes, action gates, offence
blockers, integrations, and persisted-settings schema. It does not modify live
state. Character and player names are omitted; NPC names and item/target IDs are
included because they are needed to diagnose exact-name and targeting failures.

## Top-level lifecycle helpers

| Member | Purpose |
| --- | --- |
| `nexBash.setStrategy(name)` | Look up a class strategy by name and make it active; surfaces a notice and resets to inert on an unsupported class. Returns whether one was activated. |
| `nexBash.aliases(input)` | Parse and execute an `nb …` command string (the alias entry point). See [Commands](../guides/commands.md). |
| `nexBash.notice(text)` | Emit a nexBash status notice to the client (respects the `notices` option). |
| `nexBash.log(text)` | Emit a diagnostic log line (respects the `logging` option). |

## Catalog and trace handles

| Handle | Purpose |
| --- | --- |
| `nexBash.actionCatalog` | The flat, namespaced action catalog: `entries`, `keys`, `byId`, `ambiguousIds`, `get(key)`, `has(key)`, `list({namespace})`, `listById(id)`. |
| `nexBash.trace` | The decision trace stream: `enable()`, `disable()`, `subscribe(fn)`, `list()`, `clear()`, `isTracing()`. Off by default. |
| `nexBash.classes` | The `Npc` and `Area` constructors, for building areas programmatically. |
| `nexBash.areas` | The registered area definitions (sorted by name). |
| `nexBash.strategies` | The shipped per-class strategies, keyed by class id. |

## Return values

Predicate and toggle methods return booleans. Configuration mutations commonly
return whether a change was made (and emit a notice). Callers should not assume a
mutation is synchronous server confirmation — use `state` and events to observe
the confirmed result.

## Events are separate

Listeners do not live under `api`. Other packages attach listeners through the
Nexus `eventStream` global. The [events page](./events.md) lists the topics
nexBash emits and the host topics it reacts to.
