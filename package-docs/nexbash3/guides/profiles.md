---
title: Profiles
description: Save and switch between named priority variants of a class strategy.
---

# Profiles

A **profile** is a named customization variant of a class's
[strategy](./strategies.md). Where a strategy is the per-class shipped baseline,
a profile is a *named delta* layered on it — so you can keep several priority
setups for one class ("solo", "group", "safe") and switch between them at will.

A profile **is** a strategy delta. Profiles are a thin selection layer over the
same delta engine; they add no new tuning concepts.

## The default profile

Every class has an implicit `default` profile. A class you have never customized
has exactly one profile — `default` — whose delta is empty, so it behaves exactly
like the shipped strategy. The `default` profile cannot be renamed or deleted.

## Switching is safe mid-combat

Switching a profile just re-applies a delta, and the selector reads the effective
lanes fresh on every prompt — so changing profile mid-fight takes effect on the
next tick with no restart. Apply one with the command line or the API:

```text
nb profile group
```

```js
nexBash.api.strategy.profiles.apply("group");
```

## Managing profiles

### From the command line

| Command | Effect |
| --- | --- |
| `nb profile` | List profiles, marking the active one. |
| `nb profile <name>` | Switch to a saved profile. |
| `nb profile save <name>` | Save the current priorities as a profile and make it active. |
| `nb profile rm <name>` | Delete a profile. |

### From the API

```js
nexBash.api.strategy.profiles.list();        // ["default", "solo", "group"]
nexBash.api.strategy.profiles.active;         // the active profile name
nexBash.api.strategy.profiles.apply("solo");  // switch (persists the pointer)
nexBash.api.strategy.profiles.save("solo");   // snapshot current tuning as "solo"
nexBash.api.strategy.profiles.remove("solo"); // delete (default is protected)
```

Every command resolves against your active class strategy. On an unsupported class
(no active strategy) or an unknown profile name, the call surfaces an in-client
notice and is a no-op — it never throws. Successful changes persist immediately.

### From the configuration dialog

The [Class Configuration](./configuration/class-configuration.md) tab's strategy
toolbar has the same controls: a **Profile** dropdown, **Save as** to fork the
current edits into a new name, and **Rename** / **Delete**. The dialog always
edits the **active** profile, and it folds your in-progress edits back into their
profile when you switch — so nothing is lost moving between them.

## How profiles are stored

Per class, the persisted settings hold `{ activeProfile?, profiles }`, where each
profile is a normalized delta. The map is kept minimal: empty profile maps and
default-only classes are omitted, and `activeProfile` is omitted when it is the
default. A legacy single-delta (pre-profile) blob is tolerantly folded into
`{ profiles: { default: <delta> } }` on load, so older settings still work. See
the [settings reference](../reference/options.md).
