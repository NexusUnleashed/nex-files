---
title: Installation
description: Install and start nexGui4 in the Nexus web client.
---

# Installation

nexGui4 runs in Achaea's Nexus web client and expects the Nexus runtime,
`eventStream`, and `GMCP` to be available. Because it renders the game display
itself, it should be the only package driving the Nexus output area.

## Install the Nexus package

The release includes `nexGui4.nxs`, a Nexus package file. Import it through the
Nexus package/reflex interface, then reload the client if its package groups do
not appear immediately.

The npm package also contains the prebuilt runtime at
`dist/nexgui4.min.js`. This IIFE bundle externalizes React and the Nexus host
globals (`React`, `ReactDOM`, `nexAction`, `eventStream`, `nexSight`) and is
intended for scripted installation and integration work:

```js
import("https://unpkg.com/nexgui4/dist/nexgui4.min.js").then(() => {
  nexusclient
    .packages()
    .get("nexGui4")
    .items.filter((item) => item.type === "group")
    .forEach((group) => {
      group.enabled = true;
    });

  nexGui.bootstrapNexus();
});
```

Importing the bundle attaches the bootstrap functions to the global `nexGui`
namespace (`bootstrapNexus`, `bootstrapPlayground`, `createNexGui`). It does not
start the live runtime until `bootstrapNexus()` is called.

`bootstrapNexus()` wires the live Nexus adapter, injects host styles, generates
the panel tabs, warms the player directory, and then **replaces** the global
`nexGui` with the live runtime instance.

## Verify the runtime

After startup, evaluate this in the Nexus developer console:

```js
Object.keys(nexGui);
// ["version", "mount", "stores", "debug", "destroy", "state", "api"]
```

Confirm the runtime reached its `RUNNING` phase:

```js
nexGui.state.system;
// { version: "…", mounted: true, phase: "RUNNING" }
```

Continue with the [Quickstart](./quickstart.md).
