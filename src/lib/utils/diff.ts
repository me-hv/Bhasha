/**
 * BHASHA Songwriter-Friendly Lyric Diff Engine
 * Compares two versions of lyrics and returns structured differences (added, removed, modified, unchanged)
 * without developer/git jargon.
 */

import { SongVersion, SongDiffResult, DiffLine, DiffChangeType } from '../../types';

function tokenizeLine(line: string): string[] {
  return line.trim().split(/\s+/).filter(Boolean);
}

function calculateWordOverlap(wordsA: string[], wordsB: string[]): number {
  if (wordsA.length === 0 && wordsB.length === 0) return 1.0;
  if (wordsA.length === 0 || wordsB.length === 0) return 0.0;
  
  const setA = new Set(wordsA);
  const common = wordsB.filter(w => setA.has(w)).length;
  return (2.0 * common) / (wordsA.length + wordsB.length);
}

/**
 * Compares two lyric text strings or SongVersions and produces a structured SongDiffResult
 */
export function compareLyrics(
  versionA: SongVersion | { label?: string; timestamp?: string; content: string } | string,
  versionB: SongVersion | { label?: string; timestamp?: string; content: string } | string
): SongDiffResult {
  const contentA = typeof versionA === 'string' ? versionA : versionA?.content || '';
  const contentB = typeof versionB === 'string' ? versionB : versionB?.content || '';
  const linesA = contentA.split('\n');
  const linesB = contentB.split('\n');

  const diffLines: DiffLine[] = [];
  let addedCount = 0;
  let removedCount = 0;
  let changedCount = 0;
  let unchangedCount = 0;

  let indexA = 0;
  let indexB = 0;

  while (indexA < linesA.length || indexB < linesB.length) {
    const rawA = indexA < linesA.length ? linesA[indexA] : null;
    const rawB = indexB < linesB.length ? linesB[indexB] : null;

    if (rawA !== null && rawB !== null) {
      if (rawA === rawB) {
        // Unchanged
        diffLines.push({
          type: 'unchanged',
          lineA: rawA,
          lineB: rawB,
          lineIndexA: indexA,
          lineIndexB: indexB,
        });
        unchangedCount++;
        indexA++;
        indexB++;
        continue;
      }

      // Check if this is a modified line (e.g. slight word change)
      const wordsA = tokenizeLine(rawA);
      const wordsB = tokenizeLine(rawB);
      const overlap = calculateWordOverlap(wordsA, wordsB);

      // If overlap is >= 0.35 and neither line is a section header mismatch
      const isHeaderA = rawA.trim().startsWith('[') || rawA.trim().startsWith('##');
      const isHeaderB = rawB.trim().startsWith('[') || rawB.trim().startsWith('##');

      if (overlap >= 0.35 && !(isHeaderA !== isHeaderB)) {
        // Identify added/removed words in-line
        const setA = new Set(wordsA);
        const setB = new Set(wordsB);

        const highlightWordsA = wordsA.filter(w => !setB.has(w));
        const highlightWordsB = wordsB.filter(w => !setA.has(w));

        diffLines.push({
          type: 'changed',
          lineA: rawA,
          lineB: rawB,
          lineIndexA: indexA,
          lineIndexB: indexB,
          highlightWordsA,
          highlightWordsB,
        });
        changedCount++;
        indexA++;
        indexB++;
        continue;
      }

      // Check lookahead: is lineA present shortly ahead in linesB?
      const foundInB = linesB.slice(indexB + 1, indexB + 4).indexOf(rawA);
      const foundInA = linesA.slice(indexA + 1, indexA + 4).indexOf(rawB);

      if (foundInB !== -1) {
        // Line in B was inserted
        diffLines.push({
          type: 'added',
          lineB: rawB,
          lineIndexB: indexB,
          highlightWordsB: wordsB,
        });
        addedCount++;
        indexB++;
      } else if (foundInA !== -1) {
        // Line in A was removed
        diffLines.push({
          type: 'removed',
          lineA: rawA,
          lineIndexA: indexA,
          highlightWordsA: wordsA,
        });
        removedCount++;
        indexA++;
      } else {
        // Both changed/different
        diffLines.push({
          type: 'changed',
          lineA: rawA,
          lineB: rawB,
          lineIndexA: indexA,
          lineIndexB: indexB,
          highlightWordsA: wordsA,
          highlightWordsB: wordsB,
        });
        changedCount++;
        indexA++;
        indexB++;
      }
    } else if (rawA !== null) {
      // Remaining removed lines from A
      diffLines.push({
        type: 'removed',
        lineA: rawA,
        lineIndexA: indexA,
        highlightWordsA: tokenizeLine(rawA),
      });
      removedCount++;
      indexA++;
    } else if (rawB !== null) {
      // Remaining added lines from B
      diffLines.push({
        type: 'added',
        lineB: rawB,
        lineIndexB: indexB,
        highlightWordsB: tokenizeLine(rawB),
      });
      addedCount++;
      indexB++;
    }
  }

  const normA: SongVersion | { label: string; timestamp: string; content: string } =
    typeof versionA === 'string'
      ? { label: 'Original', timestamp: '', content: versionA }
      : 'id' in versionA
      ? (versionA as SongVersion)
      : {
          label: (versionA as any).label || 'Original',
          timestamp: (versionA as any).timestamp || '',
          content: (versionA as any).content || '',
        };

  const normB: SongVersion | { label: string; timestamp: string; content: string } =
    typeof versionB === 'string'
      ? { label: 'Current', timestamp: '', content: versionB }
      : 'id' in versionB
      ? (versionB as SongVersion)
      : {
          label: (versionB as any).label || 'Current',
          timestamp: (versionB as any).timestamp || '',
          content: (versionB as any).content || '',
        };

  return {
    versionA: normA,
    versionB: normB,
    lines: diffLines,
    summary: {
      addedLines: addedCount,
      removedLines: removedCount,
      changedLines: changedCount,
      unchangedLines: unchangedCount,
    },
    hasDifferences: addedCount > 0 || removedCount > 0 || changedCount > 0,
    addedCount,
    removedCount,
    changedCount,
  };
}
