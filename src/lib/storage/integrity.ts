/**
 * BHASHA Data Integrity & Validation Engine
 * Central validation authority for songs, versions, vocabulary, ideas, collections, and full projects.
 * Returns structured diagnostics distinguishing fatal errors from auto-repairable warnings.
 */

import {
  Song,
  SongVersion,
  SavedWord,
  CreativeIdea,
  BhashaProjectBackup,
  ValidationError,
  ValidationWarning,
  ValidationDiagnostic,
  ProjectIntegrityReport,
} from '../../types';

export const VALID_KEYS = new Set([
  'C', 'Cm', 'C#', 'C#m', 'Db', 'Dbm', 'D', 'Dm', 'D#', 'D#m',
  'Eb', 'Ebm', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'Gb', 'Gbm',
  'G', 'Gm', 'G#', 'G#m', 'Ab', 'Abm', 'A', 'Am', 'A#', 'A#m',
  'Bb', 'Bbm', 'B', 'Bm'
]);

export const VALID_TIME_SIGNATURES = new Set([
  '4/4', '3/4', '2/4', '6/8', '7/8', '5/4', '12/8'
]);

export const VALID_SONG_STATUSES = new Set([
  'DRAFT', 'IN PROGRESS', 'COMPLETE', 'ARCHIVED'
]);

export const LEGACY_SONG_STATUS_MAP: Record<string, string> = {
  'draft': 'DRAFT',
  'Draft': 'DRAFT',
  'in progress': 'IN PROGRESS',
  'In Progress': 'IN PROGRESS',
  'finished': 'COMPLETE',
  'Finished': 'COMPLETE',
  'complete': 'COMPLETE',
  'Complete': 'COMPLETE',
  'archived': 'ARCHIVED',
  'Archived': 'ARCHIVED',
  'recorded': 'COMPLETE',
  'Recorded': 'COMPLETE',
};

export const VALID_IDEA_TYPES = new Set([
  'CONCEPT', 'IMAGE', 'EMOTION', 'CONTRAST', 'SCENE', 'PHRASE', 'THEME', 'COUPLET'
]);

export const VALID_IDEA_STATUSES = new Set([
  'UNUSED', 'IN PROGRESS', 'USED'
]);

export function isValidTimestamp(ts: any): boolean {
  if (typeof ts !== 'string' || !ts.trim()) return false;
  const parsed = Date.parse(ts);
  if (isNaN(parsed)) return false;
  const date = new Date(parsed);
  const year = date.getUTCFullYear();
  return year >= 1970 && year <= 2100;
}

/**
 * Validates a single Song object
 */
export function validateSong(song: any): ValidationDiagnostic {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!song || typeof song !== 'object') {
    return {
      valid: false,
      errors: [{ code: 'INVALID_SONG_OBJECT', entity: 'Song', message: 'Song must be an object', fatal: true }],
      warnings: [],
    };
  }

  // ID Check
  if (!song.id || typeof song.id !== 'string' || !song.id.trim()) {
    errors.push({ code: 'MISSING_SONG_ID', entity: 'Song', field: 'id', message: 'Song ID is missing or empty', fatal: true });
  }

  // Title Check
  if (!song.title || typeof song.title !== 'string' || !song.title.trim()) {
    warnings.push({
      code: 'MISSING_SONG_TITLE',
      entity: 'Song',
      id: song.id,
      field: 'title',
      message: 'Song title is missing or empty',
      autoRepairable: true,
    });
  }

  // Content Check (Lyrics)
  if (song.content === undefined || song.content === null || typeof song.content !== 'string') {
    errors.push({
      code: 'INVALID_SONG_CONTENT',
      entity: 'Song',
      id: song.id,
      field: 'content',
      message: 'Song lyrics content must be a string',
      fatal: true,
    });
  }

  // BPM Check
  if (typeof song.bpm !== 'number' || isNaN(song.bpm)) {
    warnings.push({
      code: 'INVALID_BPM_TYPE',
      entity: 'Song',
      id: song.id,
      field: 'bpm',
      message: `Invalid BPM "${song.bpm}", defaulting to 92`,
      autoRepairable: true,
    });
  } else if (song.bpm < 40 || song.bpm > 250) {
    warnings.push({
      code: 'BPM_OUT_OF_RANGE',
      entity: 'Song',
      id: song.id,
      field: 'bpm',
      message: `BPM ${song.bpm} is outside typical range [40, 250]`,
      autoRepairable: true,
    });
  }

  // Key Check
  if (song.key && typeof song.key === 'string' && !VALID_KEYS.has(song.key.trim())) {
    warnings.push({
      code: 'UNKNOWN_MUSICAL_KEY',
      entity: 'Song',
      id: song.id,
      field: 'key',
      message: `Key "${song.key}" is not recognized as standard musical key`,
      autoRepairable: true,
    });
  }

  // Time Signature Check
  if (song.timeSignature && typeof song.timeSignature === 'string' && !VALID_TIME_SIGNATURES.has(song.timeSignature.trim())) {
    warnings.push({
      code: 'UNCONVENTIONAL_TIME_SIGNATURE',
      entity: 'Song',
      id: song.id,
      field: 'timeSignature',
      message: `Time signature "${song.timeSignature}" is unconventional`,
      autoRepairable: true,
    });
  }

  // Status Check
  if (!song.status) {
    warnings.push({
      code: 'MISSING_SONG_STATUS',
      entity: 'Song',
      id: song.id,
      field: 'status',
      message: 'Song status missing, defaulting to DRAFT',
      autoRepairable: true,
    });
  } else if (!VALID_SONG_STATUSES.has(song.status)) {
    if (LEGACY_SONG_STATUS_MAP[song.status]) {
      warnings.push({
        code: 'LEGACY_SONG_STATUS',
        entity: 'Song',
        id: song.id,
        field: 'status',
        message: `Legacy status "${song.status}" will be migrated to "${LEGACY_SONG_STATUS_MAP[song.status]}"`,
        autoRepairable: true,
      });
    } else {
      warnings.push({
        code: 'INVALID_SONG_STATUS',
        entity: 'Song',
        id: song.id,
        field: 'status',
        message: `Invalid song status "${song.status}", defaulting to DRAFT`,
        autoRepairable: true,
      });
    }
  }

  // Timestamps
  if (!isValidTimestamp(song.createdAt)) {
    warnings.push({
      code: 'INVALID_CREATED_AT',
      entity: 'Song',
      id: song.id,
      field: 'createdAt',
      message: 'Invalid createdAt timestamp format',
      autoRepairable: true,
    });
  }
  if (!isValidTimestamp(song.updatedAt)) {
    warnings.push({
      code: 'INVALID_UPDATED_AT',
      entity: 'Song',
      id: song.id,
      field: 'updatedAt',
      message: 'Invalid updatedAt timestamp format',
      autoRepairable: true,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a single SongVersion snapshot
 */
export function validateVersion(version: any, knownSongIds?: Set<string>): ValidationDiagnostic {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!version || typeof version !== 'object') {
    return {
      valid: false,
      errors: [{ code: 'INVALID_VERSION_OBJECT', entity: 'SongVersion', message: 'Version must be an object', fatal: true }],
      warnings: [],
    };
  }

  if (!version.id || typeof version.id !== 'string') {
    errors.push({ code: 'MISSING_VERSION_ID', entity: 'SongVersion', field: 'id', message: 'Version ID missing', fatal: true });
  }

  if (!version.songId || typeof version.songId !== 'string') {
    errors.push({ code: 'MISSING_VERSION_SONG_ID', entity: 'SongVersion', id: version.id, field: 'songId', message: 'Version is missing songId', fatal: true });
  } else if (knownSongIds && !knownSongIds.has(version.songId)) {
    errors.push({
      code: 'ORPHAN_VERSION',
      entity: 'SongVersion',
      id: version.id,
      field: 'songId',
      message: `Version "${version.label || version.id}" references non-existent song "${version.songId}"`,
      fatal: true,
    });
  }

  if (version.content === undefined || typeof version.content !== 'string') {
    errors.push({ code: 'MISSING_VERSION_CONTENT', entity: 'SongVersion', id: version.id, field: 'content', message: 'Version content is missing or not a string', fatal: true });
  }

  if (!isValidTimestamp(version.timestamp)) {
    warnings.push({ code: 'INVALID_VERSION_TIMESTAMP', entity: 'SongVersion', id: version.id, field: 'timestamp', message: 'Version timestamp is invalid', autoRepairable: true });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a SavedWord entry
 */
export function validateLexiconEntry(entry: any): ValidationDiagnostic {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!entry || typeof entry !== 'object') {
    return {
      valid: false,
      errors: [{ code: 'INVALID_LEXICON_OBJECT', entity: 'SavedWord', message: 'Lexicon entry must be an object', fatal: true }],
      warnings: [],
    };
  }

  if (!entry.devanagari || typeof entry.devanagari !== 'string' || !entry.devanagari.trim()) {
    errors.push({ code: 'MISSING_DEVANAGARI_WORD', entity: 'SavedWord', id: entry.id, field: 'devanagari', message: 'Missing primary Devanagari word', fatal: true });
  }

  if (!entry.id || typeof entry.id !== 'string') {
    warnings.push({ code: 'MISSING_WORD_ID', entity: 'SavedWord', field: 'id', message: 'Word ID missing, auto-generating', autoRepairable: true });
  }

  if (!entry.roman || typeof entry.roman !== 'string') {
    warnings.push({ code: 'MISSING_ROMAN_WORD', entity: 'SavedWord', id: entry.id, field: 'roman', message: 'Roman transliteration missing', autoRepairable: true });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a CreativeIdea entry
 */
export function validateIdea(idea: any, knownSongIds?: Set<string>): ValidationDiagnostic {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!idea || typeof idea !== 'object') {
    return {
      valid: false,
      errors: [{ code: 'INVALID_IDEA_OBJECT', entity: 'CreativeIdea', message: 'Idea must be an object', fatal: true }],
      warnings: [],
    };
  }

  if (!idea.id || typeof idea.id !== 'string') {
    errors.push({ code: 'MISSING_IDEA_ID', entity: 'CreativeIdea', field: 'id', message: 'Idea ID is missing', fatal: true });
  }

  if (!idea.title || typeof idea.title !== 'string' || !idea.title.trim()) {
    warnings.push({ code: 'MISSING_IDEA_TITLE', entity: 'CreativeIdea', id: idea.id, field: 'title', message: 'Idea title is empty', autoRepairable: true });
  }

  if (idea.type && !VALID_IDEA_TYPES.has(idea.type)) {
    warnings.push({ code: 'INVALID_IDEA_TYPE', entity: 'CreativeIdea', id: idea.id, field: 'type', message: `Unknown idea type "${idea.type}"`, autoRepairable: true });
  }

  if (idea.attachedSongIds && Array.isArray(idea.attachedSongIds) && knownSongIds) {
    for (const sId of idea.attachedSongIds) {
      if (!knownSongIds.has(sId)) {
        warnings.push({
          code: 'ORPHAN_IDEA_SONG_LINK',
          entity: 'CreativeIdea',
          id: idea.id,
          field: 'attachedSongIds',
          message: `Idea references non-existent song "${sId}"`,
          autoRepairable: true,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Detects orphaned references in a project backup
 */
export function detectOrphans(project: BhashaProjectBackup): {
  versions: string[];
  ideas: string[];
  vocabulary: string[];
  collections: string[];
} {
  const songs = Array.isArray(project.songs) ? project.songs : [];
  const lexicon = Array.isArray(project.lexicon) ? project.lexicon : [];
  const collections = Array.isArray(project.collections) ? project.collections : [];
  const versions = Array.isArray(project.versions) ? project.versions : [];
  const ideas = Array.isArray(project.ideas) ? project.ideas : [];

  const songIds = new Set(songs.map((s) => s.id));
  const lexiconWords = new Set(lexicon.map((w) => w.devanagari));
  const knownCollections = new Set(collections);

  const orphanedVersions: string[] = [];
  for (const v of versions) {
    if (!songIds.has(v.songId)) {
      orphanedVersions.push(v.id);
    }
  }

  const orphanedIdeaLinks: string[] = [];
  for (const idea of ideas) {
    if (idea.attachedSongIds && Array.isArray(idea.attachedSongIds)) {
      for (const sId of idea.attachedSongIds) {
        if (!songIds.has(sId)) {
          orphanedIdeaLinks.push(`${idea.id}->${sId}`);
        }
      }
    }
  }

  const orphanedVocab: string[] = [];
  for (const song of songs) {
    if (song.songVocabulary && Array.isArray(song.songVocabulary)) {
      for (const word of song.songVocabulary) {
        if (!lexiconWords.has(word)) {
          orphanedVocab.push(`${song.id}->${word}`);
        }
      }
    }
  }

  const orphanedCollectionTags: string[] = [];
  for (const word of lexicon) {
    if (word.collections && Array.isArray(word.collections)) {
      for (const c of word.collections) {
        if (!knownCollections.has(c)) {
          orphanedCollectionTags.push(`${word.devanagari}->${c}`);
        }
      }
    }
  }

  return {
    versions: orphanedVersions,
    ideas: orphanedIdeaLinks,
    vocabulary: orphanedVocab,
    collections: orphanedCollectionTags,
  };
}

/**
 * Safely repairs orphaned references without destroying user creative content
 */
export function repairOrphans(project: BhashaProjectBackup): {
  repairedProject: BhashaProjectBackup;
  repairs: string[];
} {
  const repairs: string[] = [];
  const songs = Array.isArray(project.songs) ? project.songs : [];
  const lexicon = Array.isArray(project.lexicon) ? project.lexicon : [];
  const collections = Array.isArray(project.collections) ? project.collections : [];
  const ideas = Array.isArray(project.ideas) ? project.ideas : [];

  const songIds = new Set(songs.map((s) => s.id));
  const activeCollections = new Set(collections);

  // 1. Repair Ideas (remove dangling song references, preserve the idea itself)
  const repairedIdeas = ideas.map((idea) => {
    if (!idea.attachedSongIds || !Array.isArray(idea.attachedSongIds)) return idea;
    const validSongs = idea.attachedSongIds.filter((sId) => songIds.has(sId));
    if (validSongs.length !== idea.attachedSongIds.length) {
      repairs.push(`Cleaned dangling song links from idea "${idea.title}"`);
      return { ...idea, attachedSongIds: validSongs };
    }
    return idea;
  });

  // 2. Ensure missing collection names exist in collections array
  for (const word of lexicon) {
    if (word.collections && Array.isArray(word.collections)) {
      for (const c of word.collections) {
        if (!activeCollections.has(c)) {
          activeCollections.add(c);
          repairs.push(`Added missing collection "${c}" referenced by word "${word.devanagari}"`);
        }
      }
    }
  }

  return {
    repairedProject: {
      ...project,
      ideas: repairedIdeas,
      collections: Array.from(activeCollections),
    },
    repairs,
  };
}

/**
 * Complete Project-Level Integrity Validator
 */
export function validateProjectIntegrity(project: any): ProjectIntegrityReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!project || typeof project !== 'object') {
    return {
      valid: false,
      schemaVersion: 0,
      errors: [{ code: 'INVALID_PROJECT_OBJECT', entity: 'Project', message: 'Project must be a JSON object', fatal: true }],
      warnings: [],
      orphans: { versions: [], ideas: [], vocabulary: [], collections: [] },
      stats: { totalSongs: 0, totalVersions: 0, totalLexiconWords: 0, totalCollections: 0, totalIdeas: 0 },
      isRepairable: false,
    };
  }

  // Schema Version Check
  const schemaVersion = typeof project.schemaVersion === 'number' ? project.schemaVersion : 1;
  if (project.schemaVersion !== undefined && typeof project.schemaVersion !== 'number') {
    errors.push({
      code: 'INVALID_SCHEMA_VERSION',
      entity: 'Project',
      field: 'schemaVersion',
      message: `schemaVersion must be a number, received ${typeof project.schemaVersion}`,
      fatal: true,
    });
  } else if (project.schemaVersion === undefined) {
    warnings.push({
      code: 'MISSING_SCHEMA_VERSION',
      entity: 'Project',
      field: 'schemaVersion',
      message: 'schemaVersion missing, assuming version 1',
      autoRepairable: true,
    });
  }

  // Songs Array Check
  if (!Array.isArray(project.songs)) {
    errors.push({ code: 'INVALID_SONGS_ARRAY', entity: 'Project', field: 'songs', message: 'songs must be an array', fatal: true });
  }

  const songIds = new Set<string>();
  const duplicateSongIds = new Set<string>();

  if (Array.isArray(project.songs)) {
    for (const song of project.songs) {
      if (song && song.id) {
        if (songIds.has(song.id)) {
          duplicateSongIds.add(song.id);
        } else {
          songIds.add(song.id);
        }
      }
      const sDiag = validateSong(song);
      errors.push(...sDiag.errors);
      warnings.push(...sDiag.warnings);
    }
  }

  if (duplicateSongIds.size > 0) {
    errors.push({
      code: 'DUPLICATE_SONG_IDS',
      entity: 'Project',
      field: 'songs',
      message: `Found duplicate song IDs: ${Array.from(duplicateSongIds).join(', ')}`,
      fatal: true,
    });
  }

  // Versions Array Check
  const versionIds = new Set<string>();
  if (Array.isArray(project.versions)) {
    for (const version of project.versions) {
      if (version && version.id) {
        if (versionIds.has(version.id)) {
          errors.push({
            code: 'DUPLICATE_VERSION_ID',
            entity: 'SongVersion',
            id: version.id,
            message: `Duplicate version ID "${version.id}"`,
            fatal: true,
          });
        } else {
          versionIds.add(version.id);
        }
      }
      const vDiag = validateVersion(version, songIds);
      errors.push(...vDiag.errors);
      warnings.push(...vDiag.warnings);
    }
  }

  // Lexicon Array Check
  const wordDevanagari = new Set<string>();
  if (Array.isArray(project.lexicon)) {
    for (const word of project.lexicon) {
      if (word && word.devanagari) {
        if (wordDevanagari.has(word.devanagari)) {
          warnings.push({
            code: 'DUPLICATE_SAVED_WORD',
            entity: 'SavedWord',
            id: word.id,
            message: `Duplicate saved word "${word.devanagari}" in lexicon`,
            autoRepairable: true,
          });
        } else {
          wordDevanagari.add(word.devanagari);
        }
      }
      const lDiag = validateLexiconEntry(word);
      errors.push(...lDiag.errors);
      warnings.push(...lDiag.warnings);
    }
  }

  // Ideas Array Check
  const ideaIds = new Set<string>();
  if (Array.isArray(project.ideas)) {
    for (const idea of project.ideas) {
      if (idea && idea.id) {
        if (ideaIds.has(idea.id)) {
          errors.push({
            code: 'DUPLICATE_IDEA_ID',
            entity: 'CreativeIdea',
            id: idea.id,
            message: `Duplicate idea ID "${idea.id}"`,
            fatal: true,
          });
        } else {
          ideaIds.add(idea.id);
        }
      }
      const iDiag = validateIdea(idea, songIds);
      errors.push(...iDiag.errors);
      warnings.push(...iDiag.warnings);
    }
  }

  // Collections Check
  if (project.collections && !Array.isArray(project.collections)) {
    warnings.push({
      code: 'INVALID_COLLECTIONS_TYPE',
      entity: 'Collection',
      field: 'collections',
      message: 'collections must be an array of strings',
      autoRepairable: true,
    });
  }

  const orphans = detectOrphans({
    schemaVersion,
    exportedAt: project.exportedAt || new Date().toISOString(),
    bhashaVersion: project.bhashaVersion || '1.0.0',
    songs: project.songs || [],
    versions: project.versions || [],
    lexicon: project.lexicon || [],
    collections: project.collections || [],
    ideas: project.ideas || [],
  });

  const fatalErrors = errors.filter((e) => e.fatal);

  return {
    valid: fatalErrors.length === 0,
    schemaVersion,
    errors,
    warnings,
    orphans,
    stats: {
      totalSongs: (project.songs || []).length,
      totalVersions: (project.versions || []).length,
      totalLexiconWords: (project.lexicon || []).length,
      totalCollections: (project.collections || []).length,
      totalIdeas: (project.ideas || []).length,
    },
    isRepairable: fatalErrors.length === 0 || errors.every((e) => e.code !== 'INVALID_JSON'),
  };
}
