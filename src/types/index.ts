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
  pronunciations?: string[];
  alternateSequences?: PhoneticSequence[];
}

export interface DetailedRhymeScore {
  score: number;                 // 0.00 to 1.00 overall score
  quality: number;               // 0.00 to 1.00 acoustic similarity
  rhymeQuality?: number;         // Explicit alias for acoustic tightness (0.0 to 1.0)
  phoneticSimilarity: number;    // Vowel & coda weighted distance
  matchingSyllables: number;     // 1, 2, 3, etc.
  rhymeLength: number;           // Syllable span of rhyming cadence
  metricLength?: number;         // Syllable count span of the rhyme
  category: RhymeCategory;       // Acoustic tightness tier: 'perfect' | 'strong' | 'near' | 'assonance' | 'consonance'
  multisyllabic: boolean;        // True if matchingSyllables >= 2
  type: RhymeType;               // Backwards compatibility alias
  confidence: number;
  explanation?: string;
  phoneticDistance?: number;
  isUnrhymed?: boolean;
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
  pronunciations?: string[];
  alternatePhonetics?: PhoneticSequence[];
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
  personalNote?: string;
  tags: string[];
  savedAt: string;
  sourceSongId?: string;
  sourceContext?: string;
  collections?: string[];
  register?: WordRegister[];
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

export type SongStatus = 'DRAFT' | 'IN PROGRESS' | 'COMPLETE' | 'ARCHIVED' | 'Draft' | 'In Progress' | 'Finished' | 'Recorded';

export interface Song {
  id: string;
  title: string;
  content: string;
  bpm: number;
  key: string;
  timeSignature: string;
  status: SongStatus;
  revision?: number;
  genre?: string;
  mood?: string;
  tags: string[];
  notes?: string; // Private creative notes / theme / hook / emotional direction
  sectionNotes?: Record<string, string>; // Section-level notes keyed by section header or ID
  songVocabulary?: string[]; // Words intentionally saved for this specific song
  scratchpadNotes?: string;
  stashedRhymes?: string[];
  pinnedPromptId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongVersion {
  id: string;
  songId: string;
  label: string;
  timestamp: string;
  content: string;
  notes?: string;
  sectionNotes?: Record<string, string>;
  songVocabulary?: string[];
  bpm?: number;
  key?: string;
  tags?: string[];
  isAutoSafetySnapshot?: boolean;
}

export type IdeaType = 'CONCEPT' | 'IMAGE' | 'EMOTION' | 'CONTRAST' | 'SCENE' | 'PHRASE' | 'THEME' | 'COUPLET';
export type IdeaStatus = 'UNUSED' | 'IN PROGRESS' | 'USED';

export interface CreativeIdea {
  id: string;
  title: string;
  type: IdeaType;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: IdeaStatus;
  attachedSongIds?: string[];
  relatedWords?: string[];
}

export interface BhashaProjectBackup {
  schemaVersion: number;
  exportedAt: string;
  bhashaVersion: string;
  generator?: string;
  songs: Song[];
  versions: SongVersion[];
  lexicon: SavedWord[];
  collections: string[];
  ideas: CreativeIdea[];
  recentWords?: string[];
  preferences?: AppPreferences;
}

export interface ValidationError {
  code: string;
  entity: 'Song' | 'SongVersion' | 'SavedWord' | 'CreativeIdea' | 'Collection' | 'Project' | 'Storage';
  id?: string;
  field?: string;
  message: string;
  fatal: boolean;
}

export interface ValidationWarning {
  code: string;
  entity: 'Song' | 'SongVersion' | 'SavedWord' | 'CreativeIdea' | 'Collection' | 'Project' | 'Storage';
  id?: string;
  field?: string;
  message: string;
  autoRepairable: boolean;
}

export interface ValidationDiagnostic {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ProjectIntegrityReport {
  valid: boolean;
  schemaVersion: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  orphans: {
    versions: string[];
    ideas: string[];
    vocabulary: string[];
    collections: string[];
  };
  stats: {
    totalSongs: number;
    totalVersions: number;
    totalLexiconWords: number;
    totalCollections: number;
    totalIdeas: number;
  };
  isRepairable: boolean;
}

export interface ImportPreviewResult {
  valid: boolean;
  schemaVersion: number;
  migrationRequired: boolean;
  targetSchemaVersion: number;
  counts: {
    songs: number;
    versions: number;
    lexicon: number;
    collections: number;
    ideas: number;
  };
  warnings: ValidationWarning[];
  errors: ValidationError[];
  conflicts: {
    duplicateSongTitles: string[];
    overwritingExistingIds: string[];
  };
}

export interface MigrationResult {
  success: boolean;
  fromVersion: number;
  toVersion: number;
  data?: BhashaProjectBackup;
  error?: string;
  stepsApplied: string[];
}

export type DiffChangeType = 'added' | 'removed' | 'changed' | 'unchanged';

export interface DiffLine {
  type: DiffChangeType;
  lineA?: string;
  lineB?: string;
  lineIndexA?: number;
  lineIndexB?: number;
  highlightWordsA?: string[];
  highlightWordsB?: string[];
}

export interface SongDiffResult {
  versionA: SongVersion | { label: string; timestamp: string; content: string };
  versionB: SongVersion | { label: string; timestamp: string; content: string };
  lines: DiffLine[];
  summary: {
    addedLines: number;
    removedLines: number;
    changedLines: number;
    unchangedLines: number;
  };
  hasDifferences: boolean;
  addedCount: number;
  removedCount: number;
  changedCount: number;
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

// =========================================================================
// PHASE 7: RAP WRITING OS & STUDIO TYPES
// =========================================================================

export type WritingMode = 'write' | 'rhyme' | 'flow';

export interface RhymeTarget {
  word: string;
  devanagari: string;
  roman?: string;
  lineIndex?: number;
  isPinned?: boolean;
}

export interface RhymeGroup {
  id: string;
  letter: string; // 'A', 'B', 'C', 'D'...
  color: string;  // Hex/tailwind color
  lines: number[]; // 0-indexed line numbers in the song/section
  anchorWord: string;
}

export interface InternalRhymeMatch {
  wordA: string;
  wordB: string;
  lineIndex: number;
  score: number;
  type: RhymeType;
  spanA?: [number, number];
  spanB?: [number, number];
}

export interface FlowAnalysis {
  syllables: number;
  targetSyllables?: number;
  density?: number; // Syllables per beat (based on 4 beats per bar)
  cadencePattern: string; // e.g. "● — ● ● — ●"
  isDense?: boolean;
}

export interface ParsedLine {
  index: number;
  line: string;
  rawText: string;
  isHeader: boolean;
  headerTitle?: string;
  isBlank: boolean;
  barNumber: number | null;
  words: string[];
  endWord: string | null;
  syllables: number | null;
  rhymeGroup?: string;
  rhymeGroupColor?: string;
  isUnrhymed?: boolean;
  flow?: FlowAnalysis;
  internalRhymes: InternalRhymeMatch[];
}

export interface ParsedSection {
  id: string;
  title: string;
  type: string;
  startLineIndex: number;
  endLineIndex: number;
  lines: ParsedLine[];
  barCount: number;
}

export interface SongStats {
  totalWords: number;
  totalBars: number;
  totalSyllables: number;
  avgSyllables: number;
  rhymeGroups: number;
  internalRhymes: number;
  rhymeDensity: number; // 0 to 100 percentage
}

export interface IdeaSeed {
  id: string;
  category: 'CONCEPT' | 'IMAGE' | 'CONTRAST' | 'EMOTION';
  title?: string;
  concept: string;
  image: string;
  contrast: string;
  emotion: string;
  keywords?: { devanagari: string; roman: string }[];
  sampleBar?: string;
}

