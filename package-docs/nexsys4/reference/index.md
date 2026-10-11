---
title: Reference
description: Exact names and shapes of nexSys4's state, functions, and events, for scripters and package authors.
---

# Reference

These pages list every public name in nexSys, for scripters and package
authors. You don't need them to play with nexSys. For task-by-task help, see
the [Guides](../guides/index.md).

Everything public hangs off the global `nexSys` object:

```text
nexSys
|-- state     read-only snapshots of your character and of nexSys
|-- api       functions, grouped by area: affs, defs, queue, rules, ...
`-- events    nexSys's own event bus: on, off, topics
```

| Page | Covers |
| --- | --- |
| [State](./state.md) | Everything under `nexSys.state` |
| [API](./api.md) | Every function under `nexSys.api`, and `nexSys.events` |
| [Events](./events.md) | The events published to Nexus `eventStream` |
| [All event topics](./generated/nexsys4-event-dictionary.md) | Every topic, including the JavaScript-only ones |
| [EventStream topics](./generated/nexsys4-eventstream-reference.md) | The EventStream topics, with stability markers |

## Ground rules

- **Read from `state`, act through `api`.** `state` holds only data, and
  every branch is a fresh, frozen snapshot each time you read it. To change
  anything, call a function under `api`.
- **Listen through `eventStream`.** Other packages listen with the Nexus
  `eventStream` global. `nexSys.events.on()` covers the same events, plus a
  few JavaScript-only ones.
- **Wait until nexSys is running.** `nexSys.state` and `nexSys.api` exist
  once nexSys has started. Run setup code from a `SystemLoaded` function or a
  `nexsys4.system.loaded` listener. See
  [Customizing nexSys](../guides/customizing.md#run-your-setup-when-nexsys-is-ready).
- **Internals aren't part of the contract.** `nexSys.runtime`,
  `nexSys.adapter`, `nexSys.tables`, and `nexSys.seedMeta` exist for
  debugging and may change without notice. `nexSys.version` shows the running
  version, which helps in bug reports.
