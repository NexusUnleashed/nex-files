---
title: Custom prompt
description: Enable and customize the nexSys4 prompt renderer.
---

# Custom prompt

Enable the built-in renderer with **Custom Prompt** on the System tab. The same
setting is available through JavaScript:

```js
nexSys.api.prompt.enabled = true;
```

The prompt presenter exposes three configuration buckets:

- `vars` for general render values
- `affs` for affliction display configuration
- `cureColors` for cure-color overrides

Read the current public prompt snapshot at `nexSys.state.prompt`. Integrations
can patch presenter values or apply a preset through `nexSys.api.prompt`.

```js
nexSys.api.prompt.patchVars({ h: { text: "75" } });
nexSys.api.prompt.markPromptDirty();
```

Prompt output is evaluated at prompt boundaries. Prefer the public patch and
dirty-marking methods over mutating presenter internals.
