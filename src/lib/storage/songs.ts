import { Song } from '../../types';
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
  status: 'In Progress',
  tags: ['Boom Bap', 'Midnight', 'Underground'],
  scratchpadNotes: `Key themes: Midnight hunger, independent hustle, fake friends.
Anchor rhyme words: रात, बात, साथ, हाथ, हालात, जज़्बात.`,
  stashedRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'औकात'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function getStoredSongs(): Song[] {
  const songs = getFromStorage<Song[]>(STORAGE_KEYS.SONGS, []);
  if (!songs || songs.length === 0) {
    // Seed initial song
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
  return songs;
}

export function duplicateSong(songId: string): Song | null {
  const songs = getStoredSongs();
  const source = songs.find(s => s.id === songId);
  if (!source) return null;

  const duplicated: Song = {
    ...source,
    id: `song-${Date.now()}`,
    title: `${source.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newSongs = [duplicated, ...songs];
  setToStorage(STORAGE_KEYS.SONGS, newSongs);
  return duplicated;
}

export function createNewSong(title = 'UNTITLED TRACK', bpm = 92, key = 'Am'): Song {
  const newSong: Song = {
    id: `song-${Date.now()}`,
    title,
    content: `[Verse 1]\n`,
    bpm,
    key,
    timeSignature: '4/4',
    status: 'Draft',
    tags: ['New Track'],
    scratchpadNotes: '',
    stashedRhymes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const songs = getStoredSongs();
  setToStorage(STORAGE_KEYS.SONGS, [newSong, ...songs]);
  return newSong;
}
