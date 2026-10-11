---
title: State reference
description: Every branch of nexSys.state, the read-only view of your character and of nexSys itself.
---

# State reference

`nexSys.state` is nexSys's read-only data. It holds no functions. Each branch
returns a fresh, frozen snapshot every time you read it.

```js
if (nexSys.state.affs.asthma.have) {
  // you have asthma right now
}
```

## Branches

| Branch | Contents |
| --- | --- |
| [`state.system`](#statesystem) | Settings, runtime status, character, and target |
| `state.class` | Your current class, such as `"Occultist"` |
| `state.target` | Your current target. The same as `state.system.target`. |
| [`state.room`](#stateroom) | The current room: identity, exits, walls, and frozen ground |
| [`state.affs`](#stateaffs) | Afflictions, keyed by name |
| [`state.defs`](#statedefs) | Defences, keyed by name |
| [`state.balances`](#statebalances) | Balances and cooldowns, keyed by name |
| [`state.limbs`](#statelimbs) | Your limbs, keyed by limb |
| [`state.trackables`](#statetrackables) | Tracked effects, keyed by name |
| [`state.queue`](#statequeue) | Command queues, keyed by queue id |
| [`state.cache`](#statecache) | Curative counts and precache amounts |
| `state.prompt` | The prompt's `vars`, `affs`, and `cureColors`. See [Custom prompt](../guides/custom-prompt.md). |
| [`state.serverside`](#stateserverside) | Server-side curing, as nexSys sees it |
| [`state.rules`](#staterules) | The combined changes from active rules |

## Snapshots

The whole tree can be turned into JSON, which makes a complete copy for bug
reports or debugging:

```js
const report = JSON.parse(JSON.stringify(nexSys.state));
```

A snapshot you keep doesn't update. Read the branch again to see newer
state, and use [events](./events.md) to find out when to re-read:

```js
const before = nexSys.state.affs;
// ...an affliction is gained...
const after = nexSys.state.affs; // a new snapshot; `before` is unchanged
```

Snapshots are frozen. To change anything, call a function under
[`nexSys.api`](./api.md).

Timestamp fields such as `since`, `lastChangeAt`, and `lastLostAtMs` are
readings of nexSys's internal clocks, not times of day. To measure time, use
the `elapsedMs()`, `remainingMs()`, and `timing()` functions in the
[API](./api.md).

## `state.system`

| Key | Contents |
| --- | --- |
| `settings` | Your current settings. See below. |
| `baselineIntent` | The saved settings that nexSys reconciles against |
| `runtime` | `paused`, `slowMode`, `aeonLocked`, `rulesSuspended`, `phase`, `startupFailureMessage` |
| `char` | `name`, `class`, `race`, `hp`, `maxhp`, `mp`, `maxmp`, `ep`, `maxep`, `wp`, `maxwp`, `bleed`, `rage`, `dead`, `mount`, `wielded`, plus class resources such as `karma` while your class has them |
| `target` | `id`, `text` (the name), `isPlayer`, and `hp` |

`runtime.phase` is `RUNNING` once startup has finished. During startup it
moves through `PROBING_SEPARATOR`, `BOOTING`, `PROVISIONING_CURINGSET`,
`AWAITING_SNAPSHOTS`, and `CAPTURING_SNAPSHOTS`, and it's `FAILED`, with
`startupFailureMessage` set, if startup couldn't finish.

### Settings

`settings` mirrors the configuration window. Use these names with
[`nexSys.api.control.applySettings()`](./api.md#apicontrol):

| Key | Setting |
| --- | --- |
| `loadOnLogin`, `queueWhilePaused`, `overrideTab`, `customPrompt`, `debug` | The nexSys Config switches |
| `notices.affGot`, `notices.affLost`, `notices.defGot`, `notices.defLost`, `notices.balanceLost`, `notices.balanceRecovered`, `notices.trackableGot`, `notices.trackableLost`, `notices.priority`, `notices.output` | The notice switches |
| `ss.transmutation`, `ss.sipPriority`, `ss.batch`, `ss.tree`, `ss.focus`, `ss.focusOverHerbs`, `ss.focusWithGuilt`, `ss.focusWithFulminated`, `ss.clot`, `ss.clotAt`, `ss.clotTo` | Curing method |
| `ss.sipHealthAt`, `ss.sipManaAt`, `ss.mossHealthAt`, `ss.mossManaAt`, `ss.fracturesAbove`, `ss.manaThreshold` | Thresholds |

```js
nexSys.api.control.applySettings({ notices: { balanceLost: true } });
nexSys.api.control.applySettings({ ss: { sipPriority: "mana" } });
```

[Rules](../guides/rules.md) use the `ss` names without the `ss.` prefix, as
in `{ settings: { batch: false } }`.

## `state.room`

```js
{
  id: 12345,
  name: "A dusty road",
  exits: { n: 12346, s: 12344 },
  walls: { e: { icewall: { type: "icewall" } } },
  frozenGround: false,
  featuresKnown: true,
}
```

`featuresKnown` is `true` when nexSys has seen a complete description of the
room's walls and ground. Room contents aren't copied here; use
[`nexSys.api.room.items`](./api.md#apiroom) to check them.

## `state.affs`

One record per affliction nexSys knows, whether or not you have it:

| Field | Meaning |
| --- | --- |
| `have` | `true` while you have it |
| `count`, `min`, `max` | Current stacks, for afflictions that stack |
| `since` | When you gained it |
| `lastChangeAt` | When it was last gained or lost |
| `defaultPriority` | Your saved priority |
| `priorityOverride` | A priority set for this session, or `null` |

Use [`nexSys.api.affs.timing()`](./api.md#apiaffs) for elapsed and remaining
times.

## `state.defs`

One record per defence. The most useful fields:

| Field | Meaning |
| --- | --- |
| `have` | `true` while the defence is up |
| `priority` | The priority nexSys is using now |
| `defaultPriority` | Your saved priority |
| `static` | `true` for **Defup** defences, raised only by `defup` |
| `staticRequested` | `true` while a `defup` is waiting to raise it |
| `serverside` | `true` if server-side curing raises it, `false` if nexSys does |
| `command` | The command used to raise it |
| `bals_req`, `bals_used` | The balances it needs, and the ones it uses up |
| `skills` | The classes that have it. Empty means every class. |
| `opps` | Defences that can't be held at the same time |

## `state.balances`

Keyed by balance name, such as `balance`, `equilibrium`, `herb`, `salve`,
`smoke`, `focus`, `tree`, `sip`, `moss`, `writhe`, `voice`, and class
cooldowns such as `fitness` and `dragonheal`.

| Field | Meaning |
| --- | --- |
| `have` | `true` while the balance is available |
| `lastLostAtMs`, `lastGotAtMs` | When it was last used and last recovered |
| `expectedReadyAtMs` | When nexSys expects it back |
| `activeDurationMs` | How long the current loss is expected to last |
| `activeDurationReported` | `true` if the game reported that length (`Balance used:`) rather than nexSys estimating it |
| `baseDurationMs` | The usual length of a loss |

## `state.limbs`

Keyed by `head`, `torso`, `leftarm`, `rightarm`, `leftleg`, and `rightleg`:

| Field | Meaning |
| --- | --- |
| `percent` | Damage toward the next stage, from 0 to 100 |
| `hits` | Hits counted since the limb last reset |
| `stage` | `"healthy"`, `"damaged"`, or `"mangled"` |
| `broken` | `true` while an arm or leg is broken |

Torso damage is tracked by nexSys from the hits you take, because torso
trauma isn't shown when it lands. The other stages follow the game's
afflictions.

## `state.trackables`

Short-lived effects nexSys times itself, such as `snapTrack`, which lasts 8
seconds after you're snapped. Each record has `have`, `label`, `since`,
`expiresAt`, and `durationMs`.

## `state.queue`

Keyed by queue id (`freeQueue`, `classQueue`, and so on). See
[Queues](../guides/queues.md).

| Field | Meaning |
| --- | --- |
| `name`, `type` | The short name, such as `free`, and the Achaea queue type |
| `items` | Your queued commands |
| `prepend` | Commands added to the front |
| `plannerCommands` | nexSys's own automatic actions, which run first |
| `pending` | `true` while waiting for the game to accept the queue |
| `deferred` | `true` while held because nexSys is paused or starting |
| `exclusions` | Queues cleared when this one is sent |

## `state.cache`

| Key | Contents |
| --- | --- |
| `inventory` | Curatives in your inventory, by name |
| `rift` | Curatives in your rift, by name |
| `desiredPrecache` | Your precache amounts |
| `riftCapacity` | How much of one curative your rift holds |
| `hydration` | `inventoryKnown` and `riftKnown`: whether nexSys has read each yet |

Irid moss uses the curative key `irid` in these buckets. Incoming GMCP calls
it `moss`; nexSys normalizes that name to `irid`. The balance remains
`state.balances.moss`.

## `state.serverside`

| Key | Contents |
| --- | --- |
| `baseline` | Your saved curing configuration |
| `sessionBaseline` | Your configuration plus changes you made in game this session |
| `desired` | What nexSys wants the server to have, including active rule changes |
| `observed` | What the game has confirmed: `settings`, `affPriorities`, `defPriorities`, `prioAff`, `manualQueue`, `predictions`, and `prioritySet` |
| `transient` | One-off requests: `prioAff`, `manualQueue`, and `predictions` |
| `pending` | Commands sent and awaiting confirmation |
| `curingsets` | Your curing sets: `sets`, `activeSet`, `priorSet`, `used`, and `limit` |
| `startup` | What startup has captured so far |

[Curing and priorities](../guides/curing.md#for-scripters-inspecting-server-side-state)
explains how these fit together.

## `state.rules`

| Key | Contents |
| --- | --- |
| `overlay` | The combined changes from every active rule |
| `provenance` | For each changed key, the rule that won |
| `policy` | The class cures currently turned on |
| `applied` | The ids of the rules active in the last check |
| `suspendingRules` | Rules currently holding curing off |
| `registry` | Every rule, in evaluation order |

`nexSys.api.rules.list()` gives the same rules in a simpler form. See
[Rules](../guides/rules.md).
