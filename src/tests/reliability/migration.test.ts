/**
 * BHASHA Phase 11 Reliability Suite: Schema Migration Framework
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import { migrateProject, CURRENT_SCHEMA_VERSION, MAX_SUPPORTED_SCHEMA_VERSION } from '../../lib/storage/migrations';
import { BhashaProjectBackup } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Sequential Schema Migration Test Suite\n');

// 1. v1 to v2 Migration
{
  const v1Backup = {
    schemaVersion: 1,
    exportedAt: '2026-01-01T00:00:00.000Z',
    bhashaVersion: '1.0.0',
    songs: [
      {
        id: 'song-v1',
        title: 'Legacy Song',
        content: '[Verse 1]\nLegacy lyrics',
        bpm: 90,
        key: 'Am',
        status: 'draft', // lowercase legacy status
        tags: ['Old'],
        // missing revision
      },
      {
        id: 'song-v1-finished',
        title: 'Finished Song',
        content: '[Hook]\nCompleted hook',
        bpm: 100,
        key: 'Cm',
        status: 'finished', // non-canonical legacy status
      },
    ],
    versions: [],
    lexicon: [
      {
        id: 'w-1',
        devanagari: 'कलम',
        roman: 'kalam',
        meaning: 'Pen',
      },
    ],
    collections: [],
    ideas: [],
  };

  const result = migrateProject(v1Backup);
  assert(result.success, 'v1 to v2 migration should succeed');
  assert(result.fromVersion === 1, 'Source version was 1');
  assert(result.toVersion === CURRENT_SCHEMA_VERSION, `Target version should be ${CURRENT_SCHEMA_VERSION}`);
  assert(result.stepsApplied.length > 0, 'Should record migration steps applied');

  const migratedData = result.data as BhashaProjectBackup;
  assert(migratedData.schemaVersion === 2, 'Output schemaVersion is 2');
  assert(migratedData.songs[0].status === 'DRAFT', 'Legacy "draft" migrated to uppercase "DRAFT"');
  assert(migratedData.songs[1].status === 'COMPLETE', 'Legacy "finished" migrated to uppercase "COMPLETE"');
  assert(migratedData.songs[0].revision === 1, 'Missing revision counter initialized to 1');
  assert(Array.isArray(migratedData.songs[0].songVocabulary), 'Ensured songVocabulary array exists');
  assert(typeof migratedData.songs[0].sectionNotes === 'object', 'Ensured sectionNotes object exists');

  console.log('  ✓ 1. v1 to v2 sequential migration passed with status & revision normalization');
}

// 2. Unknown Property Preservation (Non-destructive migration)
{
  const v1WithCustomFields = {
    schemaVersion: 1,
    customStudioTheme: 'cyberpunk-dark',
    customHardwareMidiMapping: { pad1: 'record', pad2: 'metronome' },
    songs: [
      {
        id: 'song-custom',
        title: 'Custom Track',
        content: 'Lyrics',
        customVocalChainPreset: 'tape-saturation-v2',
        customProducerTag: 'AudioByHarry',
      },
    ],
    versions: [],
    lexicon: [],
    collections: [],
    ideas: [],
  };

  const result = migrateProject(v1WithCustomFields);
  assert(result.success, 'Migration should succeed');
  const migrated = result.data as any;
  assert(migrated.customStudioTheme === 'cyberpunk-dark', 'Root level custom fields preserved');
  assert(migrated.customHardwareMidiMapping.pad1 === 'record', 'Root nested custom objects preserved');
  assert(migrated.songs[0].customVocalChainPreset === 'tape-saturation-v2', 'Song entity custom fields preserved');
  assert(migrated.songs[0].customProducerTag === 'AudioByHarry', 'Song custom properties untouched');

  console.log('  ✓ 2. Unknown custom user properties preserved non-destructively');
}

// 3. Rejection of Unsupported Future Schema Versions
{
  const futureBackup = {
    schemaVersion: 99,
    exportedAt: '2030-01-01T00:00:00.000Z',
    songs: [{ id: 'future-song', title: 'Future Track', content: 'Future lyrics' }],
  };

  const result = migrateProject(futureBackup);
  assert(!result.success, 'Future schema version 99 must be rejected');
  assert(
    result.error?.includes(`Unsupported future schema version 99`),
    'Error message should explain unsupported future version'
  );

  console.log('  ✓ 3. Rejection of unsupported future schema version verified');
}

// 4. Idempotent Migration on Already v2 Project
{
  const v2Project = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    bhashaVersion: '1.0.0',
    songs: [
      {
        id: 'v2-song',
        title: 'V2 Track',
        content: 'V2 content',
        bpm: 92,
        key: 'Am',
        timeSignature: '4/4',
        status: 'IN PROGRESS',
        revision: 3,
        tags: ['Boom Bap'],
      },
    ],
    versions: [],
    lexicon: [],
    collections: [],
    ideas: [],
  };

  const res1 = migrateProject(v2Project);
  assert(res1.success, 'Migration of v2 project should succeed');
  assert(res1.fromVersion === 2 && res1.toVersion === 2, 'No-op migration from v2 to v2');
  assert(res1.stepsApplied.length === 0, '0 migration steps needed for current version');
  assert(res1.data?.songs[0].revision === 3, 'Existing revision counter untouched');

  console.log('  ✓ 4. Idempotent execution on current schema verified');
}

console.log('\n✅ ALL SCHEMA MIGRATION TESTS PASSED!\n');
