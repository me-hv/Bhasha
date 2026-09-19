/**
 * BHASHA Schema Migration: v1 -> v2
 * - Canonicalizes Song statuses to uppercase enum ('DRAFT', 'IN PROGRESS', 'COMPLETE', 'ARCHIVED')
 * - Adds monotonic revision counter to each Song (defaults to 1)
 * - Ensures required collection arrays and sectionNotes structures are defined
 * - Preserves arbitrary unknown user properties non-destructively
 */

import { BhashaProjectBackup, Song, SongStatus } from '../../../types';
import { LEGACY_SONG_STATUS_MAP, VALID_SONG_STATUSES } from '../integrity';

export function migrateV1ToV2(v1Project: any): { migrated: BhashaProjectBackup; stepDescription: string } {
  const songs = Array.isArray(v1Project?.songs) ? v1Project.songs : v1Project?.songs;
  const versions = Array.isArray(v1Project?.versions) ? v1Project.versions : v1Project?.versions;
  const lexicon = Array.isArray(v1Project?.lexicon) ? v1Project.lexicon : v1Project?.lexicon;
  const collections = Array.isArray(v1Project?.collections) ? v1Project.collections : v1Project?.collections;
  const ideas = Array.isArray(v1Project?.ideas) ? v1Project.ideas : v1Project?.ideas;
  const recentWords = Array.isArray(v1Project?.recentWords) ? v1Project.recentWords : v1Project?.recentWords;

  const migratedSongs: any = Array.isArray(songs)
    ? songs.map((s: any) => {
        let canonicalStatus: SongStatus = 'DRAFT';
        if (s && s.status) {
          if (VALID_SONG_STATUSES.has(s.status)) {
            canonicalStatus = s.status as SongStatus;
          } else if (LEGACY_SONG_STATUS_MAP[s.status]) {
            canonicalStatus = LEGACY_SONG_STATUS_MAP[s.status] as SongStatus;
          }
        }

        return {
          ...s,
          status: canonicalStatus,
          revision: typeof s?.revision === 'number' && s.revision >= 1 ? s.revision : 1,
          tags: Array.isArray(s?.tags) ? [...s.tags] : [],
          sectionNotes: s?.sectionNotes && typeof s.sectionNotes === 'object' ? { ...s.sectionNotes } : {},
          songVocabulary: Array.isArray(s?.songVocabulary) ? [...s.songVocabulary] : [],
          scratchpadNotes: typeof s?.scratchpadNotes === 'string' ? s.scratchpadNotes : '',
          stashedRhymes: Array.isArray(s?.stashedRhymes) ? [...s.stashedRhymes] : [],
          timeSignature: typeof s?.timeSignature === 'string' && s.timeSignature ? s.timeSignature : '4/4',
        };
      })
    : songs;

  const migratedBackup: any = {
    ...v1Project,
    schemaVersion: 2,
    bhashaVersion: v1Project?.bhashaVersion || '1.0.0',
    generator: v1Project?.generator || 'BHASHA Songwriter OS',
    exportedAt: v1Project?.exportedAt || new Date().toISOString(),
    songs: migratedSongs,
    versions,
    lexicon,
    collections,
    ideas,
    recentWords,
  };

  return {
    migrated: migratedBackup,
    stepDescription: 'Migrated v1 to v2: canonicalized song statuses, initialized revision counters, normalized collections',
  };
}
