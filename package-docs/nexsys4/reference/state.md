---
title: State reference
description: Read-only snapshot branches exposed by nexSys4.
---

# State reference

`nexSys.state` is the read-only data surface. Each branch returns a fresh,
frozen snapshot from its domain model.

```js
if (nexSys.state.affs.asthma?.have) {
  // react to the current snapshot
}
```

## Branches

| Branch | Value | Contents |
| --- | --- | --- |
| `state.system` | object | Settings, baseline intent, runtime, character, target, and room state |
| `state.target` | object | Current target record |
| `state.class` | string | Current normalized character class |
| `state.affs` | object | Affliction records keyed by name |
| `state.defs` | object | Defence records keyed by name |
| `state.balances` | object | Balance records keyed by id |
| `state.limbs` | object | Limb records keyed by limb id |
| `state.queue` | object | Queue-controller snapshot |
| `state.cache` | object | Inventory, rift, and desired precache state |
| `state.prompt` | object or `null` | Prompt variables, affliction display config, and cure colors |
| `state.serverside` | object | Baseline, desired, observed, transient, and pending curing state |

## Serialization contract

The complete state tree is JSON-serializable and contains no function values:

```js
const report = JSON.parse(JSON.stringify(nexSys.state));
```

This is the preferred shape for debug captures and bug reports. Snapshot
objects are frozen; call a method under `nexSys.api` to request a change.

## Fresh reads

A captured branch does not update in place. Read the branch again after a
state transition:

```js
const before = nexSys.state.affs;
// an affliction event occurs
const after = nexSys.state.affs;
```

Use [events](./events.md) when an integration needs to know when to re-read.

