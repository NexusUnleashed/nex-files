---
title: Configuration
description: Overview of the nexSys4 configuration dialog.
---

# Configuration

Open the configuration dialog from JavaScript:

```js
nexSys.api.ui.openConfig();
```

The dialog edits a draft. **Save** commits the changes and persists the
supported settings; **Cancel** closes the draft without applying it.

## Tabs

| Tab | Purpose |
| --- | --- |
| [System](./system.md) | Runtime switches, notices, curing method, and thresholds |
| [Aff Priorities](./affliction-priorities.md) | Default server-side affliction priorities |
| [Defences](./defences.md) | Class-filtered keepup/defup behavior and priorities |
| [Precache](./precache.md) | Desired herb and mineral quantities |
| [Colors](./colors.md) | Reserved for future prompt and UI color settings |

The dialog displays the running package version in its title bar. Screenshots
in this section illustrate the layout; the installed release remains the
authority for available entries and defaults.

