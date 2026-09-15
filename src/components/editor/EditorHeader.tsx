'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Song } from '../../types';
import {
  ArrowLeft,
  Copy,
  Download,
  Check,
  Tag,
  Share2
} from 'lucide-react';
import { copyToClipboard, downloadTextFile, formatSongMarkdown } from '../../lib/utils/export';

interface EditorHeaderProps {
  song: Song;
  onUpdateSong: (updated: Partial<Song>) => void;
  onInsertSection: (sectionTag: string) => void;
  isSaving?: boolean;
}

const COMMON_KEYS = ['Am', 'Em', 'Dm', 'Cm', 'F#m', 'Gm', 'Bm', 'C', 'G', 'D', 'A', 'F'];
const SECTION_TEMPLATES = [
  '[Verse 1]',
  '[Verse 2]',
  '[Hook]',
  '[Chorus]',
  '[Bridge]',
  '[Outro]',
];

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  song,
  onUpdateSong,
  onInsertSection,
  isSaving = false,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(song.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const markdown = formatSongMarkdown(song);
    const filename = `${song.title.toLowerCase().replace(/\s+/g, '_') || 'song'}.md`;
    downloadTextFile(filename, markdown);
  };

  return (
    <div className="border-b border-obsidian-700/60 bg-obsidian-950/90 px-6 sm:px-12 py-3.5 space-y-3 select-none">
      {/* Top Bar: Back Link, Title, Status, Saved, Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Back to songs & Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={() => router.push('/library/songs')}
            className="flex items-center gap-1.5 text-xs font-mono text-obsidian-500 hover:text-obsidian-200 transition-fast"
            title="Back to all songs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Songs</span>
          </button>

          <span className="text-obsidian-700 font-mono">/</span>

          <input
            type="text"
            value={song.title}
            onChange={(e) => onUpdateSong({ title: e.target.value })}
            placeholder="UNTITLED SONG"
            className="text-base sm:text-lg font-mono font-semibold text-obsidian-50 bg-transparent focus:outline-none placeholder-obsidian-600 truncate max-w-sm"
          />
        </div>

        {/* Right: Key, Status, Saved indicator, Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Key Picker */}
          <div className="flex items-center gap-1 text-xs font-mono text-obsidian-500">
            <span>Key:</span>
            <select
              value={song.key}
              onChange={(e) => onUpdateSong({ key: e.target.value })}
              className="bg-obsidian-900 border border-obsidian-700/60 rounded px-1.5 py-0.5 text-obsidian-200 text-xs font-mono focus:border-accent focus:outline-none"
            >
              {COMMON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <select
            value={song.status}
            onChange={(e) => onUpdateSong({ status: e.target.value as Song['status'] })}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-700/60 text-obsidian-400 focus:border-accent focus:outline-none"
          >
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Finished">Finished</option>
            <option value="Recorded">Recorded</option>
          </select>

          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-obsidian-500">
            <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-accent'}`} />
            <span>{isSaving ? 'Saving...' : 'Saved'}</span>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast"
            title="Copy Lyrics to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-accent" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast"
            title="Download Song Markdown (.md)"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Structure Quick Insertion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        <span className="text-[11px] text-obsidian-600 whitespace-nowrap mr-1">
          + Structure:
        </span>
        {SECTION_TEMPLATES.map((section) => (
          <button
            key={section}
            onClick={() => onInsertSection(`\n${section}\n`)}
            className="px-2 py-0.5 rounded bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-obsidian-600 text-obsidian-400 hover:text-obsidian-100 text-[11px] whitespace-nowrap transition-fast"
          >
            {section}
          </button>
        ))}
      </div>
    </div>
  );
};
