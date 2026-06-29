---
title: Configuration
description: Overview of the nexBash4 configuration dialog.
---

# Configuration

Open the configuration dialog from the command line:

```text
nb config
```

The dialog edits a **draft**. Every control mutates only the draft; the live
`nexBash` runtime stays the source of truth until you commit. **Save** validates
the draft, applies it to the runtime, and persists it; **Cancel** discards it.
Save and Cancel are therefore atomic — nothing reaches the runtime mid-edit.

## Tabs

| Tab | Purpose |
| --- | --- |
| [nexBash Options](./options.md) | Global behavior toggles and battlerage rage reserves. |
| [Class Configuration](./class-configuration.md) | Per-class attack and battlerage priority, and combat profiles. |
| [Area Configuration](./area-configuration.md) | Per-area settings, target order, and per-NPC combat flags. |

## How the draft works

When the dialog opens it **hydrates** a snapshot of the live runtime into a
plain-object draft. As you edit:

- Option toggles and rage buffers update the draft's `options` / `battlerage`.
- Class-config drag-and-drop and tuning update the draft's per-class profile delta.
- Target edits update the draft's per-area settings.

On **Save**, the draft is validated against the canonical settings schema, applied
to the runtime, and written to the Nexus variable store. A customized class lane
**owns its order** — newly shipped actions land on the config "bench" rather than
silently injecting into your priority. See
[Strategies](../strategies.md) for that membership model.

:::note Screenshots
The screenshots in these pages illustrate layout. The installed release remains
the authority for available entries and defaults.
:::
