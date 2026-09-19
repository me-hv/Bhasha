/**
 * BHASHA Sequential Schema Migration Dispatcher
 * Dispatches raw projects through sequential migrations up to CURRENT_SCHEMA_VERSION.
 * Safely rejects unsupported future schema versions.
 */

import { BhashaProjectBackup, MigrationResult } from '../../../types';
import { migrateV1ToV2 } from './v1_to_v2';

export const CURRENT_SCHEMA_VERSION = 2;
export const MAX_SUPPORTED_SCHEMA_VERSION = 2;

export function migrateProject(rawInput: unknown): MigrationResult {
  let projectObj: any;

  if (typeof rawInput === 'string') {
    try {
      projectObj = JSON.parse(rawInput);
    } catch (err: any) {
      return {
        success: false,
        fromVersion: 0,
        toVersion: CURRENT_SCHEMA_VERSION,
        error: `JSON parse failed during migration: ${err?.message || 'Syntax error'}`,
        stepsApplied: [],
      };
    }
  } else if (rawInput && typeof rawInput === 'object') {
    projectObj = JSON.parse(JSON.stringify(rawInput)); // Deep clone to avoid mutating input
  } else {
    return {
      success: false,
      fromVersion: 0,
      toVersion: CURRENT_SCHEMA_VERSION,
      error: 'Invalid input: Project data must be an object or JSON string',
      stepsApplied: [],
    };
  }

  const initialVersion =
    typeof projectObj.schemaVersion === 'number' && projectObj.schemaVersion >= 1
      ? projectObj.schemaVersion
      : 1;

  // Unsupported Future Schema Version Guard
  if (initialVersion > MAX_SUPPORTED_SCHEMA_VERSION) {
    return {
      success: false,
      fromVersion: initialVersion,
      toVersion: CURRENT_SCHEMA_VERSION,
      error: `Unsupported future schema version ${initialVersion} (maximum supported is ${MAX_SUPPORTED_SCHEMA_VERSION}). Please update BHASHA to import this backup.`,
      stepsApplied: [],
    };
  }

  let currentData = projectObj;
  let currentVersion = initialVersion;
  const stepsApplied: string[] = [];

  // Migration Chain: v1 -> v2
  if (currentVersion === 1 && CURRENT_SCHEMA_VERSION >= 2) {
    const res = migrateV1ToV2(currentData);
    currentData = res.migrated;
    stepsApplied.push(res.stepDescription);
    currentVersion = 2;
  }

  // Future migration steps (e.g. v2 -> v3) will be appended here

  return {
    success: true,
    fromVersion: initialVersion,
    toVersion: currentVersion,
    data: currentData as BhashaProjectBackup,
    stepsApplied,
  };
}
