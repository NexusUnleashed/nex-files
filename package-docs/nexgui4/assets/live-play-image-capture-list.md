# Live Play Image Capture List

Use this checklist when capturing screenshots from a live nexGui4 play session
for the published Docusaurus content. Store final images in this `assets/`
folder, keep filenames lowercase with hyphens, and prefer PNG for UI captures.

Capture at least one clean desktop-width image for every "Need" item. Capture
"Should" items when the live state is available or easy to stage; they make the
guides more convincing but are not required for the first docs pass.

## Capture Guidelines

- Hide browser chrome when possible and avoid showing private tells, passwords,
  tokens, real IPs, or account details.
- Use a character and room state that can be shared publicly.
- Prefer real live data over playground placeholders, especially for GMCP-driven
  panels like Players, NPCs, Items, Stats, Party, and Target.
- Keep the Nexus tab title, panel labels, and nexGui4 controls visible when they
  explain the feature.
- Crop tightly for individual panels, but keep enough surrounding UI to show
  that the capture came from live Nexus.
- Use the same visual theme for the full required set unless the screenshot is
  specifically documenting style options.

## Needed For The First Docs Pass

| Filename                           | Priority | Capture                                                                                            | Use In                                              | Setup Notes                                                                                                                                      |
| ---------------------------------- | -------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `overview-live-layout.png`         | Need     | Full Nexus client with nexGui4 running, main display visible, and several docked panels around it. | `introduction.md`, `quickstart.md`                  | Use a normal play layout with the live transcript, Stats, Players, NPCs or Items, Timers, and side stream tabs visible.                          |
| `quickstart-panel-tabs.png`        | Need     | Nexus FlexLayout tab strip showing nexGui4 panels registered as tabs.                              | `getting-started/quickstart.md`, `guides/panels.md` | Include tab labels such as Timers, Party, Players, NPCs, Items, Stats, System, Combat, Defences, Feed, Target, Options, and Metrics if possible. |
| `main-display-live-transcript.png` | Need     | Main game display hard-pinned to the newest output with the prompt footer visible.                 | `guides/main-display.md`                            | Capture normal room/combat output with wrapped lines and the prompt at the bottom.                                                               |
| `scrollback-modal-search.png`      | Need     | Scrollback modal open over the live display, with history and search UI visible.                   | `guides/main-display.md`                            | Open by scrolling up over the main display; search for a harmless term that has multiple matches.                                                |
| `options-game-tab.png`             | Need     | Options panel on the Game tab.                                                                     | `guides/options.md`                                 | Show Nexus Config and nexGui Config toggles.                                                                                                     |
| `options-panels-tab.png`           | Need     | Options panel on the Panels tab.                                                                   | `guides/options.md`                                 | Show panel font size, background opacity, hue shift, and background image controls.                                                              |
| `options-display-tab.png`          | Need     | Options panel on the Display tab.                                                                  | `guides/options.md`                                 | Show font family, display font size, ally/enemy formatting, and target formatting.                                                               |
| `options-advanced-tab.png`         | Need     | Options panel on the Advanced tab.                                                                 | `guides/options.md`                                 | Show login tracker, log settings, Native Display Override, Event Bus Debug Mode, and Netflix Mode controls.                                      |
| `timers-panel-active.png`          | Need     | Timers panel with at least two active timer bars.                                                  | `guides/panels.md`, `guides/features.md`            | Include one countdown and one count-up or ready-style timer if possible.                                                                         |
| `party-panel-members.png`          | Need     | Party panel with multiple members and a selected leader.                                           | `guides/panels.md`                                  | Include enough members to show rows, leader selection, and party automation controls.                                                            |
| `players-panel-room.png`           | Need     | Players panel listing room occupants with name coloring.                                           | `guides/panels.md`, `guides/features.md`            | Stage allies, enemies, or city-colored players if available.                                                                                     |
| `players-popover-actions.png`      | Need     | Player popover opened from the Players panel.                                                      | `guides/panels.md`, `guides/features.md`            | Hover/click a safe player entry so targeting and lookup actions are visible.                                                                     |
| `npcs-panel-grouped-target.png`    | Need     | NPCs panel with grouped denizens and a highlighted current target.                                 | `guides/panels.md`                                  | Target an NPC before capture so the selected row state is visible.                                                                               |
| `items-panel-context-menu.png`     | Need     | Items panel with a ground item context menu open.                                                  | `guides/panels.md`                                  | Right-click or open an item menu showing get/probe commands.                                                                                     |
| `stats-panel-body-vitals.png`      | Need     | Stats panel showing the body diagram and vitals bars.                                              | `guides/panels.md`                                  | Capture with real health, mana, endurance, willpower, and any limb state that is safe to show.                                                   |
| `target-panel-body.png`            | Need     | Target panel showing the target body diagram.                                                      | `guides/panels.md`                                  | Capture while a target is selected; if live target data is limited, still show the panel state clearly.                                          |
| `defences-panel-missing.png`       | Need     | Defences panel showing configured missing defences.                                                | `guides/panels.md`                                  | Temporarily drop harmless defences or use a state where several configured defences are absent.                                                  |
| `system-stream-events.png`         | Need     | System stream with defence or affliction add/remove rows.                                          | `guides/streams.md`, `guides/panels.md`             | Trigger safe `Char.Defences.*` or `Char.Afflictions.*` events during normal play.                                                                |
| `combat-stream-replacements.png`   | Need     | Combat stream with target info and structured skill replacement rows.                              | `guides/streams.md`, `guides/features.md`           | Capture a short combat exchange where replacement rows are readable.                                                                             |
| `feed-panel-live.png`              | Need     | Feed panel showing the Achaea public game feed.                                                    | `guides/panels.md`, `guides/features.md`            | Let the feed populate before capturing.                                                                                                          |
| `metrics-panel-runtime.png`        | Need     | Metrics panel showing runtime or diagnostic metrics.                                               | `guides/panels.md`                                  | Include the active metrics tab and populated values.                                                                                             |

## Strongly Recommended Captures

| Filename                                | Priority | Capture                                                                        | Use In                                        | Setup Notes                                                                                   |
| --------------------------------------- | -------- | ------------------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `inline-name-coloring-output.png`       | Should   | Main display line with ally, enemy, city enemy, and target formatting visible. | `guides/features.md`, `guides/options.md`     | Best captured after confirming player directory data has warmed.                              |
| `quick-who-formatting.png`              | Should   | Formatted Quick-Who output grouped by city.                                    | `guides/features.md`                          | Use `nexGui.api.players.qwFormat(...)` or a real `qwc` capture with public-safe names.        |
| `damage-numbers-overlay.png`            | Should   | Damage number overlay appearing on combat output.                              | `guides/options.md`, `guides/features.md`     | Enable Damage Numbers and capture during a safe combat exchange.                              |
| `message-replacement-row.png`           | Should   | Structured message replacement row in the main display or Combat stream.       | `guides/features.md`, `guides/streams.md`     | Capture a skill action that uses the replacement renderer.                                    |
| `login-tracker-notices.png`             | Should   | Login and logout tracker notices in output or side stream.                     | `guides/features.md`, `guides/options.md`     | Enable Login Tracker and capture harmless roster changes.                                     |
| `background-image-panels.png`           | Should   | Panels using a configured built-in or custom background image.                 | `guides/options.md`                           | Pair with the Panels options capture if possible.                                             |
| `display-font-comparison.png`           | Should   | Main display after changing font family or display font size.                  | `guides/options.md`, `guides/main-display.md` | Use a readable font setting and similar output lines before/after if easy.                    |
| `native-display-override.png`           | Should   | Main display mounted in the Nexus native output area.                          | `guides/layout.md`, `guides/main-display.md`  | Enable Native Display Override, reload if needed, and capture the resulting output placement. |
| `layout-saved-custom.png`               | Should   | A personalized docked layout after saving/restoring.                           | `guides/layout.md`                            | Show rearranged panels that differ clearly from the default.                                  |
| `layout-preset-applied.png`             | Should   | A built-in layout preset after applying it.                                    | `guides/layout.md`                            | Apply a preset from `nexGui.api.layout.apply("<id>")` and capture the full client.            |
| `scrollback-html-log-viewer.png`        | Should   | Downloaded virtualized HTML log opened locally.                                | `guides/main-display.md`, `guides/options.md` | Use a short public-safe log file and show search/virtualized rows if available.               |
| `options-dropdown-background-image.png` | Should   | Background Image select menu open on the Panels options tab.                   | `guides/options.md`                           | Shows the available built-in presets and Custom URL option.                                   |
| `options-dropdown-display-font.png`     | Should   | Font Family select menu open on the Display options tab.                       | `guides/options.md`                           | Shows bundled display font choices.                                                           |
| `options-tooltip-example.png`           | Should   | Tooltip or title help visible for a toggle.                                    | `guides/options.md`                           | Use any non-sensitive toggle, preferably Login Tracker or Native Display Override.            |
| `party-automation-controls.png`         | Should   | Party automation controls configured in the Party panel.                       | `guides/panels.md`, `guides/features.md`      | Capture with controls populated but no sensitive commands exposed.                            |
| `room-items-overrides.png`              | Should   | Items panel showing custom item labels or presentation overrides.              | `guides/panels.md`, `reference/api.md`        | Useful if documenting `nexGui.api.room.items` customization.                                  |
| `room-npc-overrides.png`                | Could    | NPCs panel showing custom NPC labels or presentation overrides.                | `guides/panels.md`, `reference/api.md`        | Useful if documenting `nexGui.api.room.npcs` customization.                                   |
| `room-npc-empty-state.png`              | Should   | NPCs panel empty or low-data state.                                            | `troubleshooting.md`                          | Helps explain GMCP room data issues if NPCs do not appear.                                    |
| `players-empty-or-loading.png`          | Should   | Players panel before directory data is warmed, or with sparse room data.       | `troubleshooting.md`                          | Useful for player-directory or GMCP troubleshooting.                                          |
| `runtime-console-state.png`             | Should   | Browser console showing `nexGui.state.system.phase` as `RUNNING`.              | `getting-started/installation.md`             | Crop carefully to avoid account details and unrelated console logs.                           |
| `api-console-layout-list.png`           | Should   | Browser console showing `nexGui.api.layout.list()` output.                     | `guides/layout.md`, `reference/api.md`        | Useful if generated reference wants a visual sanity check.                                    |

## Optional Nice-To-Have Captures

| Filename                                 | Priority | Capture                                                                  | Use In                                      | Setup Notes                                                                    |
| ---------------------------------------- | -------- | ------------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------ |
| `mobile-narrow-layout.png`               | Optional | Narrow viewport or small laptop layout with panels still usable.         | `introduction.md`, `quickstart.md`          | Only capture if Docusaurus content will discuss responsive use.                |
| `panel-tab-floating.png`                 | Optional | A nexGui4 tab floated or undocked.                                       | `guides/panels.md`, `guides/layout.md`      | Demonstrates Nexus FlexLayout behavior.                                        |
| `panel-resize-drag-state.png`            | Optional | Panel boundary being resized or recently resized.                        | `guides/layout.md`                          | Capture only if it looks clean; this is hard to time.                          |
| `error-boundary-panel.png`               | Optional | Panel error boundary state.                                              | `troubleshooting.md`                        | Only use a staged/dev-safe failure; do not capture real broken user state.     |
| `event-bus-debug-console.png`            | Optional | Console logs produced with Event Bus Debug Mode enabled.                 | `troubleshooting.md`, `reference/events.md` | Crop aggressively to show only event names and safe payloads.                  |
| `cdb-lookup-console.png`                 | Optional | Console result from `nexGui.api.cdb.get(...)`.                           | `guides/features.md`, `reference/api.md`    | Use a public character record and hide unrelated console context.              |
| `target-formatting-before-after.png`     | Optional | Before/after comparison of Target Formatting enabled and disabled.       | `guides/options.md`                         | Best as two captures if a side-by-side composite would be too busy.            |
| `ally-enemy-formatting-before-after.png` | Optional | Before/after comparison of Ally / Enemy Formatting enabled and disabled. | `guides/options.md`                         | Use the same output lines in both captures if possible.                        |
| `netflix-mode-config.png`                | Optional | Netflix Mode section configured with an emote color and catch toggles.   | `guides/options.md`, `guides/features.md`   | Avoid implying it is a core combat feature; this is a convenience alert layer. |

## Suggested Capture Order

1. Start with `overview-live-layout.png` while the session is fresh and clean.
2. Capture the four Options tabs before changing too many settings.
3. Populate or stage each panel, then capture the panel-specific "Need" items.
4. Trigger side-stream and formatting examples during normal play.
5. Open scrollback and capture `scrollback-modal-search.png` after enough output
   exists to make the modal meaningful.
6. Capture the "Should" console and layout images last, after sensitive logs have
   been cleared or cropped out.

## Coverage Check

The first docs pass is covered when the assets folder has images for:

- Overview and quickstart orientation.
- Main display and scrollback.
- Every Options tab.
- Every registered nexGui4 panel.
- System and Combat streams.
- At least one player-directory/name-coloring example.
- At least one layout or native-display example.
