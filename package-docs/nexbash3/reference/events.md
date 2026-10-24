---
title: Events
description: EventStream topics nexBash4 emits, and the host topics it reacts to.
---

# Events

nexBash communicates over the Nexus `eventStream` global — the canonical listener
interface for cross-package integrations. Other packages subscribe the same way
they would to any Nexus topic:

```js
eventStream.registerEvent(
  "nexbash4.target.selected",
  (target) => {
    console.log("nexBash engaged", target.name);
  },
  { id: "my-package:target-selected", tags: ["my-package"] },
);
```

Listeners nexBash itself registers are tagged `["nexBash"]` plus a specific
owner tag. Area setup additionally uses one exact activation scope, so leaving
an area removes only the listener IDs that activation created.

## Topics nexBash emits

These `nexbash4.*` topics are nexBash's outbound contract. An integration may
rely on them.

### Target and combat

| Topic | Payload | Emitted when |
| --- | --- | --- |
| `nexbash4.target.selected` | the chosen target object | A target is selected to engage. |
| `nexbash4.target.gotShield` | the target | The active target raised a shield. |
| `nexbash4.npc.lostShield` | the razed NPC | A combatant's shield came down (raze or observed loss). |
| `nexbash4.target.lost` | none | The active target left the room or died. |
| `nexbash4.target.slain` | `{ id, name }` | A tracked combatant was definitively killed. This includes delayed death lines for a non-active tracked target. |

### Area and run

| Topic | Payload | Emitted when |
| --- | --- | --- |
| `nexbash4.started` | `{ area }` | A run went live. Fires once per run (not on an actor-reuse restart), so it pairs 1:1 with `nexbash4.stopped`. |
| `nexbash4.area.activated` | area lifecycle payload | An owned area clone and its scoped setup are live. |
| `nexbash4.area.deactivated` | area lifecycle payload | The outgoing area's automations and scoped cleanup completed and the active area is `null`. |
| `nexbash4.area.changed` | area lifecycle payload | The complete transition settled; subscribe here when only the final active identity matters. |
| `nexbash4.stopped` | `{ area, summary, runId }` | A run went inert on **any** route — manual `stop()`, a STOP event, or area-clear self-completion. Fires once per run after combat listeners and pending offence are released; `summary` is the final `{ kills, gold, elapsedMs }` scoreboard. `runId` identifies the owned hunt, or is `null` for manual bashing. |
| `nexbash4.area.cleared` | the active `Area` | The bashing run completed (for routed areas). Fires at the prompt after route completion, allowing the final block's gold-drop triggers to queue pickup first. Precedes the run's `nexbash4.stopped`; does not wait for pickup acknowledgment. |
| `nexbash4.room.cleared` | `{ room }` | The current room holds no targets — a fresh room with nothing spawned yet, or the last target just died. Fires every time `checkingForTargets` confirms this, so it may repeat for the same room. |
| `nexbash4.room.skipped` | `{ room, reason, detail }` | Policy skips a contested room, an authored avoid target, or a room with no safe target inside the attacker budget. |
| `nexbash4.discovery.recorded` | `{ areaKey, areaName, npc, field, value, source }` | A new mob observation was recorded mid-run, such as an observed damage range. |
| `nexbash4.discovery.report` | `{ reason, area, discoveries }` | A run ended (`reason` is `"manualStop"` or `"areaClear"`); reports the run's discoveries. |
| `nexbash4.quest.chain.complete` | none | A scripted quest chain finished. |

### Area lifecycle

Each of the three area lifecycle topics carries the same deeply frozen,
JSON-safe shape:

```js
{
  area: { key, gameId, gameName } | null,
  previousArea: { key, gameId, gameName } | null,
  nextArea: { key, gameId, gameName } | null,
  location: { areaId, areaName },
  reason: "location" | "reload" | "api" | "registration"
}
```

The area fields are identity descriptors, not live mutable `Area` instances.
`key` is the canonical persisted identity (for example `"id:207"`). The reason
reports whether the transition came from normal location reconciliation,
`nb clear`, `nexBash.api.config.setArea`, or area registration.

Ordering is deterministic:

- First activation: `activated` → `changed`.
- Area A to area B: `deactivated` → `activated` → `changed`.
- Area A to an unsupported location: `deactivated` → `changed`, with
  `area`/`nextArea` set to `null` in the final payload.
- Resolving the already-active area is a no-op. An explicit reload still runs
  the complete A-to-A lifecycle with `reason: "reload"`.

An owned hunt session uses the same lifecycle with `reason: "lease"` when it
pins its task area and `reason: "leaseRelease"` when it restores the area for the
player's current location. Location reconciliation cannot replace a leased area
mid-session.

During `deactivated`, `nexBash.area` is already `null`. During `activated` and
the final `changed`, it is the incoming owned clone. There is exactly one
`changed` event per successful transition. External packages should use the
edge events for enter/exit work and `changed` for caches that only need the
settled identity.

### Mnemosyne

| Topic | Payload | Emitted when |
| --- | --- | --- |
| `nexbash4.mnemosyne.level.changed` | `{ themeId, themeName }` \| `null` | A generated level loaded (its flavor line matched a theme), or the Mnemosyne area deactivated (`null`). |

The payload is the new value of `nexBash.mnemosyne.level`, deeply frozen. Every
level load raises it, including a second level of the same theme, because each
generated level is new. Leaving Mnemosyne raises it once with `null`, during the
area's scoped cleanup. Attach per-level Mnemosyne work to this topic rather than
to the Mnemosyne area.

### Owned hunt sessions

Every `nexbash4.hunt.*` event contains `type`, `runId`, `owner`, `area`,
`objective`, and the current `progress`. The optional callback passed to
`api.hunt.start` and subscribers added with `api.hunt.subscribe` receive the
same frozen event object raised on EventStream.

| Topic | Additional payload | Emitted when |
| --- | --- | --- |
| `nexbash4.hunt.started` | none | The area lease and first normal bash pass are live. |
| `nexbash4.hunt.targetSlain` | `{ target, matchedObjective }` | A tracked target dies; progress includes exact objective matches. |
| `nexbash4.hunt.roomCleared` | `{ room }` | A room in the requested route is verified clear. |
| `nexbash4.hunt.roomSkipped` | `{ room, reason, detail }` | A room in the requested route is skipped by nexBash policy. |
| `nexbash4.hunt.finished` | terminal fields | Exactly once, after the old combat actor/listeners have stopped, pending offence has been removed, and normal area and option state have been restored. Safe to start the next task from this callback. |

Each hunt is exactly one route pass. Terminal outcomes are:

| Outcome | Meaning | Reasons |
| --- | --- | --- |
| `success` | The route pass completed and the objective was met. | `routeCompleted`, `killQuotaReached` |
| `failure` | The route pass completed but the objective was not met. | `killQuotaNotMet` |
| `aborted` | The route pass did not complete. | `bashingStopped`, or the caller's cancellation reason |

Every terminal carries frozen `{ clearedRooms, skippedRooms, unreachedRooms }`
coverage. Each skipped entry contains `{ room, reason, detail }`; coverage is
evidence and never changes the outcome. All control operations are run-id
correlated, so an old callback cannot cancel or observe a newer run by accident.

### Effect availability

The life-force talisman effects (bloodcloak, deathcape, maya) announce when they
become usable and when they go away. These are the high-level semantic topics a
display attaches to; the payload is the effect name.

| Topic | Payload | Emitted when |
| --- | --- | --- |
| `nexbash4.effect.got` | `"bloodcloak"` \| `"deathcape"` \| `"maya"` | The effect became available. Fires once on the availability edge, not on each recharge (the timer's `*.started.<id>` topic marks recharges). |
| `nexbash4.effect.lost` | the effect name | The effect was consumed or its hold expired. Fires once, whichever edge (game text or the expiry timer) came first. |
| `nexbash4.effect.charged` | `{ name, charges, max }` | A charge accrued. Only deathcape reports a running count (`0`→`50`); it fires on **every** kill line (even at full), carrying the authoritative count for a counter display. Bloodcloak and maya are binary availability and never emit this. |

### Effect timers

The transient-effect expiry timers (bloodcloak, maya, deathcape) emit a scoped
lifecycle topic per timer id:

| Topic | Emitted when |
| --- | --- |
| `nexbash4.timer.started.<id>` | The timer started or re-armed. |
| `nexbash4.timer.reset.<id>` | The timer was reset. |
| `nexbash4.timer.stopped.<id>` | The timer elapsed (the effect winds down). |

`<id>` is `bloodcloak`, `maya`, or `deathcape`. nexBash listens to its own
`*.stopped.<id>` topics to mark the matching effect unavailable.

## Topics nexBash reacts to

nexBash is primarily a **consumer** of host state. It subscribes to the following
topics from nexSys4, nexMap, and the raw Nexus/GMCP stream. These are listed for
context — they are owned by those packages, not by nexBash.

### Always-on (application level)

| Topic | nexBash's reaction |
| --- | --- |
| `nexsys4.system.class.changed` | Re-select the class strategy. |
| `nexsys4.system.paused` / `.unpaused` | Hold / release the bash machine under the `"system"` reason (see `api.control.hold`). Other holders stay in force. |
| `nexmap4.area.changed` | Resolve and apply the area for the new location. |
| `IRE.Misc.Achievement` | Record the `TotalCreaturesKilled` total and collect gold. Every achievement counter shares this message; other names are ignored. |
| `IRE.Target.Info` | Update the active target's HP. |
| `nexskill.match.skill.<skill>.<id>` | Track crowd-control landing on a target (stormbolt, dilation, ague, scorch, psidaze, deaden, temperance, stagnate, cleanseaura, boinad, curse). |
| `nexskill.match.npc` | Record NPC damage received during an active run. |
| `nexsys4.aff.got` / `nexsys4.aff.lost` | Drive the bloodcloak → bloodshield automation. |
| `nexsys4.def.got.bloodshield` / `.lost.bloodshield` | Drive the bloodcloak automation. |
| `PromptEvent` | One-shot Loki affliction probe and gold collection. |
| `nexbash4.target.selected` | Pre-draw morimbuul and run per-area target customizations. |

### Combat-scoped (only while a run is live)

The bash machine subscribes these only in its `combat` state and tears them down
on exit:

| Topic | nexBash's reaction |
| --- | --- |
| `PromptEvent` | Per-prompt attack selection. |
| `battlerageUpdate` / `nexsys4.def.got.freerage` / `nexsys4.system.rage.changed` | Re-run autonomous battlerage selection. |
| `nexskill.match` | Track skill razes and battlerage ability/balance consumption; NPC matches on the same generic topic are ignored unless they carry `action.skill`. |
| `IRE.Display.ButtonActions` | Track per-ability battlerage availability. |
| `nexsys4.item.room.added` / `.removed` | Track the room's combatant roster in both directions: a mob arriving or leaving re-scans the room, and the active target leaving/dying ends the engagement. |
| `nexmap4.room.changed` / `nexmap4.pathing.start` / `nexmap4.pathing.complete` | Drive room re-scan and pathing updates. |
| `Room.Players` | Re-evaluate room contest and target count. |
| `nexsys4.def.got.shield` / `.got.prismatic` / `nexsys4.aff.got.aeon` | Suspend offence and clear offence queues. |

## Contract notes

- `battlerageUpdate` is an internal signal nexBash raises to poke its own rage
  re-evaluation; it is not a `nexbash4.*` topic and is not a stable integration
  point.
- Effect-timer topics are scoped by id; subscribe to the specific
  `nexbash4.timer.stopped.bloodcloak` form, not a wildcard.
- nexBash never freezes, clones, or deletes from the global `GMCP` object — it is
  the shared source of truth for the whole client.
