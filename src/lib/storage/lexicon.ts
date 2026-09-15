import { SavedWord } from '../../types';
import { STORAGE_KEYS, getFromStorage, setToStorage } from './storage';
import { WORDS_DATABASE } from '../../data/words';

export const INITIAL_SAMPLE_LEXICON: SavedWord[] = [
  {
    id: 'fanaa',
    devanagari: 'फ़ना',
    roman: 'fanaa',
    meaning: 'Self-destruction in love/art, mortal dissolution, transcendence',
    pronunciation: '/fəˈnaː/',
    notes: 'Use for introspective bridge on total devotion to the craft',
    tags: ['Philosophy', 'Deep', 'Spiritual'],
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
    tags: ['Cosmic', 'Ambition', 'Vision'],
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
    tags: ['Dark', 'Midnight', 'Loneliness'],
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
    tags: ['Energy', 'Hustle', 'Hardcore'],
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
    tags: ['Legacy', 'Wisdom'],
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
    tags: ['Introspective', 'Philosophy'],
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
    tags: ['Peace', 'Introspective'],
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
    tags: ['Rebellion', 'Street', 'Raw'],
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
    tags: ['Journey', 'Deep'],
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
    tags: ['Fate', 'Defiance'],
    savedAt: new Date().toISOString(),
    perfectRhymes: ['समंदर', 'सिकंदर', 'कलंदर', 'अंदर'],
    relatedImagery: ['हाथ की लकीरें', 'सितारे', 'आसमान'],
  }
];

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
    id: wordOrEntry.id || dbWord?.id || `word-${Date.now()}`,
    devanagari: wordOrEntry.devanagari,
    roman: wordOrEntry.roman || dbWord?.roman || wordOrEntry.devanagari,
    meaning: wordOrEntry.meaning || dbWord?.meaning || '',
    pronunciation: wordOrEntry.pronunciation || dbWord?.pronunciation || '',
    notes: wordOrEntry.notes || '',
    tags: wordOrEntry.tags || dbWord?.moods || ['Custom'],
    savedAt: new Date().toISOString(),
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
