# BHASHA — Linguistic Capabilities & Known Boundaries

> **Document Version**: Phase 8.0  
> **Core Principle**: A trustworthy product is allowed to say: *"BHASHA does not know."* We do not manufacture false certainty.

---

## 1. Regional & Dialectal Phonetic Variation

Hindustani is spoken across diverse regional substrates, each with unique phonological characteristics:
- **Dilli / NCR / Western UP**: Tends towards sharper distinction between Perso-Arabic phonemes (/z/, /f/, /x/, /q/) and standard Hindi counterparts.
- **Bambaiya / Mumbai Slang**: Features frequent consonant cluster softening, vowel rounding, and unique loanwords (`रापचिक`, `छपरी`, `लफड़ा`).
- **Eastern Hindi / Bihari Substrate**: Often realizes /ʃ/ (श) and /ʂ/ (ष) as /s/ (स), and /ʋ/ (व) as /b/ (ब).
- **Punjabi-influenced Rap**: Features geminate consonant lengthening, tonal pitch contours, and nasalized diphthongs.

> **Engine Treatment**: BHASHA provides canonical Standard Hindustani / Khariboli phonetic sequences as primary baselines while supporting alternative phoneme alignments for common dialectal variants (such as aspirated vs fricative Nuqta pairs).

---

## 2. Perso-Arabic vs Sanskritized Pronunciation

Words originating from Persian, Arabic, or Turkish often contain Nuqta consonants:
- `क़` (/q/ uvular stop) ↔ `क` (/k/ velar stop)
- `ख़` (/x/ velar fricative) ↔ `ख` (/kʰ/ aspirated velar stop)
- `ग़` (/ɣ/ uvular fricative) ↔ `ग` (/ɡ/ voiced velar stop)
- `ज़` (/z/ voiced alveolar fricative) ↔ `ज` (/d͡ʒ/ voiced postalveolar affricate)
- `फ़` (/f/ voiceless labiodental fricative) ↔ `फ` (/pʰ/ aspirated bilabial stop)

> **Engine Treatment**: The engine recognizes that in rap songwriting, `क़ुदरत` and `कुदरत` participate in the exact same rhyme family and phonetic cadences. The scoring engine evaluates both canonical and colloquial variants to ensure accurate retrieval.

---

## 3. Syllable Weight vs Musical Stress in Rap

In linguistics, Hindi is a **mora-timed or syllable-timed language** rather than a strictly stress-timed language like English:
- Syllables possess **weight** (Light: `V`, Heavy: `VV` or `VC`, Extra-Heavy: `VVC` or `VCC`).
- A rapper's **flow** (cadence, syncopation, triplet delivery, vocal pocket) dynamically stretches, compresses, and offsets syllables against the musical beat grid.
- Therefore, **a syllable count is strictly a syllable count** — not a measure of musical swing, pocket, or flow quality.

> **Engine Treatment**: BHASHA clearly labels its visualization as **"Phonetic Rhythm"** (representing vowel duration `—` vs `●`) and **"Syllable Count / Target"**, explicitly avoiding claims of automatic musical stress detection.

---

## 4. English Loanwords & Hinglish Code-Switching

Modern South Asian rap heavily utilizes code-switching:
- Example: `"scene mera clean but mind mein noise"`
- English words (`scene`, `clean`, `mind`, `noise`) possess distinct Germanic/Romance phonetic rules that cannot be mechanically translated using Devanagari orthography without introducing inaccuracies.

> **Engine Treatment**: BHASHA preserves Roman/English tokens in mixed lines, applies dedicated Latin phonotactic rules, and avoids forcing inaccurate Hindi vowel rules onto English words. Where English phonetic coverage is heuristic, it is explicitly treated as such.

---

## 5. Roman Hindi / Hinglish Spelling Ambiguity

Romanized Hindi lacks a standardized global spelling convention:
- `kal` can represent both `कल` (/kəl/ - yesterday/tomorrow) and `काल` (/kaːl/ - time/death/era).
- `mat` can represent both `मत` (/mət̪/ - do not/opinion) and `मात` (/maːt̪/ - defeat).
- `dil` vs `deil` vs `dill`.

> **Engine Treatment**: BHASHA utilizes an inverted search index with normalized phonetic canonicalization (`resolveToDevanagari`). When ambiguous, it surfaces the most frequent songwriting root while allowing the writer to explicitly inspect and pin the desired Devanagari form.

---

## 6. Definition of "Rhyme Density"

- **What Rhyme Density Is**: A deterministic, non-destructive metric calculating the percentage of bars that contain detected end-rhymes (participating in multi-line rhyme schemes) or high-confidence internal rhymes.
- **What Rhyme Density Is NOT**: It is **NOT** a score for lyrical quality, creativity, flow complexity, or songwriting excellence. A minimalist 4-bar hook with low rhyme density may be musically superior to an over-rhymed 16-bar verse.

---

## 7. Non-Destructive Writing Philosophy

BHASHA operates strictly as a **creative companion and analytical instrument**:
- The engine will **never** automatically rewrite, replace, or alter a writer's words.
- All analysis (rhyme groups, syllable counts, internal rhymes) is purely reactive, non-destructive, and transparent.
