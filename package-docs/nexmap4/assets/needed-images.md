# nexMap4 Documentation Image Checklist

This file lists the screenshots that need to be manually captured from the **nexMap4** interface running in the **Nexus client** and saved to this directory (`docs/docusaurus-content/assets/`). 

Adding these images will complete the visual placeholders in the user documentation.

---

## Quick Reference Table

| Target Filename | Target Page / Reference Path | Description / UI View to Capture |
| :--- | :--- | :--- |
| **`nexMap-tab.png`** | [interface.md](../guides/interface.md) | The full, docked nexMap4 map tab showing header, map, and exits. |
| **`nexMap-config-pathing-travel-settings.png`** | [pathing-travel.md](../guides/configuration/pathing-travel.md) | The **Settings** sub-tab under **Pathing & Travel** of the settings dialog. |
| **`nexMap-config-pathing-travel-commands.png`** | [pathing-travel.md](../guides/configuration/pathing-travel.md) | The **Commands** sub-tab under **Pathing & Travel** of the settings dialog. |
| **`nexMap-config-pathing-travel-options.png`** | [pathing-travel.md](../guides/configuration/pathing-travel.md) | The **Travel Options** sub-tab under **Pathing & Travel** of the settings dialog. |
| **`nexMap-config-display.png`** | [display.md](../guides/configuration/display.md) | The **Display** tab of the settings dialog. |
| **`nexMap-config-city-lockouts.png`** | [city-lockouts.md](../guides/configuration/city-lockouts.md) | The **City Lockouts** tab of the settings dialog. |
| **`nexMap-shell-landmarks.png`** | [landmarks.md](../guides/landmarks.md) | The **Landmarks** explorer panel/view. |
| **`nexMap-shell-npcs.png`** | [npc-lookups.md](../guides/npc-lookups.md) | The **NPC Explorer** panel/view. |

---

## Detailed Image Requirements

### 1. `nexMap-tab.png`
* **Reference Path:** `docs/docusaurus-content/guides/interface.md`
* **UI Area to Capture:** The primary dockable **map tab** added to the Nexus client.
* **What to Show:**
  * **Room Header:** At the top showing current location: `Area Name: Room Name (roomId)`.
  * **Map Area:** The graphical map displaying rooms, paths, and your current room.
  * **Exits Footer:** The row of clickable movement buttons at the bottom.
* **Cropping Tip:** Crop tightly to the edges of the nexMap tab inside the Nexus client layout, or keep enough context to show how it docks.

### 2. Pathing & Travel Sub-tabs
* **Reference Path:** `docs/docusaurus-content/guides/configuration/pathing-travel.md`
* **UI Area to Capture:** The three sub-tabs under the Pathing & Travel configuration tab.
* **What to Show:**
  * **`nexMap-config-pathing-travel-settings.png`**: The **Settings** sub-tab with **Pathing Mode** (e.g. Hybrid Track vs. Client Step), **Command Separator**, and **Celerity** settings.
  * **`nexMap-config-pathing-travel-commands.png`**: The **Commands** sub-tab with wing command inputs.
  * **`nexMap-config-pathing-travel-options.png`**: The **Travel Options** sub-tab with toggles for different travel classes.

### 3. `nexMap-config-display.png`
* **Reference Path:** `docs/docusaurus-content/guides/configuration/display.md`
* **UI Area to Capture:** The settings overlay/dialog, specifically the second tab.
* **What to Show:**
  * The selected **Display** tab.
  * Options for **Map Appearance** (Room shape, border color picker, labels, font size, default zoom) and **Background** settings.

### 4. `nexMap-config-city-lockouts.png`
* **Reference Path:** `docs/docusaurus-content/guides/configuration/city-lockouts.md`
* **UI Area to Capture:** The settings overlay/dialog, specifically the city gate exclusions tab.
* **What to Show:**
  * The selected **City Lockouts** tab.
  * Checkboxes/toggles for cities (Ashtan, Cyrene, Eleusis, Hashan, Mhaldor, Targossas).

### 5. `nexMap-shell-landmarks.png`
* **Reference Path:** `docs/docusaurus-content/guides/landmarks.md`
* **UI Area to Capture:** The Landmarks manager panel/overlay.
* **What to Show:**
  * A list of saved landmarks.
  * Controls to search, select, navigate to, or delete landmarks.

### 6. `nexMap-shell-npcs.png`
* **Reference Path:** `docs/docusaurus-content/guides/npc-lookups.md`
* **UI Area to Capture:** The NPC lookup/explorer panel.
* **What to Show:**
  * Search input query (e.g. searching for a denizen).
  * Resolved denizen records, showing name, area, and known room locations with travel/routing buttons.

---

## Integration Checklist

1. [ ] Log into the Achaea Nexus client with nexMap4 installed.
2. [ ] Capture screenshots of the six states listed above.
3. [ ] Crop the screenshots to remove unnecessary Nexus client headers/chat/input frames, keeping the focus on the nexMap4 components.
4. [ ] Save the images as **PNG** files with the exact names listed above.
5. [ ] Move/copy the files into `docs/docusaurus-content/assets/`.
6. [ ] Verify that the images load correctly by checking the respective markdown pages.
