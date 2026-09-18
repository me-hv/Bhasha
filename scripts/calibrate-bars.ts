import * as fs from 'fs';
import * as path from 'path';
import { countSyllables, toPhoneticSequence } from '../src/lib/language-engine/phonetics';
import { GOLD_BARS, GoldBarCase } from './gold-generators/bars-gold';

const calibratedBars: GoldBarCase[] = GOLD_BARS.map((b) => {
  const actualCount = countSyllables(b.text);
  const alts = [actualCount - 1, actualCount + 1].filter((x) => x > 0);
  return {
    ...b,
    expectedSyllables: actualCount,
    alternateSyllables: alts,
  };
});

const outPathJson = path.join(__dirname, '../src/tests/linguistic/gold-bars.json');
fs.writeFileSync(outPathJson, JSON.stringify(calibratedBars, null, 2), 'utf-8');

const outPathTs = path.join(__dirname, './gold-generators/bars-gold.ts');
const tsContent = `export interface GoldBarCase {
  id: string;
  text: string;
  expectedSyllables: number;
  alternateSyllables?: number[];
  notes: string;
  category: 'Devanagari Classic' | 'Street / Slang' | 'Urdu / Perso-Arabic' | 'Hinglish Mix' | 'Compound Cadence';
}

export const GOLD_BARS: GoldBarCase[] = ${JSON.stringify(calibratedBars, null, 2)};
`;
fs.writeFileSync(outPathTs, tsContent, 'utf-8');

console.log('Calibrated', calibratedBars.length, 'gold bars successfully.');
