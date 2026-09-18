import fs from 'fs';
import path from 'path';

import { GOLD_WORDS } from './gold-generators/words-gold';
import { GOLD_WORDS_PART2 } from './gold-generators/words-gold-part2';
import { GOLD_WORDS_PART3 } from './gold-generators/words-gold-part3';
import { GOLD_RHYMES } from './gold-generators/rhymes-gold';
import { FALSE_POSITIVES } from './gold-generators/false-positives-gold';
import { MULTISYLLABIC_CASES } from './gold-generators/multisyllabic-gold';
import { GOLD_BARS } from './gold-generators/bars-gold';
import { INTERNAL_RHYMES_CASES } from './gold-generators/internal-rhymes-gold';
import { ROMAN_VARIANTS_CASES } from './gold-generators/roman-variants-gold';
import { HINGLISH_CASES } from './gold-generators/hinglish-gold';
import { RHYME_SCHEME_CASES } from './gold-generators/rhyme-schemes-gold';

const OUTPUT_DIR = path.resolve(process.cwd(), 'src/tests/linguistic');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Combine Gold Words
const allGoldWords = [...GOLD_WORDS, ...GOLD_WORDS_PART2, ...GOLD_WORDS_PART3];
// Deduplicate by devanagari
const uniqueGoldWordsMap = new Map<string, typeof allGoldWords[0]>();
for (const word of allGoldWords) {
  if (!uniqueGoldWordsMap.has(word.devanagari)) {
    uniqueGoldWordsMap.set(word.devanagari, word);
  }
}
const finalGoldWords = Array.from(uniqueGoldWordsMap.values());

console.log(`Writing 9 Independent Gold Datasets to ${OUTPUT_DIR}...`);

// 1. gold-words.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'gold-words.json'),
  JSON.stringify(finalGoldWords, null, 2),
  'utf-8'
);
console.log(`✓ gold-words.json (${finalGoldWords.length} words)`);

// 2. gold-rhymes.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'gold-rhymes.json'),
  JSON.stringify(GOLD_RHYMES, null, 2),
  'utf-8'
);
console.log(`✓ gold-rhymes.json (${GOLD_RHYMES.length} rhyme pairs)`);

// 3. false-positives.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'false-positives.json'),
  JSON.stringify(FALSE_POSITIVES, null, 2),
  'utf-8'
);
console.log(`✓ false-positives.json (${FALSE_POSITIVES.length} adversarial pairs)`);

// 4. multisyllabic.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'multisyllabic.json'),
  JSON.stringify(MULTISYLLABIC_CASES, null, 2),
  'utf-8'
);
console.log(`✓ multisyllabic.json (${MULTISYLLABIC_CASES.length} cases)`);

// 5. gold-bars.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'gold-bars.json'),
  JSON.stringify(GOLD_BARS, null, 2),
  'utf-8'
);
console.log(`✓ gold-bars.json (${GOLD_BARS.length} rap bars)`);

// 6. internal-rhymes.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'internal-rhymes.json'),
  JSON.stringify(INTERNAL_RHYMES_CASES, null, 2),
  'utf-8'
);
console.log(`✓ internal-rhymes.json (${INTERNAL_RHYMES_CASES.length} internal rhyme cases)`);

// 7. roman-variants.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'roman-variants.json'),
  JSON.stringify(ROMAN_VARIANTS_CASES, null, 2),
  'utf-8'
);
console.log(`✓ roman-variants.json (${ROMAN_VARIANTS_CASES.length} variant entries)`);

// 8. hinglish.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'hinglish.json'),
  JSON.stringify(HINGLISH_CASES, null, 2),
  'utf-8'
);
console.log(`✓ hinglish.json (${HINGLISH_CASES.length} hinglish cases)`);

// 9. rhyme-schemes.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'rhyme-schemes.json'),
  JSON.stringify(RHYME_SCHEME_CASES, null, 2),
  'utf-8'
);
console.log(`✓ rhyme-schemes.json (${RHYME_SCHEME_CASES.length} multi-line schemes)`);

console.log(`\nAll 9 Gold Datasets successfully built!`);
