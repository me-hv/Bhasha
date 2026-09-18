# BHASHA — Phase 9: Writer Workflow & UX Audit

> **Objective:** Comprehensive audit of Phase 7 UI integration with Phase 8 deterministic phonetic & verse analysis engines. Trace the complete writing loop: `Song → Section → Bar → Text → Linguistic Analysis → Rhyme Detection → Syllable Analysis → Flow → Persistence → Export`.

---

## 1. End-to-End Writing Workflow Architecture

```text
+-----------------------------------------------------------------------------------+
|                                 BHASHA STUDIO                                      |
|                                                                                   |
|  [Song / Section] --> [Lyric Canvas (Textarea)] --> [Debounced Autosave (400ms)]  |
|                                |                                                  |
|                                v                                                  |
|                 [Deterministic Verse Analyzer]                                    |
|                 (parseSongContent / phonetics)                                    |
|                                |                                                  |
|       +------------------------+------------------------+                         |
|       |                        |                        |                         |
|       v                        v                        v                         |
| [End-Rhymes & Radif]    [Internal Assonances]     [Syllables & Cadence]           |
| (A/B/C/— Scheme)        (High-Confidence Pairs)   (● / — Phonetic Pattern)        |
|       |                        |                        |                         |
|       +------------------------+------------------------+                         |
|                                |                                                  |
|                                v                                                  |
|                   [Contextual Writing Modes]                                      |
|                                                                                   |
|     WRITE MODE              RHYME MODE               FLOW MODE                    |
|   (Minimal/Clean)      (Scheme & Rack Focus)    (Meter & Density Focus)           |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |  Rhyme Target (Pinned)  <--->  Rhyme Rack Drawer (⌘B)  <--->  I'M STUCK (⌘⇧I) |  |
|  +-----------------------------------------------------------------------------+  |
|                                |                                                  |
|                                v                                                  |
|                     [Persistence & Export]                                        |
|                     (LocalStorage / Clean Markdown)                               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Detailed Component & Lifecycle Audit

### A. Writing Studio Entry Point & Song Creation
- **Route:** `/write` and `/write/[id]`
- **Creation Flow:** User enters `/write` without an ID → instantly loads existing active song or creates a fresh draft (`UNTITLED TRACK`, 92 BPM, key `Am`).
- **Friction Assessment:** Low. Zero configuration required before typing. The writer can begin immediately without filling forms for BPM, genre, or key.

### B. Bar Creation & Line Editing
- **Input Component:** `SongEditor.tsx` using a seamless multi-line Devanagari/Roman canvas.
- **Section Headers:** Lines matching `[Verse 1]`, `[Hook]`, `[Bridge]`, etc. are parsed as section dividers without counting as lyric bars.
- **Debounced Analysis:** The `parseSongContent` verse analyzer computes line metrics and rhyme groups in sub-5ms latency for standard songs (16–32 bars).

### C. Phase 8 Engine Integration in Phase 7 UI
- **Phonetics & Syllabification:** `SongEditor` calls `parseSongContent` which invokes Phase 8's calibrated `devanagariToSyllables` and `devanagariToIPA`.
- **Rhyme Engine:** Bottom bar chips and `RhymeDrawer` utilize Phase 8's `getRhymes` with calibrated acoustic thresholds (`cSim = 0.45` voiceless plosives, `rawScore = 0.65` short/long vowels).
- **Rhyme Groups & Refrains:** Whole-stanza Ghazal Radifs vs couplet refrains are resolved deterministically without false merges.
- **Unrhymed Lines:** Lines with no phonetic rhyme partners correctly receive `rhymeGroup: null` / `isUnrhymed: true`.

### D. Rhyme Rack & Word Context Detection
- **Trigger:** Bottom status bar, clicking quick chips, or shortcut `⌘B` / `Ctrl+B`.
- **Detection Precedence:**
  1. *Explicit selection:* User highlights text in canvas (`selectionStart !== selectionEnd`).
  2. *Pinned rhyme target:* If a target is pinned and no text is highlighted.
  3. *Active cursor word:* Extracted word at caret.
  4. *Line ending word:* Substantive word ending the active line.
  5. *Manual search input:* Explicit user query typed in Rhyme Rack search.
- **Categorization:** Results displayed in distinct acoustic tiers: `PERFECT`, `MULTISYLLABIC`, `STRONG`, `NEAR`, `CONSONANCE`.

### E. Creative Catalyst ("+ I'M STUCK")
- **Trigger:** Button in header/footer or shortcut `⌘Shift+I` / `Ctrl+Shift+I`.
- **Seed Dimensions:** Structured into 6 tangible directions: `CONCEPT`, `IMAGE`, `CONTRAST`, `EMOTION`, `ANCHOR KEYWORDS`, `SAMPLE METER`.
- **Lexical Graph:** For active anchor words, dynamically shows 4 sensory quadrants: *Visual*, *Emotion*, *Sound*, *Place*.
- **AI-Free Principle:** All suggestions are grounded deterministically in the Hindustani lexical graph without LLM hallucinations.

### F. Writing Modes (WRITE, RHYME, FLOW)
- **WRITE Mode:** Pure focus. Canvas is distraction-free with minimal gutter clutter (bar numbers only).
- **RHYME Mode:** Highlights rhyme groups (`A`, `B`, `C`), unrhymed indicators (`—`), and activates the Rhyme Rack drawer.
- **FLOW Mode:** Gutter displays syllable counts against target (`9 / 10`), cadence density, and phonetic rhythm (`●` short / `—` long).

### G. Song Structure & Arrangement
- **Trigger:** Drawer toggle or shortcut `⌘Shift+S` / `Ctrl+Shift+S`.
- **Arrangement:** Visual breakdown of sections (`Intro`, `Verse 1`, `Hook`, `Verse 2`, `Outro`) with bar counts.
- **Navigation:** 1-click jump scrolls directly to any section line in the editor.

### H. Writing Analytics & Stats
- **Trigger:** Stats button in header.
- **Metrics:** Total Bars, Word Count, Total Syllables, Avg Syllables/Bar, Rhyme Groups, Unique Rhymes, Internal Rhymes, and Rhyme Density meter (`%`).

### I. Persistence & Autosave Lifecycle
- **Storage:** LocalStorage with 400ms debounce.
- **Indicators:** Quiet "Saved" status badge in header with green indicator.
- **Data Safety:** Automatic recovery upon page refresh, browser restart, or song switching.

### J. Export Workflow
- **Formats:** Clean Markdown (`.md`) download and 1-click clipboard copy.
- **Structure:** Preserves title, metadata header (BPM, Key, Time Signature), section tags, and formatted bar numbers (`01.`, `02.`). Excludes internal debug phoneme arrays or raw scores.

---

## 3. Friction Points & UX Optimization Plan for Phase 9

| Area | Observed Friction / Sub-optimal UX | Phase 9 Optimization Plan |
|---|---|---|
| **Rhyme Rack Density** | High-density words (e.g. `रात`, `दिल`) return 50+ candidates, overwhelming the drawer view. | Add initial curated display (top 12-16 items) with clean "Show More (+N)" expansion toggles per tier. |
| **Context Priority** | When a rhyme target was pinned, explicit cursor selections did not override it in quick search. | Refine context priority so explicit text highlight ALWAYS takes precedence over pinned target. |
| **Rhyme Explanations** | Raw scores like `Score: 0.88–0.94` are too technical for lyricists. | Replace raw score labels with clear linguistic badges (e.g. "Exact Vowel & Coda", "Shared Multisyllabic Cadence", "Near Slant"). |
| **Unrhymed Gutter UI** | In Rhyme Mode, unrhymed lines displayed blank space, leaving writers uncertain if analysis ran. | In Rhyme Mode, render a subtle neutral dash (`—`) on unrhymed bars to clearly confirm analysis. |
| **Flow Terminology** | Flow density could be misinterpreted as judging rapper performance. | Use clear, neutral terms: "Phonetic Flow" and "Syllable Meter". Avoid judgmental alerts. |
| **I'm Stuck Structure** | Writers sometimes need just 1 spark word rather than a full card. | Provide instant "A Word", "A Rhyme", "An Image", "A Contrast" quick spark buttons. |
| **Keyboard Conflicts** | `Ctrl+B` or `Ctrl+S` in some browsers could trigger unwanted browser dialogs. | Ensure strict `e.preventDefault()` across all studio shortcuts and handle Mac/Win modifier nuances. |
| **Incremental Editing** | Full verse re-parse on every keystroke. | Optimize memoization and ensure fast sub-millisecond incremental updates for single-line edits. |

---

## 4. Phase 9 Validation Scope
- **20 Real-World Writing Scenarios** (from single-word rhyme search to complex Hinglish code-switching and unrhymed bars).
- **UX Friction Benchmarks** (measuring interaction count targets for common songwriting tasks).
- **Test Suites:** New test coverage in `src/tests/workflow/` and `src/tests/ux/`.
