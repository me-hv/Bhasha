import { Song } from '../../types';

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return Promise.resolve(false);
  }
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function downloadTextFile(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function formatSongMarkdown(song: Song): string {
  const lines = song.content.split('\n');
  let currentBar = 0;
  const formattedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formattedLines.push('');
      continue;
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentBar = 0; // Reset bar counter per section
      formattedLines.push(`\n${trimmed.toUpperCase()}\n`);
      continue;
    }

    currentBar++;
    const barPrefix = String(currentBar).padStart(2, '0');
    formattedLines.push(`${barPrefix}. ${trimmed}`);
  }

  return `# ${song.title.toUpperCase()}

> **BPM:** ${song.bpm} | **Key:** ${song.key} | **Time:** ${song.timeSignature || '4/4'} | **Status:** ${song.status}

---

${formattedLines.join('\n').trim()}

---
${song.scratchpadNotes ? `\n### Scratchpad & Notes\n${song.scratchpadNotes}\n` : ''}${song.stashedRhymes && song.stashedRhymes.length > 0 ? `\n### Rhyme Stash\n${song.stashedRhymes.join(', ')}\n` : ''}
*Written in BHASHA — Hindi/Hinglish Rap Writing OS*
`;
}

