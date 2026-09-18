# BHASHA — PHASE 10 ARCHITECTURAL & WORKSPACE AUDIT

**Date:** September 2026  
**Status:** Completed  
**Focus:** Songwriter Workspace, Song Library, Creative Memory & Portability

---

## 1. System Inventory & Current Architecture

### 1.1 Core Engine Stack (Phases 1–9)
- **Phonetic Engine:** Devanagari syllabification, Akshara parsing, schwa deletion, vowel nucleus & coda extraction, IPA mapping.
- **Rhyme Engine:** Inverted rhyme index, 3-tier scoring (Perfect, Strong, Near, Multisyllabic, Slant), cadence similarity.
- **Verse Analyzer:** End-rhyme clustering (A/B/C scheme), unrhymed line detection (`—`), substantive internal assonance matching, syllable meter & flow density calculation.
- **Writing Studio:** Real-time 3-mode editor (WRITE / RHYME / FLOW), contextual Rhyme Rack with explicit selection precedence, pinned rhyme targets, structured "+ I'M STUCK" creative catalyst.

---

## 2. Models & Data Structures Audit

### 2.1 Current Song Model (`Song`)
```typescript
export interface Song {
  id: string;
  title: string;
  content: string;
  bpm: number;
  key: string;
  timeSignature: string;
  status: 'Draft' | 'In Progress' | 'Finished' | 'Recorded';
  tags: string[];
  scratchpadNotes: string;
  stashedRhymes: string[];
  pinnedPromptId?: string;
  createdAt: string;
  updatedAt: string;
}
```
**Findings & Gaps:**
- `status`: Currently uses `'Draft' | 'In Progress' | 'Finished' | 'Recorded'`. Phase 10 specifies standardizing on writer-friendly statuses: `'DRAFT' | 'IN PROGRESS' | 'COMPLETE' | 'ARCHIVED'` while supporting case-insensitive backwards compatibility.
- `metadata`: Missing optional fields: `genre`, `mood`, `notes` (song-level creative notes), `sectionNotes` (dictionary mapping section id/title to section notes), `songVocabulary` (array of explicitly saved words collected for this specific song).
- `archiving`: No distinction currently between active and archived songs (archiving is currently just delete or status string).

### 2.2 Section & Bar Representation
- Currently, sections and bars are parsed dynamically on-the-fly from markdown-style tags (`[Verse 1]`, `[Hook]`, `## Verse 1`) using `parseSongContent` in `verse-analyzer.ts`.
- This approach is lightweight, robust, and avoids out-of-sync state between rich objects and raw lyric text.
- **Recommendation:** Keep raw markdown text as the single source of truth for lyric content while associating section notes by section header key/id.

### 2.3 Lexicon & Saved Word Model (`SavedWord`)
```typescript
export interface SavedWord {
  id: string;
  devanagari: string;
  urdu?: string;
  roman: string;
  meaning: string;
  pronunciation?: string;
  notes?: string;
  tags: string[];
  savedAt: string;
  sourceSongId?: string;
  perfectRhymes?: string[];
  strongRhymes?: string[];
  nearRhymes?: string[];
  relatedImagery?: string[];
  relatedGraph?: RelatedWordGraph;
}
```
**Findings & Gaps:**
- `collections`: No support yet for grouping words into custom collections (e.g. `NIGHT`, `EMOTIONS`, `DELHI`, `STREET`, `HOOK WORDS`).
- `personalNote`: Uses `notes`, should ensure clear alias / personal note support.
- `saveFromAnywhere`: Needs unified helper callable from RhymeRack, Discovery tab, WordDetailModal, StuckModal, Search without navigation.
- `recentWords`: No tracking of actively interacted/viewed/pinned words across sessions.

### 2.4 Persistence & Autosave Layer
- LocalStorage keys:
  - `bhasha_songs_v1`
  - `bhasha_active_song_id_v1`
  - `bhasha_lexicon_v1`
  - `bhasha_preferences_v1`
  - `bhasha_recent_searches_v1`
- **Autosave:** 400ms debounce in `SongEditor.tsx` with reliable storage update and timestamp refresh.
- **Gaps:**
  - Need dedicated storage keys for `bhasha_versions_v1`, `bhasha_ideas_v1`, `bhasha_collections_v1`, `bhasha_recent_words_v1`.
  - Need project backup export/import format (`BHASHA_PROJECT.json`) with `schemaVersion: 1`.

---

## 3. UI, Navigation & Workflows Audit

### 3.1 Song Library (`/library/songs`)
- **Current:** Basic 2-column grid with title, bpm, key, status, and simple text search.
- **Gaps to Address in Phase 10:**
  1. Add Status filter tabs: `ALL`, `IN PROGRESS`, `COMPLETE`, `ARCHIVED`.
  2. Add Sorting: `Recently edited` (default), `Recently created`, `Alphabetical`, `Bar count`.
  3. Search across title, section names, and lyric contents.
  4. Safe Archiving & Restoring (archived songs filtered out of main view, restorable from `ARCHIVED` tab).
  5. Permanent deletion confirmation protection (preventing 1-click accidental loss).
  6. Deep-copy song duplication.

### 3.2 Song Versioning & Comparison (New in Phase 10)
- **Current:** No snapshot/versioning system exists.
- **Gaps to Address in Phase 10:**
  1. Named snapshot creation (`Save Version` button / `⌘⇧V` shortcut / label modal).
  2. Version list drawer showing timestamp, label, line/bar counts.
  3. Lyric-focused diff comparison showing Added (`+`), Removed (`-`), and Modified lines in a clean, songwriter-friendly view (not a developer git diff).
  4. Safe Restore: Automatically creates a safety snapshot (`"Before restore — <timestamp>"`) before applying restored content.

### 3.3 Song Notes & Section Notes (New in Phase 10)
- **Current:** Single `scratchpadNotes` field in drawer.
- **Gaps to Address in Phase 10:**
  1. Dedicated structured notes (Theme, Hook Concept, Emotional Direction, Production Notes).
  2. Section-level notes attached to specific song sections (e.g. Verse 1 delivery note, Hook arrangement note).

### 3.4 Creative Ideas Library (New in Phase 10)
- **Current:** Ideas exist only as static prompt seeds in `data/prompts.ts` and transient catalyst outputs in `StuckModal.tsx`.
- **Gaps to Address in Phase 10:**
  1. Dedicated Ideas Library page (`/library/ideas`) to save and organize concepts, images, emotions, contrasts, phrases, scenes, and themes.
  2. Idea status: `UNUSED`, `IN PROGRESS`, `USED`.
  3. Idea $\leftrightarrow$ Song attachment.
  4. Idea $\leftrightarrow$ Word attachment.

### 3.5 Global Search & Navigation
- **Current Navigation:**
  - WRITE: New Song, Writing Studio, Drafts & Songs
  - EXPLORE: Rhymes, Words, Ideas & Prompts
  - LIBRARY: My Songs, My Lexicon
- **Phase 10 Target Navigation Structure:**
  - **WRITING:** Studio (`/write`), Songs (`/library/songs`)
  - **LIBRARY:** Lexicon (`/library/lexicon`), Ideas (`/library/ideas`)
  - **TOOLS:** Rhymes (`/explore/rhymes`), Words (`/explore/words`), Prompts (`/explore/prompts`)
- **Global Search:** Single unified search querying Songs, Lyrics, Lexicon, and Ideas simultaneously.

---

## 4. Identified Friction Points & Cleanup Plan

| Area | Current State | Phase 10 Resolution |
| :--- | :--- | :--- |
| **Song Statuses** | Inconsistent casing (`Draft`, `In Progress`, `Finished`, `Recorded`) | Standardize on `'DRAFT' \| 'IN PROGRESS' \| 'COMPLETE' \| 'ARCHIVED'` with case-insensitive normalization. |
| **Song Deletion** | 1-click delete in list row | Safe Archive by default; permanent deletion requires explicit confirmation modal. |
| **Song Duplication** | Shallow spread copy | Deep copy ensuring clean new ID, isolated notes, stashed rhymes, and vocabulary without reference sharing. |
| **Portability** | Only single-song `.md` export and raw lexicon json | Unified `BHASHA_PROJECT.json` (schema v1) backup/import with validation, preview, plus `.txt` export alongside `.md`. |
| **Vocabulary Bridge** | Lexicon disconnected from active writing | Save to Lexicon vs Save to Song Vocabulary buttons directly in Rhyme Rack, Discovery, and Search. |

---

## 5. Audit Conclusion

The Phase 1–9 linguistic and verse-analysis foundation is solid and requires no structural rewrites. Phase 10 will cleanly build the project management, creative memory, versioning, and portability layers on top of this foundation.
