---
title: Installation
description: Install and start nexSys4 in the Nexus web client.
---

# Installation

nexSys4 runs in Achaea's Nexus web client and expects the Nexus runtime,
EventStream, and GMCP to be available.

## Install the Nexus package

The release includes `nexSys4.nxs`, a Nexus package file. Import it through the
Nexus package/reflex interface, then reload the client if its package groups do
not appear immediately.

The npm package also contains the prebuilt runtime at
`dist/nexsys4.min.js`. This form is intended for scripted installation and
integration work:

```js
import("https://unpkg.com/nexsys4/dist/nexsys4.min.js").then(() => {
  nexusclient
    .packages()
    .get("nexSys4")
    .items.filter((item) => item.type === "group")
    .forEach((group) => {
      group.enabled = true;
    });

  nexSys.bootstrapNexus();
});
```

Importing the JavaScript bundle exposes the bootstrap function; it does not
start the live runtime until `bootstrapNexus()` is called.

## Verify the runtime

After startup, evaluate this in the Nexus developer console:

```js
Object.keys(nexSys);
// ["state", "api", "events"]
```

Then open the configuration dialog:

```js
nexSys.api.ui.openConfig();
```

Continue with the [Quickstart](./quickstart.md).

