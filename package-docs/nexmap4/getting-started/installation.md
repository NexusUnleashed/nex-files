---
title: Installation
description: Install and start nexMap4 in the Nexus web client.
---

# Installation

nexMap4 runs in Achaea's Nexus web client and expects the Nexus runtime,
EventStream, GMCP, and `nexusclient` to be available. React and ReactDOM are
assumed to be loaded already by the host.

## Install the Nexus package

The release includes `nexMap4.nxs`, a Nexus package file. Import it through the
Nexus package/reflex interface, then reload the client if its package groups do
not appear immediately. nexMap4 adds a dockable **map tab** to the client layout.

The npm package also contains the prebuilt runtime at `dist/nexmap4.min.js`.
This form is intended for scripted installation and integration work:

```js
import("https://unpkg.com/nexmap4/dist/nexmap4.min.js").then(() => {
  nexusclient
    .packages()
    .get("nexMap4")
    .items.filter((item) => item.type === "group")
    .forEach((group) => {
      group.enabled = true;
    });

  nexMap.start();
});
```

## Startup

In the production bundle, nexMap4 bootstraps and starts automatically when the
host capabilities (`GMCP`, `eventStream`, `nexAction`, `nexusclient`) are
present. The bundle registers the singleton as `globalThis.nexMap`.

Startup proceeds through a fixed set of phases:

```text
BOOTING → FETCHING_CROWDMAP → FETCHING_REMOTE → BUILDING_GRAPH → HYDRATING_STATE → READY | DEGRADED
```

`READY` means the graph is built and the map is live. `DEGRADED` means startup
finished with a recoverable problem (for example, the remote crowdmap fetch
failed) — nexMap4 still runs with whatever data it could load.

If you bootstrap manually, start the runtime explicitly:

```js
nexMap.start();
```

## Verify the runtime

After startup, evaluate this in the Nexus developer console:

```js
Object.keys(nexMap);
// includes: "state", "api", "settings", "start", "getStartupState", …

nexMap.getStartupState();
// inspect the current startup phase
```

Then open the settings dialog:

```js
nexMap.api.system.openSettings();
```

Continue with the [Quickstart](./quickstart.md).
