# BHASHA — Phase 8 Architecture & Linguistic Audit

> **Document Version**: Phase 8.0  
> **Status**: Comprehensive Baseline Audit  
> **Date**: September 2026

---

## 1. Current Pipeline

The BHASHA linguistic and songwriting architecture operates as a multi-stage deterministic pipeline:

```text
USER INPUT (Devanagari, Roman Hindi, or Hinglish)
    │
    ▼
1. NORMALIZER (src/lib/language-engine/normalizer.ts)
   ├── Strips punctuation, trims whitespace, standardizes Roman transliteration
   └── Resolves Roman search queries to canonical Devanagari forms
    │
    ▼
2. PHONETIC SEQUENCE ENGINE (src/lib/language-engine/phonetics.ts)
   ├── Akshara parsing & combining Nuqta (़) processing
   ├── Hindi Schwa Syncope (inherent /ə/ deletion) & intervocalic coda formation
   ├── Monosyllabic diphthong formation (/aːiː/) & glottal (/ɦ/) onset/coda handling
   └── Syllable tokenization -> PhoneticSyllable[] (onset, nucleus, coda, IPA)
    │
    ▼
3. CANDIDATE RETRIEVAL (src/lib/language-engine/lexical-database.ts & rhyme-engine.ts)
   ├── Inverted Index lookups by Rhyme Ending Bucket (O(1))
   ├── Nucleus + Coda Bucket lookups (O(1))
   └── Fallback scan for broad assonances and near rhymes
    │
    ▼
4. ACOUSTIC SCORING & CLASSIFICATION (src/lib/language-engine/phonetics.ts)
   ├── Vowel similarity matrix (10 IPA nuclei pairs)
   ├── Consonant similarity matrix (articulatory manner, place, aspiration, voicing)
   ├── Backward multisyllabic cadence alignment
   └── Classification tier assignment: PERFECT, MULTISYLLABIC, STRONG, NEAR, CONSONANCE, ASSONANCE
    │
    ▼
5. VERSE & LYRIC ANALYSIS (src/lib/language-engine/verse-analyzer.ts)
   ├── Line tokenization & end-word lexical extraction
   ├── Automatic Rhyme Group clustering (A, B, C...)
   ├── Intra-line Internal Rhyme detection (with stop-word filtering)
   ├── Syllable counting & cadence pattern generation (● — ● ● — ●)
   └── Writing statistics & Rhyme Density calculation
```

---

## 2. Core Data Structures

| Structure | Location | Role |
|---|---|---|
| `PhoneticSyllable` | `src/types/index.ts:45` | Represents single syllable unit: `onset`, `nucleus`, `coda`, `fullIPA`, `devanagari`. |
| `PhoneticSequence` | `src/types/index.ts:54` | Full word phonetic breakdown: `syllables[]`, `syllableCount`, `lastSyllable`, `rhymeEnding`. |
| `DetailedRhymeScore` | `src/types/index.ts:64` | Decoupled acoustic evaluation: `score`, `quality`, `matchingSyllables`, `category`, `multisyllabic`. |
| `LexicalEntry` | `src/types/index.ts:120` | Canonical corpus dictionary entry with pronunciations, meanings, moods, rhyme keys, graph. |
| `InvertedRhymeIndex` | `src/types/index.ts:159` | Fast index: `endingBuckets`, `nucleusCodaBuckets`, `cadenceBuckets`, `searchIndex`. |
| `ParsedLine` | `src/types/index.ts:285` | Single bar analysis: line number, words, endWord, syllables, rhymeGroup, flow, internalRhymes. |
| `ParsedSection` | `src/types/index.ts:302` | Section grouping: title, type (`Verse`, `Hook`), start/end line index, barCount. |
| `SongStats` | `src/types/index.ts:312` | Song metrics: totalWords, totalBars, totalSyllables, avgSyllables, rhymeDensity. |

---

## 3. Important Functions

- **`toPhoneticSequence(input: string)`** (`phonetics.ts:404`): Converts Devanagari or Roman text into structured IPA syllables with schwa syncope.
- **`getRhymeScore(source, candidate)`** (`phonetics.ts:599`): Computes acoustic distance, syllable matching from end, and classification category.
- **`getRhymes(query: string)`** (`rhyme-engine.ts:81`): 5-stage candidate retrieval and ranked rhyme generation.
- **`parseSongContent(content, bpm, targetSyllables, pinnedTarget)`** (`verse-analyzer.ts:290`): Real-time whole-song parser generating lines, sections, rhyme groups, internal rhymes, flow metrics, and stats.
- **`detectInternalRhymes(line, lineIndex)`** (`verse-analyzer.ts:168`): Tokenizes line and detects meaningful assonances and multisyllabics above confidence threshold.
- **`computeRhymeGroups(lines, pinnedTarget)`** (`verse-analyzer.ts:203`): Clusters rhyming line endings into scheme letters (`A`, `B`, `C`...).

---

## 4. Known Assumptions

1. **4/4 Time Signature Default**: Density calculations assume 4 beats per bar (`syllables / 4`).
2. **Standard Khariboli Pronunciation as Baseline**: Default schwa deletion follows standard Modern Standard Hindi / Hindustani rules (e.g. `कमरा` -> `/kəm.raː/`).
3. **Nuqta Duality**: Loanwords with Nuqta (`क़`, `ख़`, `ग़`, `फ़`, `ज़`) are assumed to have dual pronunciations (Urdu canonical vs Sanskritized/colloquial Hindi stop/aspirate).
4. **Final Consonant Coda Attachment**: Un-matra-ed word-final consonants attach as codas to the preceding vowel nucleus (e.g., `रात` -> `r-aː-t̪`).
5. **Diphthongs**: Independent `ई` / `इ` following `/aː/` in 1–2 akshara words is treated as diphthong `/aːiː/` (e.g., `भाई` -> `/bʱaːiː/`).

---

## 5. Known Weaknesses & Edge Cases

1. **Single Fixed Pronunciation Assumption**: Previously, `LexicalEntry` only stored a single string `pronunciation`, ignoring valid colloquial vs formal variants (e.g., `क़ुदरत` vs `कुदरत`, `फ़ुरसत` vs `फुरसत`).
2. **False Positive Vulnerability on Shared Vowels**: Without calibration, words sharing only an `/aː/` vowel or identical suffix might receive inflated rhyme scores (e.g., `दिल` ↔ `दिन` or `सड़क` ↔ `सफ़र`).
3. **Unrhymed Line Forcing Risk**: In rhyme grouping, lines without a match must explicitly remain unassigned (`—`) rather than being forced into a single-item group.
4. **End-Rhyme Extraction on Trailing Particles**: Lines ending in postpositions or auxiliary particles (e.g. `है`, `था`, `में`, `we were outside`) require context-aware lexical unit extraction.
5. **Cadence vs Musical Flow Terminology**: Rhythm visualization (`● — ● ● — ●`) visualizes vowel length and syllable shape, not musical stress or rap delivery.

---

## 6. Where Linguistic Decisions Are Encoded

- **`src/lib/language-engine/phonetics.ts`**:
  - `DEVANAGARI_VOWELS`: Matra to IPA mappings.
  - `CONSONANT_FAMILIES`: Consonant articulatory classification (dentals, labials, velars, sibilants, liquids, glides, nasals).
  - `segmentDevanagari()`: Schwa syncope rules, glottal coda attachment, diphthong boundaries.
  - `getVowelSimilarity()` & `getConsonantSimilarity()`: Acoustic proximity matrices.
- **`src/lib/language-engine/normalizer.ts`**:
  - `ROMAN_TO_DEVANAGARI`: Standardized Hinglish transliteration table.
- **`src/lib/language-engine/verse-analyzer.ts`**:
  - `STOP_WORDS`: Grammatical particle exclusion set for internal rhyme analysis.
  - `areWordsRhyming()`: Minimum acoustic score thresholds (0.70 for end-rhymes, 0.55 for internal assonances).

---

## 7. Where UI Decisions Interact with Linguistic Logic

- **`SongEditor.tsx`**:
  - `extractWordAtCursor()`: Heuristic cursor token extraction to feed active word to Rhyme Rack.
  - Visual color tokens for Rhyme Groups (`A` -> Emerald, `B` -> Amber, `C` -> Cyan, `D` -> Purple, `E` -> Rose).
  - Syllable density threshold: `density > 4.25 syl/beat` flags as dense (rose highlight).
- **`RhymeDrawer.tsx`**:
  - Categorization tabs (`PERFECT`, `STRONG`, `NEAR`, `MULTISYLLABIC`, `CONSONANCE`).

---

## 8. Independently Testable Components

| Component | Test File | Independence |
|---|---|---|
| Phonetic Converter & Syllables | `src/tests/linguistic-correctness.test.ts` | 100% independent of UI. |
| Decoupled Rhyme Scorer | `src/tests/rhyme-quality.test.ts` | 100% independent of UI. |
| Inverted Index & Search | `src/tests/language-engine.test.ts` | 100% independent of UI. |
| Verse Analyzer & Rhyme Groups | `src/tests/verse-analysis.test.ts` | 100% independent of UI. |
| Real-World Gold Suites (Phase 8) | `scripts/linguistic-audit.ts` | Fully standalone validation runner against 9 JSON datasets. |
