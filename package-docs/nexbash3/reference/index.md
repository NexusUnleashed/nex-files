---
title: Reference
description: Stable public contracts for nexBash4 state, functions, events, and settings.
---

# Reference

The nexBash4 public global separates inspectable state from callable behavior:

```text
nexBash
|-- state     read-only, frozen, serializable snapshot
|-- api       callable domain namespaces (control, config, observe, strategy)
`-- options   persisted player option flags
```

- [State reference](./state.md): the frozen `nexBash.state` snapshot and its branches.
- [API reference](./api.md): the callable namespaces under `nexBash.api`, plus the
  top-level accessors and helpers on the global.
- [Options & settings](./options.md): the option flags, battlerage reserves, and
  the persisted settings document shape.
- [Events](./events.md): the EventStream topics nexBash emits, and the host topics
  it reacts to.

## Contract boundaries

Everything under `state` is **data** — a fresh, deeply frozen copy built on each
read, safe to inspect, stringify, or attach to a bug report. Everything under
`api` is **callable behavior**. The Nexus `eventStream` global is the canonical
listener boundary for other packages.

Two things are explicitly **not** part of the public contract:

- `nexBash.runtime` — the internal mutable owner layer that `state` projects. Read
  `state`; do not read or write `runtime`.
- `nexBash.machines` / `nexBash.actors` and the `debug` / `attachDebug` helpers —
  diagnostics, not a stable surface.
