import { Song, SongVersion, SongStatus } from '../../types';
import { STORAGE_KEYS, getFromStorage, setToStorage } from './storage';

export const INITIAL_SAMPLE_SONG: Song = {
  id: 'kaali-raat-demo',
  title: 'KAALI RAAT',
  content: `[Verse 1]
रात में जागता, सवाल मेरे साथ
शहर सो रहा लेकिन आँखों में रात
काली ये रातें और गहरी ये बातें
जेबें थीं खाली पर भरे थे इरादे

[Hook]
ये शहर कंक्रीट का यहाँ कोई दिल नहीं
दौड़ रहे सब अंधी राहों में कोई मंज़िल नहीं
लफ्जों में बारूद और बातों में वजन
कलम चले मेरी जैसे कांपे ये वतन

[Verse 2]
किस्मत की लकीरें खुद हाथों से खींची
सर था उठाया जब दुनिया ने नीची
जो पूछते थे कल तक मेरी औकात क्या
आज उनके ही घर में मेरी ही बात है`,
  bpm: 92,
  key: 'Am',
  timeSignature: '4/4',
  status: 'IN PROGRESS',
  tags: ['Boom Bap', 'Midnight', 'Underground'],
  notes: `Core Concept: Midnight reflection in an unyielding city.\nTheme: Self-reliance, rising from zero.\nHook Delivery: Aggressive, punctuated emphasis on every 4th beat.`,
  sectionNotes: {
    'Verse 1': 'Keep vocal delivery laid-back and intimate.',
    'Hook': 'High energy, double voice layering on "बारूद" and "वजन".',
  },
  songVocabulary: ['रात', 'सन्नाटा', 'जज़्बात', 'हालात', 'बरसात', 'औकात'],
  scratchpadNotes: `Key themes: Midnight hunger, independent hustle, fake friends.
Anchor rhyme words: रात, बात, साथ, हाथ, हालात, जज़्बात.`,
  stashedRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'औकात'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// =========================================================================
// SONGS CRUD & ARCHIVING
// =========================================================================

export function getStoredSongs(): Song[] {
  const songs = getFromStorage<Song[]>(STORAGE_KEYS.SONGS, []);
  if (!songs || songs.length === 0) {
    setToStorage(STORAGE_KEYS.SONGS, [INITIAL_SAMPLE_SONG]);
    return [INITIAL_SAMPLE_SONG];
  }
  return songs;
}

export function saveSong(song: Song): Song[] {
  const songs = getStoredSongs();
  const index = songs.findIndex(s => s.id === song.id);
  
  const updatedSong: Song = {
    ...song,
    updatedAt: new Date().toISOString(),
  };

  let newSongs: Song[];
  if (index >= 0) {
    newSongs = [...songs];
    newSongs[index] = updatedSong;
  } else {
    newSongs = [updatedSong, ...songs];
  }

  setToStorage(STORAGE_KEYS.SONGS, newSongs);
  return newSongs;
}

export function deleteSong(songId: string): Song[] {
  const songs = getStoredSongs().filter(s => s.id !== songId);
  setToStorage(STORAGE_KEYS.SONGS, songs);
  
  // Also clean up versions for deleted song
  const versions = getStoredVersions().filter(v => v.songId !== songId);
  setToStorage(STORAGE_KEYS.VERSIONS, versions);

  return songs;
}

export function archiveSong(songId: string): Song[] {
  const songs = getStoredSongs();
  const index = songs.findIndex(s => s.id === songId);
  if (index === -1) return songs;

  const updatedSong: Song = {
    ...songs[index],
    status: 'ARCHIVED',
    updatedAt: new Date().toISOString(),
  };

  const newSongs = [...songs];
  newSongs[index] = updatedSong;
  setToStorage(STORAGE_KEYS.SONGS, newSongs);
  return newSongs;
}

export function restoreSong(songId: string): Song[] {
  const songs = getStoredSongs();
  const index = songs.findIndex(s => s.id === songId);
  if (index === -1) return songs;

  const updatedSong: Song = {
    ...songs[index],
    status: 'IN PROGRESS',
    updatedAt: new Date().toISOString(),
  };

  const newSongs = [...songs];
  newSongs[index] = updatedSong;
  setToStorage(STORAGE_KEYS.SONGS, newSongs);
  return newSongs;
}

export function duplicateSong(songId: string, customTitle?: string): Song | null {
  const songs = getStoredSongs();
  const source = songs.find(s => s.id === songId);
  if (!source) return null;

  // Deep copy everything to avoid shared mutable object references
  const duplicated: Song = {
    id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: customTitle || `${source.title} (Copy)`,
    content: source.content,
    bpm: source.bpm,
    key: source.key,
    timeSignature: source.timeSignature || '4/4',
    status: 'DRAFT',
    genre: source.genre,
    mood: source.mood,
    tags: [...(source.tags || [])],
    notes: source.notes ? `${source.notes}` : '',
    sectionNotes: source.sectionNotes ? { ...source.sectionNotes } : {},
    songVocabulary: source.songVocabulary ? [...source.songVocabulary] : [],
    scratchpadNotes: source.scratchpadNotes ? `${source.scratchpadNotes}` : '',
    stashedRhymes: source.stashedRhymes ? [...source.stashedRhymes] : [],
    pinnedPromptId: source.pinnedPromptId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newSongs = [duplicated, ...songs];
  setToStorage(STORAGE_KEYS.SONGS, newSongs);
  return duplicated;
}

export function createNewSong(title = 'UNTITLED TRACK', bpm = 92, key = 'Am'): Song {
  const newSong: Song = {
    id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    content: `[Verse 1]\n`,
    bpm,
    key,
    timeSignature: '4/4',
    status: 'DRAFT',
    tags: ['New Track'],
    notes: '',
    sectionNotes: {},
    songVocabulary: [],
    scratchpadNotes: '',
    stashedRhymes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const songs = getStoredSongs();
  setToStorage(STORAGE_KEYS.SONGS, [newSong, ...songs]);
  return newSong;
}

export function searchSongs(songs: Song[], query: string): Song[] {
  if (!query.trim()) return songs;
  const q = query.toLowerCase().trim();
  return songs.filter(song => {
    if (song.title.toLowerCase().includes(q)) return true;
    if (song.mood && song.mood.toLowerCase().includes(q)) return true;
    if (song.genre && song.genre.toLowerCase().includes(q)) return true;
    if (song.tags && song.tags.some(t => t.toLowerCase().includes(q))) return true;
    if (song.content && song.content.toLowerCase().includes(q)) return true;
    if (song.notes && song.notes.toLowerCase().includes(q)) return true;
    return false;
  });
}

export function filterSongsByStatus(songs: Song[], status: 'ALL' | SongStatus): Song[] {
  if (status === 'ALL') {
    return songs.filter(s => s.status !== 'ARCHIVED');
  }
  return songs.filter(s => s.status === status);
}

// =========================================================================
// SONG VERSIONS & SNAPSHOTS
// =========================================================================

export function getStoredVersions(songId?: string): SongVersion[] {
  const versions = getFromStorage<SongVersion[]>(STORAGE_KEYS.VERSIONS, []);
  if (songId) {
    return versions.filter(v => v.songId === songId);
  }
  return versions;
}

export function saveVersionSnapshot(
  song: Song,
  label: string,
  isAutoSafetySnapshot: boolean = false
): SongVersion {
  const currentVersions = getFromStorage<SongVersion[]>(STORAGE_KEYS.VERSIONS, []);
  
  const newSnapshot: SongVersion = {
    id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    songId: song.id,
    label: label.trim() || `Draft ${new Date().toLocaleTimeString()}`,
    timestamp: new Date().toISOString(),
    content: song.content || '',
    notes: song.notes,
    sectionNotes: song.sectionNotes ? { ...song.sectionNotes } : {},
    songVocabulary: song.songVocabulary ? [...song.songVocabulary] : [],
    bpm: song.bpm,
    key: song.key,
    tags: song.tags ? [...song.tags] : [],
    isAutoSafetySnapshot,
  };

  const updatedVersions = [newSnapshot, ...currentVersions];
  setToStorage(STORAGE_KEYS.VERSIONS, updatedVersions);
  return newSnapshot;
}

export function deleteVersionSnapshot(versionId: string): SongVersion[] {
  const currentVersions = getFromStorage<SongVersion[]>(STORAGE_KEYS.VERSIONS, []);
  const filtered = currentVersions.filter(v => v.id !== versionId);
  setToStorage(STORAGE_KEYS.VERSIONS, filtered);
  return filtered;
}

/**
 * Restores an earlier version snapshot.
 * CRITICAL SAFETY REQUIREMENT: Automatically creates a safety snapshot of the active song before restore.
 */
export function restoreVersionSnapshot(
  snapshotId: string
): { restoredSong: Song; safetySnapshot: SongVersion } | null {
  const versions = getStoredVersions();
  const targetSnapshot = versions.find(v => v.id === snapshotId);
  if (!targetSnapshot) return null;

  const songs = getStoredSongs();
  const currentSong = songs.find(s => s.id === targetSnapshot.songId);
  if (!currentSong) return null;

  // 1. Create automatic safety snapshot
  const safetyTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const safetySnapshot = saveVersionSnapshot(
    currentSong,
    `Before restore (${safetyTimestamp})`,
    true
  );

  // 2. Restore song from target snapshot
  const restoredSong: Song = {
    ...currentSong,
    content: targetSnapshot.content,
    notes: targetSnapshot.notes !== undefined ? targetSnapshot.notes : currentSong.notes,
    sectionNotes: targetSnapshot.sectionNotes !== undefined ? { ...targetSnapshot.sectionNotes } : currentSong.sectionNotes,
    songVocabulary: targetSnapshot.songVocabulary !== undefined ? [...targetSnapshot.songVocabulary] : currentSong.songVocabulary,
    bpm: targetSnapshot.bpm || currentSong.bpm,
    key: targetSnapshot.key || currentSong.key,
    updatedAt: new Date().toISOString(),
  };

  saveSong(restoredSong);
  return { restoredSong, safetySnapshot };
}
