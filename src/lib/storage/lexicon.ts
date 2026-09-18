import { SavedWord, WordEntry } from '../../types';
import { STORAGE_KEYS, getFromStorage, setToStorage } from './storage';
import { WORDS_DATABASE } from '../../data/words';
import { getStoredSongs, saveSong } from './songs';

export const DEFAULT_COLLECTIONS = [
  'NIGHT',
  'EMOTIONS',
  'DELHI',
  'LOVE',
  'ANGER',
  'STREET',
  'MONEY',
  'SPIRITUAL',
  'TECHNICAL',
  'HOOK WORDS',
];

export const INITIAL_SAMPLE_LEXICON: SavedWord[] = [
  {
    id: 'fanaa',
    devanagari: 'फ़ना',
    roman: 'fanaa',
    meaning: 'Self-destruction in love/art, mortal dissolution, transcendence',
    pronunciation: '/fəˈnaː/',
    notes: 'Use for introspective bridge on total devotion to the craft',
    personalNote: 'Use for introspective bridge on total devotion to the craft',
    tags: ['Philosophy', 'Deep', 'Spiritual'],
    collections: ['SPIRITUAL', 'EMOTIONS'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['गुनाह', 'पनाह', 'सफ़ा', 'दुआ', 'हवा', 'जुदा', 'खुदा'],
    relatedImagery: ['राख', 'शमा-परवाना', 'आग', 'हवा'],
  },
  {
    id: 'kainaat',
    devanagari: 'कायनात',
    roman: 'kainaat',
    meaning: 'Universe, cosmos, entire creation conspiring for your dream',
    pronunciation: '/kaːjˈnaːt/',
    notes: 'Cosmic rhyme pair with जज़्बात and हालात in hook',
    personalNote: 'Cosmic rhyme pair with जज़्बात and हालात in hook',
    tags: ['Cosmic', 'Ambition', 'Vision'],
    collections: ['HOOK WORDS', 'SPIRITUAL'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'औकात'],
    relatedImagery: ['सितारे', 'आकाशगंगा', 'सूरज', 'चाँद'],
  },
  {
    id: 'tanhai',
    devanagari: 'तन्हाई',
    roman: 'tanhai',
    meaning: 'Solitude, loneliness, creative isolation in the midnight hours',
    pronunciation: '/t̪ənˈɦaːiː/',
    notes: 'Classic midnight rap theme. Pairs well with गहराई and सच्चाई',
    personalNote: 'Classic midnight rap theme. Pairs well with गहराई and सच्चाई',
    tags: ['Dark', 'Midnight', 'Loneliness'],
    collections: ['NIGHT', 'EMOTIONS'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['गहराई', 'सच्चाई', 'रुसवाई', 'परछाई', 'ऊंचाई'],
    relatedImagery: ['कमरे की छत', 'धुआं', 'सिगरेट', 'खिड़की'],
  },
  {
    id: 'junoon',
    devanagari: 'जुनून',
    roman: 'junoon',
    meaning: 'Obsession, burning passion, madness for greatness',
    pronunciation: '/d͡ʒʊˈnuːn/',
    notes: 'High energy aggressive punchline anchor',
    personalNote: 'High energy aggressive punchline anchor',
    tags: ['Energy', 'Hustle', 'Hardcore'],
    collections: ['STREET', 'MONEY'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['सुकून', 'खून', 'कानून'],
    relatedImagery: ['आग', 'खून', 'पसीना', 'रात-दिन'],
  },
  {
    id: 'viraasat',
    devanagari: 'विरासत',
    roman: 'viraasat',
    meaning: 'Heritage, legacy, ancestral wisdom and eternal footprint',
    pronunciation: '/ʋɪˈraː.sət̪/',
    notes: 'Legacy track bar: पैसे की नहीं कलम की छोड़ूँगा विरासत',
    personalNote: 'Legacy track bar: पैसे की नहीं कलम की छोड़ूँगा विरासत',
    tags: ['Legacy', 'Wisdom'],
    collections: ['SPIRITUAL'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['हिरासत', 'सियासत', 'रियासत'],
    relatedImagery: ['ताज', 'किताब', 'पुरखे', 'मिट्टी'],
  },
  {
    id: 'zehn',
    devanagari: 'ज़हन',
    roman: 'zehn',
    meaning: 'Consciousness, sub-conscious mind, deep psyche',
    pronunciation: '/zɛɦn/',
    notes: 'Subtle psychological imagery',
    personalNote: 'Subtle psychological imagery',
    tags: ['Introspective', 'Philosophy'],
    collections: ['EMOTIONS'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['दहन', 'सहन', 'बहन'],
    relatedImagery: ['विचार', 'अंधेरा कमरा', 'सिगरेट'],
  },
  {
    id: 'sukoon',
    devanagari: 'सुकून',
    roman: 'sukoon',
    meaning: 'Peace, tranquility, serenity of soul, mental calm',
    pronunciation: '/sʊˈkuːn/',
    notes: 'Contrast word against hustle, money and sleepless nights',
    personalNote: 'Contrast word against hustle, money and sleepless nights',
    tags: ['Peace', 'Introspective'],
    collections: ['NIGHT', 'EMOTIONS'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['जुनून', 'खून', 'कानून'],
    relatedImagery: ['रात', 'हवा', 'चाँद', 'सांस'],
  },
  {
    id: 'baghaawat',
    devanagari: 'बग़ावत',
    roman: 'baghaawat',
    meaning: 'Rebellion, mutiny, standing against oppressive norms',
    pronunciation: '/bəˈɣaː.ʋət̪/',
    notes: 'Political / protest hip-hop anchor',
    personalNote: 'Political / protest hip-hop anchor',
    tags: ['Rebellion', 'Street', 'Raw'],
    collections: ['STREET', 'ANGER'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['अदावत', 'सखावत', 'रुकावट', 'बनावट'],
    relatedImagery: ['मशाल', 'मुट्ठी', 'जंजीरें'],
  },
  {
    id: 'talaash',
    devanagari: 'तलाश',
    roman: 'talaash',
    meaning: 'Quest, search, perpetual hunt for truth, peace, identity',
    pronunciation: '/t̪əˈlaːʃ/',
    notes: 'Search for self in a crowded city',
    personalNote: 'Search for self in a crowded city',
    tags: ['Journey', 'Deep'],
    collections: ['DELHI', 'EMOTIONS'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['तराश', 'बदमाश', 'लाश', 'निराश'],
    relatedImagery: ['रास्ता', 'रेगिस्तान', 'आँखें'],
  },
  {
    id: 'muqaddar',
    devanagari: 'मुक़द्दर',
    roman: 'muqaddar',
    meaning: 'Destiny, fate, predetermined decree written in stars',
    pronunciation: '/mʊˈqəd̪.d̪ər/',
    notes: 'Use with समंदर and सिकंदर',
    personalNote: 'Use with समंदर and सिकंदर',
    tags: ['Fate', 'Defiance'],
    collections: ['HOOK WORDS', 'STREET'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['समंदर', 'सिकंदर', 'कलंदर', 'अंदर'],
    relatedImagery: ['हाथ की लकीरें', 'सितारे', 'आसमान'],
  }
];

// =========================================================================
// LEXICON CRUD
// =========================================================================

export function getStoredLexicon(): SavedWord[] {
  const words = getFromStorage<SavedWord[]>(STORAGE_KEYS.SAVED_LEXICON, []);
  if (!words || words.length === 0) {
    setToStorage(STORAGE_KEYS.SAVED_LEXICON, INITIAL_SAMPLE_LEXICON);
    return INITIAL_SAMPLE_LEXICON;
  }
  return words;
}

export function saveWordToLexicon(
  wordOrEntry: Partial<SavedWord> & { devanagari: string }
): SavedWord[] {
  const current = getStoredLexicon();
  const existingIndex = current.findIndex(w => w.devanagari === wordOrEntry.devanagari);

  // Look up default data if available in WORDS_DATABASE
  const dbWord = WORDS_DATABASE.find(w => w.devanagari === wordOrEntry.devanagari);

  const newEntry: SavedWord = {
    id: wordOrEntry.id || dbWord?.id || `word-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    devanagari: wordOrEntry.devanagari,
    roman: wordOrEntry.roman || dbWord?.roman || wordOrEntry.devanagari,
    meaning: wordOrEntry.meaning || dbWord?.meaning || '',
    pronunciation: wordOrEntry.pronunciation || dbWord?.pronunciation || '',
    notes: wordOrEntry.notes || wordOrEntry.personalNote || '',
    personalNote: wordOrEntry.personalNote || wordOrEntry.notes || '',
    tags: wordOrEntry.tags || dbWord?.moods || ['Custom'],
    collections: wordOrEntry.collections || ['HOOK WORDS'],
    savedAt: new Date().toISOString(),
    sourceSongId: wordOrEntry.sourceSongId,
    sourceContext: wordOrEntry.sourceContext,
    perfectRhymes: wordOrEntry.perfectRhymes || dbWord?.perfectRhymes || [],
    strongRhymes: wordOrEntry.strongRhymes || dbWord?.strongRhymes || [],
    nearRhymes: wordOrEntry.nearRhymes || dbWord?.nearRhymes || [],
    relatedImagery: wordOrEntry.relatedImagery || dbWord?.relatedImagery || [],
  };

  let updated: SavedWord[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...updated[existingIndex], ...newEntry };
  } else {
    updated = [newEntry, ...current];
  }

  setToStorage(STORAGE_KEYS.SAVED_LEXICON, updated);
  recordWordInteraction(wordOrEntry.devanagari);
  return updated;
}

export function removeWordFromLexicon(devanagari: string): SavedWord[] {
  const current = getStoredLexicon().filter(w => w.devanagari !== devanagari);
  setToStorage(STORAGE_KEYS.SAVED_LEXICON, current);
  return current;
}

export function isWordSavedInLexicon(devanagari: string): boolean {
  const current = getStoredLexicon();
  return current.some(w => w.devanagari === devanagari);
}

// =========================================================================
// LEXICON COLLECTIONS (Many-to-Many)
// =========================================================================

export function getStoredCollections(): string[] {
  const custom = getFromStorage<string[]>(STORAGE_KEYS.COLLECTIONS, []);
  const combined = Array.from(new Set([...DEFAULT_COLLECTIONS, ...custom]));
  return combined;
}

export function createCollection(collectionName: string): string[] {
  const trimmed = collectionName.trim().toUpperCase();
  if (!trimmed) return getStoredCollections();

  const custom = getFromStorage<string[]>(STORAGE_KEYS.COLLECTIONS, []);
  if (!custom.includes(trimmed) && !DEFAULT_COLLECTIONS.includes(trimmed)) {
    const updated = [...custom, trimmed];
    setToStorage(STORAGE_KEYS.COLLECTIONS, updated);
    return Array.from(new Set([...DEFAULT_COLLECTIONS, ...updated]));
  }
  return getStoredCollections();
}

export function deleteCollection(collectionName: string): string[] {
  const trimmed = collectionName.trim().toUpperCase();
  const custom = getFromStorage<string[]>(STORAGE_KEYS.COLLECTIONS, []).filter(c => c !== trimmed);
  setToStorage(STORAGE_KEYS.COLLECTIONS, custom);

  // Also remove collection tag from saved words
  const words = getStoredLexicon();
  let modified = false;
  const updatedWords = words.map(w => {
    if (w.collections && w.collections.includes(trimmed)) {
      modified = true;
      return {
        ...w,
        collections: w.collections.filter(c => c !== trimmed),
      };
    }
    return w;
  });

  if (modified) {
    setToStorage(STORAGE_KEYS.SAVED_LEXICON, updatedWords);
  }

  return Array.from(new Set([...DEFAULT_COLLECTIONS, ...custom]));
}

export function toggleWordCollection(devanagari: string, collectionName: string): SavedWord[] {
  const words = getStoredLexicon();
  const trimmedCollection = collectionName.trim().toUpperCase();

  const updated = words.map(w => {
    if (w.devanagari === devanagari) {
      const currentCollections = w.collections || [];
      const hasCollection = currentCollections.includes(trimmedCollection);
      const newCollections = hasCollection
        ? currentCollections.filter(c => c !== trimmedCollection)
        : [...currentCollections, trimmedCollection];

      return { ...w, collections: newCollections };
    }
    return w;
  });

  setToStorage(STORAGE_KEYS.SAVED_LEXICON, updated);
  return updated;
}

// =========================================================================
// SONG VOCABULARY BRIDGE (Words explicitly collected for a specific song)
// =========================================================================

export function addWordToSongVocabulary(songId: string, word: string): string[] {
  const songs = getStoredSongs();
  const song = songs.find(s => s.id === songId);
  if (!song) return [];

  const currentVocab = song.songVocabulary || [];
  if (!currentVocab.includes(word)) {
    const updatedVocab = [...currentVocab, word];
    saveSong({ ...song, songVocabulary: updatedVocab });
    recordWordInteraction(word);
    return updatedVocab;
  }
  return currentVocab;
}

export function removeWordFromSongVocabulary(songId: string, word: string): string[] {
  const songs = getStoredSongs();
  const song = songs.find(s => s.id === songId);
  if (!song) return [];

  const currentVocab = song.songVocabulary || [];
  const updatedVocab = currentVocab.filter(w => w !== word);
  saveSong({ ...song, songVocabulary: updatedVocab });
  return updatedVocab;
}

// =========================================================================
// RECENTLY USED VOCABULARY HISTORY
// =========================================================================

export function getRecentWords(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.RECENT_WORDS, ['रात', 'सन्नाटा', 'जज़्बात', 'सुकून']);
}

export function recordWordInteraction(devanagari: string): string[] {
  if (!devanagari || typeof devanagari !== 'string') return getRecentWords();
  const clean = devanagari.trim();
  if (!clean) return getRecentWords();

  const current = getRecentWords().filter(w => w !== clean);
  const updated = [clean, ...current].slice(0, 20); // Keep top 20 recent
  setToStorage(STORAGE_KEYS.RECENT_WORDS, updated);
  return updated;
}
