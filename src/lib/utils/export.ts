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
  return `# ${song.title}

> **BPM:** ${song.bpm} | **Key:** ${song.key} | **Time:** ${song.timeSignature} | **Status:** ${song.status}
> **Updated:** ${new Date(song.updatedAt).toLocaleDateString()}

---

${song.content}

---
${song.scratchpadNotes ? `\n### Scratchpad & Notes\n${song.scratchpadNotes}\n` : ''}
${song.stashedRhymes && song.stashedRhymes.length > 0 ? `\n### Rhyme Stash\n${song.stashedRhymes.join(', ')}\n` : ''}

*Written in BHASHA — Hindi/Hinglish Rap Writing OS*
`;
}
