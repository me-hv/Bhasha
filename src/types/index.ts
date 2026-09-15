export type RhymeType = 
  | 'perfect' 
  | 'strong' 
  | 'multisyllabic' 
  | 'near' 
  | 'assonance' 
  | 'consonance' 
  | 'cadence';

export type RhymeCategory = 
  | 'perfect' 
  | 'strong' 
  | 'multisyllabic' 
  | 'near' 
  | 'assonance' 
  | 'consonance' 
  | 'cadence';

export type WordCategory = 
  | 'EMOTION' 
  | 'LIFE' 
  | 'AMBITION' 
  | 'CITY' 
  | 'RAP' 
  | 'STREET' 
  | 'PHILOSOPHY' 
  | 'LOVE' 
  | 'PAIN'
  | 'POETRY';

export type WordOrigin = 
  | 'Hindustani' 
  | 'Perso-Arabic' 
  | 'Sanskrit' 
  | 'Urdu' 
  | 'Street / Slang';

export type WordRegister = 
  | 'common' 
  | 'poetic' 
  | 'colloquial' 
  | 'literary' 
  | 'slang';

export interface PhoneticSyllable {
  onset?: string;
  nucleus: string;
  coda?: string;
  fullIPA: string;
  stress?: boolean;
  devanagari?: string;
}

export interface PhoneticSequence {
  text: string;
  ipa: string;
  syllables: PhoneticSyllable[];
  syllableCount: number;
  lastSyllable: PhoneticSyllable;
  penultimateSyllable?: PhoneticSyllable;
  rhymeEnding: string;
}

export interface DetailedRhymeScore {
  score: number;                 // 0.00 to 1.00 overall score
  quality: number;               // 0.00 to 1.00 acoustic similarity
  phoneticSimilarity: number;    // Vowel & coda weighted distance
  matchingSyllables: number;     // 1, 2, 3, etc.
  rhymeLength: number;           // Syllable span of rhyming cadence
  category: RhymeCategory;       // Acoustic tightness tier: 'perfect' | 'strong' | 'near' | 'assonance' | 'consonance'
  multisyllabic: boolean;        // True if matchingSyllables >= 2
  type: RhymeType;               // Backwards compatibility alias
  confidence: number;
  explanation?: string;
  phoneticDistance?: number;
}

export interface PhoneticKey {
  nucleus: string; // Vowel nucleus: e.g. "aː", "ɪ", "uː", "eː", "ɔː", "ə"
  coda: string;    // Final consonant sound: e.g. "t̪", "l", "r", "rd̪", "b", "n", "m", "st̪"
  rhymeEnding: string; // e.g. "aat", "at", "il", "aar", "ard", "aab", "oon", "aasta"
  syllables: number;
  phonemes?: string[];
  cadencePattern?: string;
  sequence?: PhoneticSequence;
}

export interface RhymeScore {
  wordId: string;
  word: string;
  devanagari: string;
  urdu?: string;
  roman: string;
  score: number; // 0.00 to 1.00
  type: RhymeType;
  syllables: number;
  matchingSyllables?: number;
  confidence?: number;
  explanation?: string;
  meaning?: string;
  frequency?: number;
  isSaved?: boolean;
}

export interface MultiSyllableRhyme {
  phraseOrWord: string;
  score: number;
  syllables: number;
  type: 'multi-syllable' | 'phrase';
}

export interface RelatedWordGraph {
  visual?: string[];
  emotion?: string[];
  sound?: string[];
  place?: string[];
  general?: string[];
}

export interface LexicalEntry {
  id: string;
  devanagari: string;
  urdu?: string;
  roman: string;
  aliases: string[];
  normalizedSearchForms?: string[];
  pronunciation: string;
  phonemes?: string[];
  syllables: number;
  syllableBreakdown?: string[];
  meaning: string;
  hindiMeaning?: string;
  origin: WordOrigin;
  register?: WordRegister[];
  moods: string[];
  category?: WordCategory[];
  frequency?: number; // 1 to 100 for ranking priority
  coda: string;
  rhymeKey?: string;
  phoneticKey?: PhoneticKey;
  variants?: string[]; // e.g. ["कुदरत", "क़ुदरत"]
  perfectRhymes: string[];
  strongRhymes: string[];
  nearRhymes: string[];
  cadenceRhymes?: string[];
  scoredRhymes?: RhymeScore[];
  multiSyllableRhymes?: MultiSyllableRhyme[];
  synonyms: string[];
  antonyms?: string[];
  relatedImagery: string[];
  relatedGraph?: RelatedWordGraph;
  sampleBars?: string[];
}

// Alias for backwards compatibility
export type WordEntry = LexicalEntry;
export type Word = LexicalEntry;

export interface InvertedRhymeIndex {
  // exact ending token (e.g. "aat", "at", "il") -> word ids sorted by frequency
  endingBuckets: Record<string, string[]>;
  // IPA nucleus + coda key (e.g. "aː_t̪", "ə_t̪") -> word ids
  nucleusCodaBuckets: Record<string, string[]>;
  // cadence / multi-syllable rhyme keys
  cadenceBuckets: Record<string, string[]>;
  // search forms index: maps any normalized Roman or Devanagari query -> canonical word id
  searchIndex: Record<string, string>;
  // variant index: maps orthographic variants -> canonical word id
  variantIndex: Record<string, string>;
}

export interface RhymeMatch extends RhymeScore {
  category: RhymeCategory;
}

export interface RhymeResult {
  query: string;
  resolvedWord?: LexicalEntry;
  resolvedDevanagari: string;
  perfect: RhymeMatch[];
  multisyllabic?: RhymeMatch[];
  strong: RhymeMatch[];
  near: RhymeMatch[];
  assonance?: RhymeMatch[];
  consonance?: RhymeMatch[];
  cadence: RhymeMatch[];
  multiSyllable?: MultiSyllableRhyme[];
  totalMatches: number;
}

export interface SavedWord {
  id: string;
  devanagari: string;
  urdu?: string;
  roman: string;
  meaning: string;
  pronunciation?: string;
  notes?: string;
  tags: string[];
  savedAt: string;
  sourceSongId?: string;
  perfectRhymes?: string[];
  strongRhymes?: string[];
  nearRhymes?: string[];
  relatedImagery?: string[];
  relatedGraph?: RelatedWordGraph;
}

export interface SongSection {
  id: string;
  type: 'Verse 1' | 'Verse 2' | 'Verse 3' | 'Hook' | 'Chorus' | 'Bridge' | 'Intro' | 'Outro' | 'Pre-Chorus' | 'Beat Drop' | 'Freestyle';
  content: string;
}

export interface Song {
  id: string;
  title: string;
  content: string;
  bpm: number;
  key: string;
  timeSignature: string;
  status: 'Draft' | 'In Progress' | 'Finished' | 'Recorded';
  tags: string[];
  scratchpadNotes: string;
  stashedRhymes: string[];
  pinnedPromptId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongPrompt {
  id: string;
  category: 'LOVE' | 'PAIN' | 'AMBITION' | 'MONEY' | 'FAMILY' | 'CITY' | 'LONELINESS' | 'SUCCESS' | 'FAILURE' | 'RANDOM';
  title: string;
  premise: string;
  angle: string;
  suggestedBpm: string;
  mood: string;
  keywords: { devanagari: string; roman: string }[];
  rhymeAnchors: { word: string; rhymes: string[] }[];
  sampleOpeningBar?: string;
}

export interface AppPreferences {
  editorFontSize: 'sm' | 'md' | 'lg' | 'xl';
  showSyllableCounter: boolean;
  showMetronomeVisual: boolean;
  metronomeVolume: number;
  metronomeSound: 'click' | 'wood' | 'beep';
  autoSaveInterval: number;
  zenMode: boolean;
  focusLineOnly: boolean;
}
