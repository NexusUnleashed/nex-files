---
title: Reference
description: Stable public contracts for nexMap4 state, functions, settings, and events.
---

# Reference

The public global has three primary roots plus a small set of lifecycle helpers:

```text
nexMap
|-- state       read-only location/path snapshot (getter)
|-- api         callable domain namespaces
`-- settings    persisted options and subscriptions
```

- [State reference](./state.md): the frozen `nexMap.state` snapshot and its branches
- [API reference](./api.md): callable domain namespaces under `nexMap.api`
- [Event reference](./events.md): public `nexmap4.*` EventStream topics, plus the startup and settings subscription surfaces

Everything below `state` is data. Everything below `api` is callable behavior.
`settings` is the persisted-options boundary. Construction-grade objects exposed
during bootstrap (`nexMap.commands`, `nexMap.adapter`, `nexMap.uiStore`,
`nexMap.trackingStore`) are internal wiring, not part of the public contract.

## Lifecycle helpers

| Member | Purpose |
| --- | --- |
| `nexMap.start()` | Begin (or re-attach to) startup. Idempotent. |
| `nexMap.getStartupState()` | Current startup phase and any failure detail. |
| `nexMap.connectRendererActions(options)` | Wire renderer room-clicks to a command (defaults to travel). |
| `nexMap.destroy()` | Tear down the runtime and its startup coordinator. |
