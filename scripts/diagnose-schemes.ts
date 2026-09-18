import * as fs from 'fs';
import { parseSongContent, extractLineEndWord, extractLineWords } from '../src/lib/language-engine/verse-analyzer';
import { areWordsRhyming } from '../src/lib/language-engine/verse-analyzer';

const schemes = JSON.parse(fs.readFileSync('./src/tests/linguistic/rhyme-schemes.json', 'utf-8'));
for (const s of schemes) {
  const text = s.lines.join('\n');
  const parsed = parseSongContent(text);
  const actualScheme = parsed.lines.map((l) => l.rhymeGroup || '—');
  const expectedScheme = s.expectedScheme;
  let matches = true;
  for (let k = 0; k < expectedScheme.length; k++) {
    const exp = expectedScheme[k];
    const act = actualScheme[k];
    if (exp === '—' && act !== '—') { matches = false; break; }
    if (exp !== '—' && act === '—') { matches = false; break; }
  }
  if (!matches) {
    console.log(`\n[${s.id} (${s.schemeType})] Expected: [${expectedScheme.join(', ')}] | Got: [${actualScheme.join(', ')}]`);
    for (let i = 0; i < s.lines.length; i++) {
      const line = s.lines[i];
      const words = extractLineWords(line);
      console.log(`  Line ${i+1}: "${line}" (words: ${words.slice(-2).join(' ')})`);
    }
  }
}
