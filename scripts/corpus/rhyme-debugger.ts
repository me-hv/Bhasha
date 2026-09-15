/**
 * BHASHA — Developer Rhyme Diagnostics CLI Tool
 * Inspects phonetic breakdown, spoken syllable units, acoustic similarities,
 * decoupled quality tiers, and multisyllabic span for any word pair.
 *
 * Usage: npx tsx scripts/corpus/rhyme-debugger.ts <query> <candidate>
 */

import { toPhoneticSequence, getRhymeScore } from '../../src/lib/language-engine/phonetics';
import { resolveToDevanagari, normalizeRomanHindi } from '../../src/lib/language-engine/normalizer';
import { getWord } from '../../src/lib/language-engine/rhyme-engine';

function debugRhyme(queryWord: string, candidateWord: string) {
  const normQuery = normalizeRomanHindi(queryWord);
  const normCand = normalizeRomanHindi(candidateWord);

  const { devanagari: queryDeva } = resolveToDevanagari(normQuery);
  const { devanagari: candDeva } = resolveToDevanagari(normCand);

  const queryEntry = getWord(normQuery) || getWord(queryDeva);
  const candEntry = getWord(normCand) || getWord(candDeva);

  const qTarget = queryEntry ? queryEntry.devanagari : queryDeva;
  const cTarget = candEntry ? candEntry.devanagari : candDeva;

  const qSeq = toPhoneticSequence(qTarget);
  const cSeq = toPhoneticSequence(cTarget);

  const scoreResult = getRhymeScore(qSeq, cSeq);

  const formatSyllables = (seq: typeof qSeq) =>
    seq.syllables.map(s => s.devanagari || s.fullIPA).join(' | ');

  const formatIPA = (seq: typeof qSeq) =>
    seq.syllables.map(s => s.fullIPA).join(' . ');

  console.log('\n=================================================================');
  console.log('🔬 BHASHA LINGUISTIC RHYME & ACOUSTIC DIAGNOSTIC INSPECTOR');
  console.log('=================================================================\n');

  console.log('QUERY WORD:');
  console.log(`  Input:              "${queryWord}" (Normalized: "${normQuery}")`);
  console.log(`  Resolved Devanagari: ${qTarget} ${queryEntry?.urdu ? `(${queryEntry.urdu})` : ''}`);
  console.log(`  Spoken Syllables:   [ ${formatSyllables(qSeq)} ]  (Count: ${qSeq.syllableCount})`);
  console.log(`  Phonetic IPA:       /${formatIPA(qSeq)}/`);
  console.log(`  Final Rhyme Unit:   Nucleus: /${qSeq.lastSyllable.nucleus}/ | Coda: /${qSeq.lastSyllable.coda || 'ø'}/`);
  console.log(`  Indexed Rhyme Key:  "${qSeq.rhymeEnding}"`);

  console.log('\nCANDIDATE WORD:');
  console.log(`  Input:              "${candidateWord}" (Normalized: "${normCand}")`);
  console.log(`  Resolved Devanagari: ${cTarget} ${candEntry?.urdu ? `(${candEntry.urdu})` : ''}`);
  console.log(`  Spoken Syllables:   [ ${formatSyllables(cSeq)} ]  (Count: ${cSeq.syllableCount})`);
  console.log(`  Phonetic IPA:       /${formatIPA(cSeq)}/`);
  console.log(`  Final Rhyme Unit:   Nucleus: /${cSeq.lastSyllable.nucleus}/ | Coda: /${cSeq.lastSyllable.coda || 'none'}/`);
  console.log(`  Indexed Rhyme Key:  "${cSeq.rhymeEnding}"`);

  console.log('\nACOUSTIC & PHONETIC COMPARISON:');
  console.log(`  Acoustic Quality:   ${(scoreResult.quality * 100).toFixed(0)}% (Similarity: ${scoreResult.phoneticSimilarity.toFixed(2)})`);
  console.log(`  Phonetic Distance:  ${(scoreResult.phoneticDistance ?? (1 - scoreResult.score)).toFixed(2)}`);
  console.log(`  Matching Syllables: ${scoreResult.matchingSyllables} (Rhyme Length Span: ${scoreResult.rhymeLength} syl)`);
  console.log(`  Multisyllabic Flag: ${scoreResult.multisyllabic ? '✨ TRUE (Polysyllabic Cadence)' : 'FALSE (Monorhyme)'}`);
  console.log(`  Engine Confidence:  ${Math.round(scoreResult.confidence * 100)}%`);

  console.log('\nDECOUPLED RHYME CLASSIFICATION:');
  console.log(`  Overall Score:      ${scoreResult.score.toFixed(2)} / 1.00`);
  console.log(`  Acoustic Category:  ★ ${scoreResult.category.toUpperCase()} ★`);
  console.log(`  Backwards Type:     ${scoreResult.type.toUpperCase()}`);

  console.log('\n=================================================================\n');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const q = args[0] || 'रात';
  const c = args[1] || 'जज़्बात';
  debugRhyme(q, c);
}
