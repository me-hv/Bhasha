# BHASHA — DATA RECOVERY & CORRUPTION HANDLING GUIDE

---

## 1. Principles of Data Recovery in BHASHA

1. **Never Silently Overwrite**: When storage cannot be read or parsed, BHASHA never interprets the state as "the library is empty."
2. **Emergency Quarantine**: Corrupted or malformed storage contents are automatically cloned into an emergency preservation key (`bhasha_corrupt_backup_<timestamp>`) before any corrective action is taken.
3. **Graceful Degradation**: If one song or version is malformed, healthy songs and vocabulary are loaded normally while isolating the damaged entity.
4. **Structured Diagnostics**: The user is presented with exact, actionable diagnostics (what was found, what was salvaged, and manual recovery options).

---

## 2. Corruption Taxonomy & Recovery Matrix

| Corruption Type | Detection Mechanism | Automated Recovery Action | Manual Intervention Required |
|---|---|---|---|
| **Invalid JSON Syntax in LocalStorage** | `JSON.parse` syntax error in `safeGetWithDiagnostics` | Raw string saved to `bhasha_corrupt_backup_<timestamp>`. System alerts user and offers emergency export. | User can extract raw string or restore from a previous `.json` backup. |
| **Missing Primary Fields (e.g. Song title/id missing)** | `validateProjectIntegrity()` checks schema | Missing IDs generated deterministically; missing title replaced with `"UNTITLED (Recovered)"`. | User renames song. |
| **Dangling Foreign Key (Version references deleted song)** | `detectOrphans()` in `integrity.ts` | Orphaned version preserved in isolated list; warning reported. | User can assign to another track or dismiss. |
| **Dangling Song ID in Creative Ideas** | `detectOrphans()` | Invalid song ID removed from `attachedSongIds`; idea content preserved intact. | None (safe automated cleanup). |
| **Dangling Word in Song Vocabulary Bank** | `detectOrphans()` | Missing word removed from song list; warning recorded. | None. |
| **Duplicate IDs in Project Import** | `validateProjectIntegrity()` | Duplicate IDs reassigned with unique suffix: `id + '-dup-' + rand`. | None. |
| **Out-of-Range Metadata (BPM 999, invalid key)** | `validateSong()` | BPM clamped to valid range (40–250); invalid key normalized to `"Am"`. | None. |
| **Malformed Date Strings** | `isNaN(Date.parse(ts))` | Replaced with current timestamp `new Date().toISOString()`. | None. |
| **Storage Quota Exceeded (5MB+ LocalStorage limit)** | `QuotaExceededError` on `localStorage.setItem` | System prevents destructive write, warns writer, and offers 1-click `BHASHA_PROJECT.json` file download. | Writer downloads backup and archives old tracks. |

---

## 3. Emergency Backup & Restoration Workflow

If an artist encounters unexpected browser corruption or localStorage clearing:

1. **Automated Emergency Key**: Check localStorage for keys matching `bhasha_corrupt_backup_*`.
2. **File-Based Restoration**:
   - Navigate to `/library/songs` $\to$ **Import Project**.
   - Select the latest `BHASHA_PROJECT.json` backup file.
   - The two-phase atomic importer validates integrity, presents item counts (Songs, Versions, Words, Ideas), and restores the full workspace safely.

---

## 4. Diagnostics & Reporting Format

The integrity validation engine produces structured diagnostics:

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "code": "ORPHAN_VERSION_REFERENCE",
      "entity": "SongVersion",
      "id": "ver-12345",
      "message": "Version 'Hook Draft' references non-existent song 'song-999'. Reference decoupled."
    }
  ],
  "stats": {
    "totalSongs": 12,
    "totalVersions": 28,
    "totalLexiconWords": 140,
    "totalIdeas": 15,
    "totalCollections": 6
  }
}
```
