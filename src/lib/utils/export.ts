import { Song, BhashaProjectBackup } from '../../types';

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

import { getStoredSongs, getStoredVersions } from '../storage/songs';
import { getStoredLexicon, getStoredCollections, getRecentWords } from '../storage/lexicon';
import { getStoredIdeas } from '../storage/ideas';
import { STORAGE_KEYS, setToStorage } from '../storage/storage';

export function createProjectBackup(): BhashaProjectBackup {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    bhashaVersion: '1.0.0',
    songs: getStoredSongs(),
    versions: getStoredVersions(),
    lexicon: getStoredLexicon(),
    collections: getStoredCollections(),
    ideas: getStoredIdeas(),
    recentWords: getRecentWords(),
  };
}

export function exportProjectJson(backup?: BhashaProjectBackup): string {
  const data = backup || createProjectBackup();
  return JSON.stringify(data, null, 2);
}

export function validateAndImportProjectJson(
  jsonStr: string,
  applyToStorage: boolean = true
): {
  success: boolean;
  data?: BhashaProjectBackup;
  error?: string;
  counts?: { songs: number; versions: number; lexicon: number; ideas: number };
} {
  try {
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON: Project backup must be a JSON object.' };
    }

    if (typeof parsed.schemaVersion !== 'number' || parsed.schemaVersion < 1) {
      return { success: false, error: 'Invalid or missing schemaVersion in project backup.' };
    }

    // Validate songs
    if (!Array.isArray(parsed.songs)) {
      return { success: false, error: 'Invalid songs format: must be an array.' };
    }

    for (const s of parsed.songs) {
      if (!s.id || !s.title || typeof s.content !== 'string') {
        return { success: false, error: `Malformed song entry in backup: missing id, title or content.` };
      }
    }

    // Validate lexicon if present
    const lexicon = Array.isArray(parsed.lexicon) ? parsed.lexicon : [];
    for (const w of lexicon) {
      if (!w.devanagari) {
        return { success: false, error: 'Malformed lexicon entry: missing devanagari field.' };
      }
    }

    // Validate versions if present
    const versions = Array.isArray(parsed.versions) ? parsed.versions : [];
    for (const v of versions) {
      if (!v.id || !v.songId || typeof v.content !== 'string') {
        return { success: false, error: 'Malformed version snapshot entry: missing id, songId or content.' };
      }
    }

    // Validate ideas if present
    const ideas = Array.isArray(parsed.ideas) ? parsed.ideas : [];
    for (const idea of ideas) {
      if (!idea.id || !idea.title) {
        return { success: false, error: 'Malformed idea entry: missing id or title.' };
      }
    }

    const backup: BhashaProjectBackup = {
      schemaVersion: parsed.schemaVersion,
      exportedAt: parsed.exportedAt || new Date().toISOString(),
      bhashaVersion: parsed.bhashaVersion || '1.0.0',
      songs: parsed.songs,
      versions,
      lexicon,
      collections: Array.isArray(parsed.collections) ? parsed.collections : [],
      ideas,
      recentWords: Array.isArray(parsed.recentWords) ? parsed.recentWords : [],
    };

    if (applyToStorage) {
      setToStorage(STORAGE_KEYS.SONGS, backup.songs);
      setToStorage(STORAGE_KEYS.VERSIONS, backup.versions);
      setToStorage(STORAGE_KEYS.SAVED_LEXICON, backup.lexicon);
      setToStorage(STORAGE_KEYS.COLLECTIONS, backup.collections);
      setToStorage(STORAGE_KEYS.IDEAS, backup.ideas);
      if (backup.recentWords) {
        setToStorage(STORAGE_KEYS.RECENT_WORDS, backup.recentWords);
      }
    }

    return {
      success: true,
      data: backup,
      counts: {
        songs: backup.songs.length,
        versions: backup.versions.length,
        lexicon: backup.lexicon.length,
        ideas: backup.ideas.length,
      },
    };
  } catch (err: any) {
    return { success: false, error: `Failed to parse project JSON: ${err?.message || 'Syntax error'}` };
  }
}
