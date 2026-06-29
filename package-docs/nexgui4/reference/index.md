---
title: Reference
description: Stable public contracts for nexGui4 state, functions, and events.
---

# Reference

The live runtime is installed as the global `nexGui`. Its public data and
behavior contract has two roots:

```text
nexGui
|-- state     deeply frozen, JSON-serializable snapshots (data only)
`-- api       callable namespaces grouped by domain (behavior only)
```

- [State reference](./state.md): the frozen snapshot branches and their meaning
- [API reference](./api.md): the callable domain namespaces
- [Event reference](./events.md): how to coordinate with nexGui4 over the host
  `eventStream`

`nexGui.state` is data — every leaf is a value, never a function, and
`JSON.stringify(nexGui.state)` produces a complete public runtime dump.
`nexGui.api` is behavior — queries, predicates, and mutations.

## Other runtime roots

The global also carries a small set of non-contract members:

| Path | Type | Notes |
| --- | --- | --- |
| `nexGui.version` | string | Runtime version. |
| `nexGui.mount(container)` | function | Mounts the React shell into a DOM element. |
| `nexGui.destroy()` | function | Tears down bindings, stores, timers, and adapter resources. |
| `nexGui.stores` | object | Internal store bridge retained for host shell integration; not a stable public contract. |
| `nexGui.debug` | object | Diagnostics only. |

There is no `nexGui.events` root. Event coordination uses the host
`eventStream` — see the [event reference](./events.md).
