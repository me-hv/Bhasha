# BHASHA — KEYBOARD SHORTCUT MAP
## Cross-Platform Ergonomics Guide (macOS & Windows / Linux)

---

## 1. Primary Writing Studio Shortcuts

| macOS Shortcut | Windows / Linux | Action | Scope / Context | Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `⌘ + Enter` | `Ctrl + Enter` | **New Bar** | Lyric Canvas | Inserts clean newline at cursor |
| `⌘ + B` | `Ctrl + B` | **Toggle Rhyme Rack** | Studio Global | Opens/closes Rhyme Rack for active word |
| `⌘ + Shift + R` | `Ctrl + Shift + R` | **Toggle Rhyme Mode** | Studio Global | Toggles Rhyme Scheme gutter & internal rhyme badges |
| `⌘ + Shift + F` | `Ctrl + Shift + F` | **Toggle Flow Mode** | Studio Global | Toggles Syllable Cadence and density inspection |
| `⌘ + K` or `⌘ + P` | `Ctrl + K` or `Ctrl + P` | **Command Palette** | Studio Global | Unified search across songs, lexicon, ideas & actions |
| `⌘ + Shift + S` | `Ctrl + Shift + S` | **Song Structure Drawer** | Studio Global | Opens/closes section reordering & arrangement drawer |
| `⌘ + Shift + N` | `Ctrl + Shift + N` | **Creative Notes Drawer** | Studio Global | Opens/closes song directives & section notes |
| `⌘ + Shift + V` | `Ctrl + Shift + V` | **Version Snapshots Drawer** | Studio Global | Opens/closes version history & songwriter lyric diff |
| `⌘ + Shift + I` | `Ctrl + Shift + I` | **"+ I'M STUCK" Catalyst** | Studio Global | Opens structured creative idea & sensory sparks modal |
| `⌘ + S` | `Ctrl + S` | **Manual Save Checkpoint** | Studio Global | Triggers immediate local persistence checkpoint |
| `Escape` | `Escape` | **Close Active Overlay** | All Overlays | Dismisses active modal/drawer & returns focus to cursor |
| `Tab` | `Tab` | **Predictable Navigation** | Drawers & Modals | Moves focus predictably between interactive elements |
| `Arrow Keys` | `Arrow Keys` | **Canvas Navigation** | Lyric Canvas | Moves cursor without jumping or resetting selection |

---

## 2. Global Navigation Shortcuts

| macOS Shortcut | Windows / Linux | Destination |
| :--- | :--- | :--- |
| `⌘ + 1` | `Ctrl + 1` | Go to Writing Studio (`/write`) |
| `⌘ + 2` | `Ctrl + 2` | Go to Song Library (`/library/songs`) |
| `⌘ + 3` | `Ctrl + 3` | Go to Vocabulary Bank (`/library/lexicon`) |
| `⌘ + 4` | `Ctrl + 4` | Go to Creative Ideas (`/library/ideas`) |
| `⌘ + N` | `Ctrl + N` | Create New Song (`+ New Song`) |

---

## 3. Keyboard-First Design Principles

1. **Zero Mouse Dependency**: A songwriter can write an entire multi-section song, look up rhymes, inspect syllable counts, and create version snapshots without touching the mouse or trackpad.
2. **Predictable Focus Hand-off**: Closing any drawer or modal via `Escape` or shortcut immediately restores DOM focus to the lyric textarea at the exact cursor character position.
3. **Cross-Platform Parity**: Every shortcut works identically on Windows/Linux (`Ctrl`) and macOS (`Cmd`/`⌘`) without hardcoded Mac-only key checks.
