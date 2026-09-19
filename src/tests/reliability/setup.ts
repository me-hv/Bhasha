/**
 * Shared Test Setup and Utilities for Phase 11 Reliability Test Suites
 */

// In-memory localStorage mock for Node/CLI environment
export function setupTestStorage(): Map<string, string> {
  const store = new Map<string, string>();
  (globalThis as any).window = {
    localStorage: {
      getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
      setItem: (key: string, value: string) => store.set(key, String(value)),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      get length() {
        return store.size;
      },
      key: (idx: number) => Array.from(store.keys())[idx] || null,
    },
  };
  return store;
}

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

export function assertDeepEqual(a: any, b: any, message: string): void {
  const strA = JSON.stringify(a);
  const strB = JSON.stringify(b);
  if (strA !== strB) {
    throw new Error(`[DEEP EQUAL FAILED]: ${message}\nExpected:\n${strB}\nReceived:\n${strA}`);
  }
}

export function generateSyntheticSong(index: number, barCount: number = 16): any {
  const bars: string[] = [];
  const rhymeWords = ['रात', 'बात', 'साथ', 'हाथ', 'हालात', 'जज़्बात', 'औकात', 'बरसात'];
  for (let b = 1; b <= barCount; b++) {
    if (b === 1) bars.push('[Verse 1]');
    if (b === 9) bars.push('[Hook]');
    const rw = rhymeWords[(b - 1) % rhymeWords.length];
    bars.push(`लफ्जों में बारूद और कलम में मेरी ${rw}`);
  }

  return {
    id: `synthetic-song-${index}`,
    title: `SYNTHETIC TRACK ${index}`,
    content: bars.join('\n'),
    bpm: 90 + (index % 50),
    key: ['Am', 'C', 'Dm', 'Em', 'F', 'G'][index % 6],
    timeSignature: '4/4',
    status: ['DRAFT', 'IN PROGRESS', 'COMPLETE', 'ARCHIVED'][index % 4],
    revision: 1,
    tags: [`Tag-${index % 5}`, 'Underground', 'Synthetic'],
    notes: `Synthetic notes for song ${index}`,
    sectionNotes: { 'Verse 1': 'Keep it crisp', 'Hook': 'Layered vocals' },
    songVocabulary: ['रात', 'बात', 'साथ'],
    scratchpadNotes: `Scratchpad thoughts for song ${index}`,
    stashedRhymes: ['हालात', 'जज़्बात'],
    createdAt: new Date(Date.now() - index * 60000).toISOString(),
    updatedAt: new Date(Date.now() - index * 30000).toISOString(),
  };
}
