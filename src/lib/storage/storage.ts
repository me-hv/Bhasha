/**
 * LocalStorage keys & safe serialization utilities
 */

export const STORAGE_KEYS = {
  SONGS: 'bhasha_songs_v1',
  ACTIVE_SONG_ID: 'bhasha_active_song_id_v1',
  SAVED_LEXICON: 'bhasha_lexicon_v1',
  PREFERENCES: 'bhasha_preferences_v1',
  RECENT_SEARCHES: 'bhasha_recent_searches_v1',
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}
