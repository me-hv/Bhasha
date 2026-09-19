# BHASHA — PHASE 11 ARCHITECTURAL AUDIT
## Storage Architecture, Persistence Reliability, Data Integrity & Failure Modes

---

## 1. Executive Summary

BHASHA is a local-first songwriting operating environment for Hindi, Urdu, and Hinglish rap writers and poets. In Phase 10, the application introduced rich project management: Songs, Sections, Bars, Version Snapshots, Lyric Diffs, Lexicon Collections, Song Vocabulary, Creative Ideas, Global Search, and Schema v1.0.0 Project Backups.

This audit evaluates the reliability, data integrity, concurrency, serialization, and failure resilience of BHASHA's persistence architecture before executing Phase 11 hardening.

---

## 2. Current Storage Architecture & Key Mapping

BHASHA utilizes a synchronized, local-first storage architecture backed by browser `window.localStorage` with safe in-memory fallback mechanisms for non-browser/CLI/test environments.

| Storage Key | Entity Type | Data Schema / Structure | Persistence Nature |
|---|---|---|---|
| `bhasha_songs_v1` | `Song[]` | Array of full song projects with lyrics, sections, notes, metadata | Canonical Persisted |
| `bhasha_active_song_id_v1` | `string` | ID of the song currently open in the Writing Studio | Session State |
| `bhasha_lexicon_v1` | `SavedWord[]` | User's personal vocabulary bank with custom notes and collection tags | Canonical Persisted |
| `bhasha_versions_v1` | `SongVersion[]` | Named snapshots and automatic safety snapshots (`isAutoSafetySnapshot`) | Canonical Persisted |
| `bhasha_ideas_v1` | `CreativeIdea[]` | Fragments, couplets, sensory contrasts, concepts, and links | Canonical Persisted |
| `bhasha_collections_v1` | `string[]` | Custom lexicon collection names (uppercased) | Canonical Persisted |
| `bhasha_recent_words_v1` | `string[]` | Ordered list of recently interacted vocabulary (max 20) | Working Cache |
| `bhasha_preferences_v1` | `AppPreferences` | Font size, metronome sound/volume, syllable toggles, zen mode | Preferences |
| `bhasha_recent_searches_v1` | `string[]` | Recent global search query strings | Working Cache |

---

## 3. Persistent vs. Derived Data Separation

| Entity Field | Classification | Rationale & Lifecycle |
|---|---|---|
| `Song.content` | **Canonical Persisted** | Sacred user lyric text. Must never be mutated or rewritten automatically. |
| `Song.title`, `bpm`, `key`, `tags`, `mood` | **Canonical Persisted** | Project musical metadata defined by the artist. |
| `Song.notes`, `sectionNotes` | **Canonical Persisted** | Creative directives and delivery guidelines. |
| `Song.songVocabulary` | **Canonical Persisted** | Word references curated specifically for this song. |
| `ParsedLine.syllables` | **Derived (Transient)** | Recomputed dynamically by phonetic engine (`countSyllables`). |
| `ParsedLine.rhymeGroup` | **Derived (Transient)** | Recomputed dynamically by `computeRhymeGroups`. |
| `ParsedLine.internalRhymes` | **Derived (Transient)** | Recomputed dynamically by `detectInternalRhymes`. |
| `SongStats` (density, totals) | **Derived (Transient)** | Recomputed dynamically from parsed lines by `parseSongContent`. |
| `SongVersion.content` | **Canonical Persisted** | Immutable snapshot of past lyric state. |
| `SavedWord.personalNote` | **Canonical Persisted** | Personal usage context and intended rhyme pairings. |
| `CreativeIdea.attachedSongIds` | **Canonical Persisted** | Foreign key references to songs. |
| `CreativeIdea.relatedWords` | **Canonical Persisted** | Lexical keyword references. |

---

## 4. Identified Integrity Risks & Mitigation Plan

### A. Partial Overwrites on Import Failure (HIGH RISK)
- **Problem**: In previous implementations, importing project JSON wrote directly to storage keys sequentially. A syntax or schema error halfway through could leave the library in a corrupted, half-imported state.
- **Phase 11 Mitigation**: Implement **Atomic Transactional Import** (Two-phase commit). Staged import validates schema, integrity, and relationships completely before writing a single byte. If validation fails, original storage remains 100% untouched.

### B. Orphaned References (MEDIUM RISK)
- **Problem**:
  1. Deleting a song could leave `SongVersion` or `CreativeIdea.attachedSongIds` pointing to non-existent song IDs.
  2. Deleting a lexicon word could leave `Song.songVocabulary` or `CreativeIdea.relatedWords` with dangling references.
  3. Deleting a collection could leave `SavedWord.collections` containing deleted collection names.
- **Phase 11 Mitigation**: Centralized `integrity.ts` with explicit `detectOrphans()` and non-destructive `repairOrphans()`.

### C. Reference Aliasing during Duplication (HIGH RISK)
- **Problem**: Duplicating complex objects via shallow copy (`...source`) shares references for arrays (`tags`, `songVocabulary`, `stashedRhymes`) and nested dictionaries (`sectionNotes`), causing mutations in the copy to mutate the original.
- **Phase 11 Mitigation**: Deep structured cloning for all duplicated projects, accompanied by dedicated alias stress tests.

### D. Corrupted Storage Interpretation as "Empty Library" (CRITICAL RISK)
- **Problem**: When `localStorage.getItem()` returns invalid or truncated JSON, calling `try...catch` and returning default `[]` could cause subsequent writes to overwrite and wipe the user's entire library.
- **Phase 11 Mitigation**: Implement `safeGetWithDiagnostics()`. When corrupted data is detected, immediately quarantine raw content into an emergency backup key (`bhasha_corrupt_backup_<timestamp>`) and raise a structured recovery alert instead of silently returning empty arrays.

### E. Concurrency & Rapid Autosave Race Conditions (MEDIUM RISK)
- **Problem**: Rapid typing or fast navigation could trigger overlapping save operations where a slower asynchronous call overwrites a newer revision.
- **Phase 11 Mitigation**: Introduce monotonic `Song.revision` counters and synchronous write guarantees with revision guards.

### F. Multi-Variant Search Inconsistencies (LOW RISK)
- **Problem**: Hindi/Urdu search queries with or without Nuqtas (e.g. `क़ुदरत` vs `कुदरत`, `ज़िंदगी` vs `जिंदगी`) or alternate Roman transliterations (`khwaab` vs `khwab`) must reliably return canonical hits without duplicate results.
- **Phase 11 Mitigation**: Hardened Unicode NFC normalization, nuqta-stripping fallback index, and transliteration mapping in `search-service.ts`.

---

## 5. Schema Versioning & Migration Strategy

- **Schema v1.0.0**: Initial format established in Phase 10 (`bhashaVersion: '1.0.0'`, `schemaVersion: 1`).
- **Schema v2.0.0 (Phase 11)**:
  - Canonicalized uppercase status enums (`DRAFT`, `IN PROGRESS`, `COMPLETE`, `ARCHIVED`).
  - Added project integrity checksum and metadata.
  - Added monotonic `revision` field to each Song project.
  - Unified `notes` hierarchy.
- **Migration Architecture**: Sequential migration chain (`v1_to_v2.ts`) with safe error boundaries and explicit rejection of unsupported future versions ($> \text{MAX\_SUPPORTED}$).

---

## 6. Audit Signoff

All architectural risks identified above will be resolved by the Phase 11 Reliability & Data Integrity implementation.
