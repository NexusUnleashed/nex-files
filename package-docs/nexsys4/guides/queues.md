---
title: Queues
description: Add, inspect, clear, and flush nexSys4 command queues.
---

# Queues

nexSys4 maintains a local model of each command queue and coordinates it with
Achaea's server queues.

## List and inspect queues

```js
nexSys.api.queue.list();
nexSys.api.queue.inspect("free");
nexSys.state.queue;
```

Default queue handles include `class`, `free`, `full`, `shield`, `ship`,
`bloodcloak`, `battlerage`, and `stun`. A handle is available by display name
and by its internal id:

```js
nexSys.api.queue.free.add("touch tree");
nexSys.api.queue.freeQueue.prepend("stand");
```

## Clear behavior

`clear()` clears the local mirror. `clearQueue()` clears the local mirror and
sends a server-side `clearqueue` command. Use the latter when the server's
queue must also be discarded.

## Queue event stages

Queue events distinguish three moments:

1. `nexsys4.queue.flushed`: nexSys4 built and dispatched the command plan.
2. `nexsys4.queue.sent`: Achaea acknowledged accepting the queue entries.
3. `nexsys4.queue.fired`: A named queue was observed firing.

This distinction matters when an integration needs confirmation rather than
mere local intent. See the [event reference](../reference/events.md).

