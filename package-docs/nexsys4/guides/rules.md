---
title: Rules
description: Apply temporary condition-driven curing behavior with nexSys4 rules.
---

# Rules

Rules apply temporary overlays to server-side curing behavior. They are useful
for conditions such as a class matchup, target state, room state, or a short
combat window where the normal baseline should be adjusted.

A rule has a stable id and an `evaluate(ctx)` function. When its condition is
not met, return `null`. When it is met, return only the patch the rule owns.

```js
const rule = {
  id: "prioritize-asthma",
  evaluate(ctx) {
    if (!ctx.haveAff("slickness")) return null;
    return {
      affPriorities: { asthma: 1 },
    };
  },
};

nexSys.api.rules.add(rule);
```

## Lifecycle

Rules can be added, removed, enabled, disabled, ordered, and grouped into
packs. Evaluation is deterministic: enabled rules are evaluated in configured
order and later contributions win for overlapping keys unless a terminal rule
stops evaluation.

Keep side effects outside `evaluate`. Use transition handlers when an
integration must react to activation or deactivation:

```js
const dispose = nexSys.api.rules.bindTransition("prioritize-asthma", {
  onActivate(payload) {},
  onDeactivate(payload) {},
});
```

The caller owns the disposer returned by `bindTransition`.
