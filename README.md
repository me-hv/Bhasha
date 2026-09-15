# BHASHA (भाषा) — Hindi & Hinglish Rap Writing OS

> **Find the word. Unlock the line.**
> A modern songwriting companion and phonetic rhyme discovery engine built for Hindi and Hinglish rappers, lyricists, poets, and songwriters.

---

## 🎯 What is BHASHA?

BHASHA is a creative writing instrument designed from the ground up for South Asian hip-hop, poetry, and modern songwriting. Unlike generic dictionaries or standard word finders, BHASHA understands the nuanced phonetic rules, mixed-script spellings, and cultural registers of Hindustani:

* **Dual-Script & Roman-Aware**: Search seamlessly in Devanagari (`रात`), Latin/Roman Hinglish (`raat`, `khwaab`), or mixed poetic forms.
* **Acoustic & Multisyllabic Rhymes**: Engine accounts for Hindi schwa syncope rules, nasalization (*anusvara*/*chandrabindu*), long/short vowel equivalence in meter, and nukta consonants.
* **Lexical Inspiration Graph**: Explore 4 creative dimensions for every word — **Visual** (imagery), **Emotion** (rasa/mood), **Sound** (onomatopoeia & sonic texture), and **Place** (spatial associations).
* **Obsidian-Dark Studio Workspace**: Minimalist, distraction-free environment equipped with multi-syllable rhyme visualizer, BPM tap tempo, metronome, scale selector, and rhyming dictionary inspector.

---

## 🚀 Key Features

### 1. Linguistic & Phonetic Rhyme Engine
- **Inverted Phonetic Index**: Sub-millisecond lookup across full Hindustani lexicon.
- **Accurate Schwa Syncope**: Linguistically sound deletion of inherent schwas (e.g. `कमरा` -> `/kəm.rɑː/`, `दरवाज़ा` -> `/d̪ər.wɑː.zɑː/`).
- **Rhyme Classifications**:
  - **Perfect Rhymes (तुक)**: Exact rhyme keys and vowel-consonant coda alignment.
  - **Slant Rhymes (आभासी तुक)**: Assonant/vocalic near-rhymes common in underground rap flows.
  - **Multi-syllable Rhymes (काफ़िया & रदीफ़)**: Compound cadence matching across 2–4 syllables.
- **Decoupled Scoring Engine**: Transparent acoustic quality vs. cadence span rating (0–100).

### 2. Hindustani Lexical Corpus
- Comprehensive vocabulary covering:
  - **Urdu / Persian / Arabic** loanwords (`फ़ुरसत`, `कुदरत`, `अलविदा`, `ख़्वाब`)
  - **Sanskrit-derived Tatsam & Tadbhav** words
  - **Everyday Hindustani & Street Slang**
  - **Hip-Hop & Pop Culture Vocabulary**

### 3. Studio Writing Environment
- **Multi-Syllable Color Highlighter**: Automatically detect and highlight rhyming vowel cadences across lines.
- **Top Music Bar**: Master tempo (BPM), tap tempo, metronome playback, key/scale selector, and audio status indicators.
- **Collapsible Drawers & Inspectors**: Rhyme drawer, Lexical Graph Explorer, and Word Details pane.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router, React 18)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom obsidian/gold/crimson hip-hop studio design tokens
- **Icons**: Lucide React
- **Audio Synthesis**: Web Audio API (metronome click synthesis)
- **Testing**: Node test runner with custom linguistic validation suites

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/me-hv/Bhasha.git
cd Bhasha

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch BHASHA.

### Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Creates an optimized production build.
- `npm run start` - Runs the built production application.
- `npm test` - Runs linguistic and phonetic test suites.
- `npm run test:linguistic` - Runs the 213-word linguistic gold standard validation benchmark.
- `npm run test:corpus` - Audits corpus coverage, registers, and syllable metrics.
- `npm run debug:rhyme -- <word1> <word2>` - CLI diagnostic tool to compare phonetic breakdown and rhyme scoring.

---

## 🧪 Linguistic Validation

BHASHA includes an extensive suite of automated tests and gold-standard linguistic benchmarks verifying:
- Schwa syncope correctness across 200+ edge cases
- Nasalization codas and vowel harmony
- Cross-script phonetic mapping (Roman -> Devanagari)
- Multi-syllable rhyme rank ordering

```bash
npm run test:linguistic
```

---

## 📜 License

MIT License. Designed and built with ❤️ for Indian Hip-Hop and South Asian songwriters.
