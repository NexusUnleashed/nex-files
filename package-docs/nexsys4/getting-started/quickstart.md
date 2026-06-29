---
title: Quickstart
description: Complete the first nexSys4 configuration and verify character state.
---

# Quickstart

## 1. Open configuration

Run this in the Nexus developer console:

```js
nexSys.api.ui.openConfig();
```

The dialog has five tabs: **System**, **Aff Priorities**, **Defences**,
**Precache**, and **Colors**.

## 2. Review system settings

On the System tab:

1. Choose Transmutation or Concoctions.
2. Choose whether health or mana has sip priority.
3. Review the sip, moss, fracture, and mana thresholds.
4. Enable only the notices and client overrides you want.

See [System configuration](../guides/configuration/system.md) for the setting
semantics and current defaults.

## 3. Set priorities and defences

Drag afflictions into the desired priority columns. Priority `0` is the ignored
column. On Defences, select the current class, choose player-controlled defup
entries, and review each defence priority.

## 4. Set precache targets

Choose the herb and mineral quantities nexSys4 should maintain. A value of `0`
disables precaching for that item.

## 5. Save

Changes remain a draft until **Save** is selected. Saving persists the changed
settings and asks the runtime to reconcile them with server-side curing.

## 6. Verify live state

Once logged in and startup is complete, inspect a few read-only snapshots:

```js
nexSys.state.class;
nexSys.state.affs;
nexSys.state.balances;
nexSys.state.serverside;
```

For a complete, copyable debug snapshot:

```js
JSON.stringify(nexSys.state, null, 2);
```

