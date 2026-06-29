---
title: Reference
description: Stable public contracts for nexSys4 state, functions, and events.
---

# Reference

The nexSys4 public global separates state from callable behavior:

```text
nexSys
|-- state
`-- api
```

- [State reference](./state.md): frozen runtime snapshots and branch meanings
- [API reference](./api.md): callable domain namespaces
- [Events](./events.md): events exposed to external packages through Nexus EventStream

Everything below `state` is data. Everything below `api` is callable behavior
or an API handle. The Nexus `eventStream` global is the canonical listener
boundary for external packages. Debug-grade objects returned during
construction are not part of this public contract.
