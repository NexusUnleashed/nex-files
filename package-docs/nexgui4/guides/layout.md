---
title: Layout & presets
description: Save, restore, and apply panel layouts, and use the native display override.
---

# Layout & presets

nexGui4 panels are Nexus FlexLayout tabs, so you arrange them by dragging,
docking, floating, and resizing. nexGui4 adds a stored-layout slot and a set of
built-in presets on top of that.

## Saving and restoring

Persist your current arrangement to the saved-layout slot, then re-apply it
later:

```js
nexGui.api.layout.save(); // snapshot the current layout
nexGui.api.layout.restore(); // re-apply the saved layout
nexGui.api.layout.hasSaved(); // whether a saved layout exists
```

`save()` and `restore()` return `true` on success. `restore()` returns `false`
when no layout has been saved yet.

## Built-in presets

List and apply the built-in layout templates:

```js
nexGui.api.layout.list(); // => array of preset ids
nexGui.api.layout.apply("<id>"); // returns true when the id exists
```

`apply()` returns `false` for an unknown id. See
[`nexGui.api.layout`](../reference/api.md#nexguiapilayout) for the full
contract.

## Native display {#native-display}

By default the main game display is its own surface. The **Native Display
Override** (on the [Advanced options tab](./options.md#advanced)) instead mounts
the nexGui display directly into the Nexus output area.

The toggle applies immediately. When enabled, the standalone display tab is
hidden on the next reload; when disabled, the host's default output behavior is
restored. The same operation is available programmatically:

```js
nexGui.api.customize.nativeDisplay.mount();
nexGui.api.customize.nativeDisplay.unmount();
```
