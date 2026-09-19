/**
 * LocalStorage keys & safe serialization utilities
 * Hardened with corruption quarantine, diagnostics, and quota handling.
 */

export const STORAGE_KEYS = {
  SONGS: 'bhasha_songs_v1',
  ACTIVE_SONG_ID: 'bhasha_active_song_id_v1',
  SAVED_LEXICON: 'bhasha_lexicon_v1',
  VERSIONS: 'bhasha_versions_v1',
  IDEAS: 'bhasha_ideas_v1',
  COLLECTIONS: 'bhasha_collections_v1',
  RECENT_WORDS: 'bhasha_recent_words_v1',
  PREFERENCES: 'bhasha_preferences_v1',
  RECENT_SEARCHES: 'bhasha_recent_searches_v1',
  EMERGENCY_CORRUPT_PREFIX: 'bhasha_corrupt_backup_',
};

/**
 * Checks whether localStorage is available and writable
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const testKey = '__bhasha_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Quarantines corrupted storage content into an emergency backup key
 * to prevent permanent loss of unparseable raw user data.
 */
export function emergencyCorruptedBackup(key: string, rawContent: string): string {
  if (typeof window === 'undefined' || !window.localStorage) return '';
  const emergencyKey = `${STORAGE_KEYS.EMERGENCY_CORRUPT_PREFIX}${Date.now()}_${key}`;
  try {
    window.localStorage.setItem(emergencyKey, rawContent);
    console.warn(`[BHASHA STORAGE] Quarantined corrupted storage under emergency key: "${emergencyKey}"`);
    return emergencyKey;
  } catch (err) {
    console.error(`[BHASHA STORAGE] Failed to write emergency quarantine backup:`, err);
    return '';
  }
}

/**
 * Reads from storage with detailed corruption detection.
 * If data is corrupted, preserves the raw content and signals failure without overwriting.
 */
export function safeGetWithDiagnostics<T>(
  key: string,
  defaultValue: T
): { data: T; corrupted: boolean; error?: string; raw?: string; emergencyKey?: string } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { data: defaultValue, corrupted: false };
  }

  const raw = window.localStorage.getItem(key);
  if (raw === null || raw === undefined) {
    return { data: defaultValue, corrupted: false };
  }

  try {
    const parsed = JSON.parse(raw);
    return { data: parsed as T, corrupted: false };
  } catch (err: any) {
    const msg = `Syntax error parsing localStorage key "${key}": ${err?.message || 'Invalid JSON'}`;
    console.error(`[BHASHA STORAGE] ${msg}`);
    const emergencyKey = emergencyCorruptedBackup(key, raw);
    return {
      data: defaultValue,
      corrupted: true,
      error: msg,
      raw,
      emergencyKey,
    };
  }
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  const result = safeGetWithDiagnostics(key, defaultValue);
  return result.data;
}

export function setToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error: any) {
    console.error(`[BHASHA STORAGE] Error writing localStorage key "${key}":`, error);
    return false;
  }
}
