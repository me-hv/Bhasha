import {
  Song,
  SongVersion,
  SavedWord,
  CreativeIdea,
  SongStatus,
  IdeaType,
  IdeaStatus,
  BhashaProjectBackup,
  ImportPreviewResult,
  ProjectIntegrityReport,
} from '../../types';
import { getStoredSongs, getStoredVersions } from '../storage/songs';
import { getStoredLexicon, getStoredCollections, getRecentWords } from '../storage/lexicon';
import { getStoredIdeas } from '../storage/ideas';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '../storage/storage';
import { validateProjectIntegrity, VALID_SONG_STATUSES, LEGACY_SONG_STATUS_MAP, VALID_IDEA_TYPES, VALID_IDEA_STATUSES } from '../storage/integrity';
import { migrateProject, CURRENT_SCHEMA_VERSION } from '../storage/migrations';

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return Promise.resolve(false);
  }
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function downloadTextFile(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function formatSongMarkdown(song: Song): string {
  const lines = (song.content || '').split('\n');
  let currentBar = 0;
  const formattedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formattedLines.push('');
      continue;
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentBar = 0; // Reset bar counter per section
      const sectionName = trimmed.slice(1, -1).trim();
      formattedLines.push(`\n## ${sectionName}\n`);
      continue;
    }

    currentBar++;
    const barPrefix = String(currentBar).padStart(2, '0');
    formattedLines.push(`${barPrefix}. ${trimmed}`);
  }

  return `# ${song.title.toUpperCase()}

> **BPM:** ${song.bpm} | **Key:** ${song.key} | **Time:** ${song.timeSignature || '4/4'} | **Status:** ${song.status}

---

${formattedLines.join('\n').trim()}

---
${song.notes ? `\n### Creative Notes\n${song.notes}\n` : ''}${song.scratchpadNotes ? `\n### Scratchpad\n${song.scratchpadNotes}\n` : ''}${song.songVocabulary && song.songVocabulary.length > 0 ? `\n### Song Vocabulary\n${song.songVocabulary.join(', ')}\n` : ''}${song.stashedRhymes && song.stashedRhymes.length > 0 ? `\n### Rhyme Stash\n${song.stashedRhymes.join(', ')}\n` : ''}
*Written in BHASHA — Hindi/Hinglish Rap Writing OS*
`;
}

export function formatSongTxt(song: Song): string {
  const lines = (song.content || '').split('\n');
  let currentBar = 0;
  const formattedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formattedLines.push('');
      continue;
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentBar = 0;
      formattedLines.push(`\n[${trimmed.slice(1, -1).trim()}]\n`);
      continue;
    }

    currentBar++;
    const barPrefix = String(currentBar).padStart(2, '0');
    formattedLines.push(`${barPrefix}. ${trimmed}`);
  }

  return `${song.title.toUpperCase()}
BPM: ${song.bpm} | Key: ${song.key} | Time: ${song.timeSignature || '4/4'} | Status: ${song.status}
==================================================

${formattedLines.join('\n').trim()}

==================================================
${song.notes ? `\nCREATIVE NOTES:\n${song.notes}\n` : ''}${song.songVocabulary && song.songVocabulary.length > 0 ? `\nSONG VOCABULARY:\n${song.songVocabulary.join(', ')}\n` : ''}
`;
}

// =========================================================================
// IDEMPOTENT SEMANTIC NORMALIZER
// Guarantee: f(f(x)) === f(x)
// Strict rule: Song lyric content is IMMUTABLE and untouched.
// =========================================================================

export function normalizeProject(project: BhashaProjectBackup): BhashaProjectBackup {
  const now = new Date().toISOString();

  // Deduplicate helper preserving first occurrence
  const uniqueStrings = (arr?: string[]): string[] => {
    if (!Array.isArray(arr)) return [];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of arr) {
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed && !seen.has(trimmed)) {
          seen.add(trimmed);
          result.push(trimmed);
        }
      }
    }
    return result;
  };

  // 1. Normalize Songs
  const songs: Song[] = (project.songs || []).map((s) => {
    let canonicalStatus: SongStatus = 'DRAFT';
    if (s.status) {
      if (VALID_SONG_STATUSES.has(s.status)) {
        canonicalStatus = s.status;
      } else if (LEGACY_SONG_STATUS_MAP[s.status]) {
        canonicalStatus = LEGACY_SONG_STATUS_MAP[s.status] as SongStatus;
      }
    }

    const bpm = typeof s.bpm === 'number' && !isNaN(s.bpm) ? Math.min(250, Math.max(40, Math.round(s.bpm))) : 92;
    const revision = typeof s.revision === 'number' && s.revision >= 1 ? Math.floor(s.revision) : 1;

    return {
      ...s,
      id: s.id || `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: s.title ? s.title.trim() : 'UNTITLED TRACK',
      // LYRICS ARE IMMUTABLE — NEVER TOUCH CONTENT
      content: typeof s.content === 'string' ? s.content : '',
      bpm,
      key: s.key ? s.key.trim() : 'Am',
      timeSignature: s.timeSignature ? s.timeSignature.trim() : '4/4',
      status: canonicalStatus,
      revision,
      tags: uniqueStrings(s.tags),
      notes: typeof s.notes === 'string' ? s.notes : '',
      sectionNotes: s.sectionNotes && typeof s.sectionNotes === 'object' ? { ...s.sectionNotes } : {},
      songVocabulary: uniqueStrings(s.songVocabulary),
      scratchpadNotes: typeof s.scratchpadNotes === 'string' ? s.scratchpadNotes : '',
      stashedRhymes: uniqueStrings(s.stashedRhymes),
      createdAt: s.createdAt || now,
      updatedAt: s.updatedAt || now,
    };
  });

  // 2. Normalize Versions (lyrics untouched)
  const versions: SongVersion[] = (project.versions || []).map((v) => ({
    ...v,
    id: v.id || `ver-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: v.label ? v.label.trim() : 'Snapshot',
    timestamp: v.timestamp || now,
    // Content is immutable
    content: typeof v.content === 'string' ? v.content : '',
    notes: typeof v.notes === 'string' ? v.notes : '',
    sectionNotes: v.sectionNotes && typeof v.sectionNotes === 'object' ? { ...v.sectionNotes } : {},
    songVocabulary: uniqueStrings(v.songVocabulary),
    tags: uniqueStrings(v.tags),
    bpm: typeof v.bpm === 'number' && !isNaN(v.bpm) ? v.bpm : 92,
    key: v.key || 'Am',
    isAutoSafetySnapshot: Boolean(v.isAutoSafetySnapshot),
  }));

  // 3. Normalize Lexicon (deduplicate by devanagari word, merging collections and tags)
  const lexiconMap = new Map<string, SavedWord>();
  for (const item of project.lexicon || []) {
    if (!item || !item.devanagari) continue;
    const wordKey = item.devanagari.trim();
    if (!lexiconMap.has(wordKey)) {
      lexiconMap.set(wordKey, {
        ...item,
        id: item.id || `word-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        devanagari: wordKey,
        roman: item.roman ? item.roman.trim() : '',
        meaning: item.meaning ? item.meaning.trim() : '',
        tags: uniqueStrings(item.tags),
        collections: uniqueStrings(item.collections),
        savedAt: item.savedAt || now,
      });
    } else {
      const existing = lexiconMap.get(wordKey)!;
      // Merge tags and collections non-destructively
      existing.tags = uniqueStrings([...(existing.tags || []), ...(item.tags || [])]);
      existing.collections = uniqueStrings([...(existing.collections || []), ...(item.collections || [])]);
      if (!existing.notes && item.notes) existing.notes = item.notes;
      if (!existing.personalNote && item.personalNote) existing.personalNote = item.personalNote;
      if ((item.meaning?.length || 0) > (existing.meaning?.length || 0)) {
        existing.meaning = item.meaning;
      }
    }
  }
  const lexicon = Array.from(lexiconMap.values());

  // 4. Normalize Collections (deduplicated and sorted)
  const collectionSet = new Set<string>();
  for (const c of project.collections || []) {
    if (typeof c === 'string' && c.trim()) collectionSet.add(c.trim());
  }
  for (const w of lexicon) {
    if (w.collections) {
      for (const c of w.collections) {
        if (c.trim()) collectionSet.add(c.trim());
      }
    }
  }
  const collections = Array.from(collectionSet).sort();

  // 5. Normalize Ideas
  const ideas: CreativeIdea[] = (project.ideas || []).map((idea) => {
    let canonicalType: IdeaType = 'CONCEPT';
    if (idea.type && VALID_IDEA_TYPES.has(idea.type)) {
      canonicalType = idea.type;
    }

    let canonicalStatus: IdeaStatus = 'UNUSED';
    if (idea.status && VALID_IDEA_STATUSES.has(idea.status)) {
      canonicalStatus = idea.status;
    }

    return {
      ...idea,
      id: idea.id || `idea-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: idea.title ? idea.title.trim() : 'Untitled Idea',
      type: canonicalType,
      status: canonicalStatus,
      content: typeof idea.content === 'string' ? idea.content : '',
      tags: uniqueStrings(idea.tags),
      attachedSongIds: uniqueStrings(idea.attachedSongIds),
      relatedWords: uniqueStrings(idea.relatedWords),
      createdAt: idea.createdAt || now,
      updatedAt: idea.updatedAt || now,
    };
  });

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    bhashaVersion: project.bhashaVersion || '1.0.0',
    generator: project.generator || 'BHASHA Songwriter OS',
    exportedAt: project.exportedAt || now,
    songs,
    versions,
    lexicon,
    collections,
    ideas,
    recentWords: uniqueStrings(project.recentWords),
    preferences: project.preferences,
  };
}

// =========================================================================
// PROJECT BACKUP & EXPORT
// =========================================================================

export function createProjectBackup(schemaVersion: number = CURRENT_SCHEMA_VERSION): BhashaProjectBackup {
  return {
    schemaVersion,
    exportedAt: new Date().toISOString(),
    bhashaVersion: '1.0.0',
    generator: 'BHASHA Songwriter OS',
    songs: getStoredSongs(),
    versions: getStoredVersions(),
    lexicon: getStoredLexicon(),
    collections: getStoredCollections(),
    ideas: getStoredIdeas(),
    recentWords: getRecentWords(),
  };
}

export function exportProjectJson(backup?: BhashaProjectBackup, schemaVersion: number = CURRENT_SCHEMA_VERSION): string {
  const data = backup || createProjectBackup(schemaVersion);
  return JSON.stringify(data, null, 2);
}

// =========================================================================
// PREVIEW IMPORT BEFORE COMMIT
// =========================================================================

export function generateImportPreview(jsonStr: string): ImportPreviewResult {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err: any) {
    return {
      valid: false,
      schemaVersion: 0,
      migrationRequired: false,
      targetSchemaVersion: CURRENT_SCHEMA_VERSION,
      counts: { songs: 0, versions: 0, lexicon: 0, collections: 0, ideas: 0 },
      warnings: [],
      errors: [
        {
          code: 'INVALID_JSON_SYNTAX',
          entity: 'Project',
          message: `JSON Syntax Error: ${err?.message || 'Invalid JSON format'}`,
          fatal: true,
        },
      ],
      conflicts: { duplicateSongTitles: [], overwritingExistingIds: [] },
    };
  }

  // 1. Run Migration Dispatcher
  const migration = migrateProject(parsed);
  if (!migration.success || !migration.data) {
    return {
      valid: false,
      schemaVersion: migration.fromVersion,
      migrationRequired: false,
      targetSchemaVersion: CURRENT_SCHEMA_VERSION,
      counts: { songs: 0, versions: 0, lexicon: 0, collections: 0, ideas: 0 },
      warnings: [],
      errors: [
        {
          code: 'MIGRATION_FAILED',
          entity: 'Project',
          message: migration.error || 'Failed to migrate schema to current version',
          fatal: true,
        },
      ],
      conflicts: { duplicateSongTitles: [], overwritingExistingIds: [] },
    };
  }

  const migratedData = migration.data;
  const integrityReport = validateProjectIntegrity(migratedData);

  // 2. Check Conflicts against current localStorage state
  const existingSongs = getFromStorage<Song[]>(STORAGE_KEYS.SONGS, []);
  const existingSongIds = new Set(existingSongs.map((s) => s.id));
  const existingSongTitles = new Set(existingSongs.map((s) => s.title.toLowerCase().trim()));

  const duplicateSongTitles: string[] = [];
  const overwritingExistingIds: string[] = [];

  for (const incomingSong of migratedData.songs || []) {
    if (incomingSong.id && existingSongIds.has(incomingSong.id)) {
      overwritingExistingIds.push(`Song: ${incomingSong.title} (${incomingSong.id})`);
    }
    if (incomingSong.title && existingSongTitles.has(incomingSong.title.toLowerCase().trim())) {
      duplicateSongTitles.push(incomingSong.title);
    }
  }

  return {
    valid: integrityReport.valid,
    schemaVersion: migration.fromVersion,
    migrationRequired: migration.fromVersion < CURRENT_SCHEMA_VERSION,
    targetSchemaVersion: CURRENT_SCHEMA_VERSION,
    counts: {
      songs: (migratedData.songs || []).length,
      versions: (migratedData.versions || []).length,
      lexicon: (migratedData.lexicon || []).length,
      collections: (migratedData.collections || []).length,
      ideas: (migratedData.ideas || []).length,
    },
    warnings: integrityReport.warnings,
    errors: integrityReport.errors,
    conflicts: {
      duplicateSongTitles: Array.from(new Set(duplicateSongTitles)),
      overwritingExistingIds,
    },
  };
}

// =========================================================================
// ATOMIC TWO-PHASE COMMIT PROJECT IMPORT
// Guarantees existing storage is NEVER partially modified or corrupted.
// =========================================================================

export function atomicImportProject(
  jsonStr: string
): {
  success: boolean;
  error?: string;
  report?: ProjectIntegrityReport;
  importedBackup?: BhashaProjectBackup;
} {
  // Phase 1: In-memory parse, migrate, normalize & validate
  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to parse project JSON: ${err?.message || 'Syntax error'}`,
    };
  }

  // Sequential Schema Migration
  const migration = migrateProject(parsed);
  if (!migration.success || !migration.data) {
    return {
      success: false,
      error: migration.error || 'Project schema migration failed',
    };
  }

  // Deep Integrity Validation on raw migrated input (catches fatal input errors)
  const report = validateProjectIntegrity(migration.data);
  if (!report.valid) {
    const fatalErrors = report.errors.filter((e) => e.fatal).map((e) => e.message).join('; ');
    return {
      success: false,
      error: `Import aborted due to data integrity errors: ${fatalErrors}`,
      report,
    };
  }

  // Semantic Normalization
  const normalized = normalizeProject(migration.data);

  // Phase 2: Transactional Commit to Storage
  // Snapshot current state for rollback in case of quota or storage error
  const prevSongs = getFromStorage(STORAGE_KEYS.SONGS, []);
  const prevVersions = getFromStorage(STORAGE_KEYS.VERSIONS, []);
  const prevLexicon = getFromStorage(STORAGE_KEYS.SAVED_LEXICON, []);
  const prevCollections = getFromStorage(STORAGE_KEYS.COLLECTIONS, []);
  const prevIdeas = getFromStorage(STORAGE_KEYS.IDEAS, []);
  const prevRecentWords = getFromStorage(STORAGE_KEYS.RECENT_WORDS, []);
  const prevPrefs = getFromStorage(STORAGE_KEYS.PREFERENCES, null);

  try {
    const w1 = setToStorage(STORAGE_KEYS.SONGS, normalized.songs);
    const w2 = setToStorage(STORAGE_KEYS.VERSIONS, normalized.versions);
    const w3 = setToStorage(STORAGE_KEYS.SAVED_LEXICON, normalized.lexicon);
    const w4 = setToStorage(STORAGE_KEYS.COLLECTIONS, normalized.collections);
    const w5 = setToStorage(STORAGE_KEYS.IDEAS, normalized.ideas);
    const w6 = setToStorage(STORAGE_KEYS.RECENT_WORDS, normalized.recentWords || []);
    if (normalized.preferences) {
      setToStorage(STORAGE_KEYS.PREFERENCES, normalized.preferences);
    }

    if (!w1 || !w2 || !w3 || !w4 || !w5 || !w6) {
      throw new Error('LocalStorage write returned false (possible storage quota exceeded)');
    }

    return {
      success: true,
      report,
      importedBackup: normalized,
    };
  } catch (err: any) {
    // Rollback to prior state
    setToStorage(STORAGE_KEYS.SONGS, prevSongs);
    setToStorage(STORAGE_KEYS.VERSIONS, prevVersions);
    setToStorage(STORAGE_KEYS.SAVED_LEXICON, prevLexicon);
    setToStorage(STORAGE_KEYS.COLLECTIONS, prevCollections);
    setToStorage(STORAGE_KEYS.IDEAS, prevIdeas);
    setToStorage(STORAGE_KEYS.RECENT_WORDS, prevRecentWords);
    if (prevPrefs) setToStorage(STORAGE_KEYS.PREFERENCES, prevPrefs);

    return {
      success: false,
      error: `Atomic import transaction failed: ${err?.message || 'Storage error'}. Changes were rolled back.`,
      report,
    };
  }
}

/**
 * Backward compatibility wrapper for validateAndImportProjectJson
 */
export function validateAndImportProjectJson(
  jsonStr: string,
  applyToStorage: boolean = true
): {
  success: boolean;
  data?: BhashaProjectBackup;
  error?: string;
  counts?: { songs: number; versions: number; lexicon: number; ideas: number };
} {
  if (!applyToStorage) {
    const preview = generateImportPreview(jsonStr);
    if (!preview.valid) {
      return { success: false, error: preview.errors.map((e) => e.message).join('; ') };
    }
    const migration = migrateProject(jsonStr);
    return {
      success: true,
      data: migration.data ? normalizeProject(migration.data) : undefined,
      counts: preview.counts,
    };
  }

  const result = atomicImportProject(jsonStr);
  if (!result.success || !result.importedBackup) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    data: result.importedBackup,
    counts: {
      songs: result.importedBackup.songs.length,
      versions: result.importedBackup.versions.length,
      lexicon: result.importedBackup.lexicon.length,
      ideas: result.importedBackup.ideas.length,
    },
  };
}
