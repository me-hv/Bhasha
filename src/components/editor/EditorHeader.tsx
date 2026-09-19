'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Song, WritingMode, SongStatus } from '../../types';
import {
  ArrowLeft,
  Copy,
  Download,
  Check,
  Layers,
  BarChart3,
  Sparkles,
  PenTool,
  Flame,
  Activity,
  Target,
  History,
  FileText
} from 'lucide-react';
import { copyToClipboard, downloadTextFile, formatSongMarkdown, formatSongTxt } from '../../lib/utils/export';

interface EditorHeaderProps {
  song: Song;
  onUpdateSong: (updated: Partial<Song>) => void;
  onInsertSection: (sectionTag: string) => void;
  isSaving?: boolean;
  mode: WritingMode;
  onModeChange: (mode: WritingMode) => void;
  targetSyllables: number;
  onTargetSyllablesChange: (count: number) => void;
  onOpenStructure?: () => void;
  onOpenStats?: () => void;
  onOpenStuck?: () => void;
  onOpenNotes?: () => void;
  onOpenVersions?: () => void;
}

const COMMON_KEYS = ['Am', 'Em', 'Dm', 'Cm', 'F#m', 'Gm', 'Bm', 'C', 'G', 'D', 'A', 'F'];
const TARGET_SYLLABLE_OPTIONS = [8, 10, 12, 14, 16];

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  song,
  onUpdateSong,
  onInsertSection,
  isSaving = false,
  mode,
  onModeChange,
  targetSyllables,
  onTargetSyllablesChange,
  onOpenStructure,
  onOpenStats,
  onOpenStuck,
  onOpenNotes,
  onOpenVersions,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleCopy = () => {
    copyToClipboard(song.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const markdown = formatSongMarkdown(song);
    const filename = `${song.title.toLowerCase().replace(/\s+/g, '_') || 'song'}.md`;
    downloadTextFile(filename, markdown);
    setIsExportOpen(false);
  };

  const handleDownloadTxt = () => {
    const txt = formatSongTxt(song);
    const filename = `${song.title.toLowerCase().replace(/\s+/g, '_') || 'song'}.txt`;
    downloadTextFile(filename, txt);
    setIsExportOpen(false);
  };

  const normalizedStatus = (song.status || 'DRAFT').toUpperCase();

  return (
    <div className="border-b border-obsidian-700/60 bg-obsidian-950/95 px-3 sm:px-6 md:px-8 py-2 sm:py-3 space-y-2 select-none">
      {/* Top Bar: Back Link, Title, Status, Saved, Notes, Versions, Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        {/* Left: Back to songs & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
          <button
            onClick={() => router.push('/library/songs')}
            className="flex items-center gap-1 text-xs font-mono text-obsidian-500 hover:text-obsidian-200 transition-fast p-1 -ml-1 rounded touch-manipulation"
            title="Back to all songs"
          >
            <ArrowLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Songs</span>
          </button>

          <span className="text-obsidian-700 font-mono hidden sm:inline">/</span>

          <input
            type="text"
            value={song.title}
            onChange={(e) => onUpdateSong({ title: e.target.value })}
            placeholder="UNTITLED SONG"
            className="text-sm sm:text-base font-mono font-semibold text-obsidian-50 bg-transparent focus:outline-none placeholder-obsidian-600 truncate flex-1 min-w-[120px]"
          />
        </div>

        {/* Right: Key, Status, Saved indicator, Notes, Versions, Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Key Picker */}
          <div className="flex items-center gap-1 text-xs font-mono text-obsidian-500">
            <span className="hidden xs:inline">Key:</span>
            <select
              value={song.key}
              onChange={(e) => onUpdateSong({ key: e.target.value })}
              className="bg-obsidian-900 border border-obsidian-700/60 rounded px-1.5 py-1 text-obsidian-200 text-xs font-mono focus:border-accent focus:outline-none touch-manipulation"
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
            value={normalizedStatus}
            onChange={(e) => onUpdateSong({ status: e.target.value as SongStatus })}
            className="text-[11px] font-mono px-2 py-1 rounded bg-obsidian-900 border border-obsidian-700/60 text-obsidian-400 focus:border-accent focus:outline-none touch-manipulation"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="COMPLETE">COMPLETE</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-obsidian-500 px-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-accent'}`} />
            <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Saved'}</span>
          </div>

          {/* Notes Drawer Toggle */}
          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast touch-manipulation"
              title="Creative Notes & Song Vocabulary"
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Notes</span>
            </button>
          )}

          {/* Versions History Toggle */}
          {onOpenVersions && (
            <button
              onClick={onOpenVersions}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast touch-manipulation"
              title="Version History & Snapshots (⌘⇧V to Save)"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Versions</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast touch-manipulation"
            title="Copy Lyrics to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast touch-manipulation"
              title="Export lyrics"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {isExportOpen && (
              <div
                className="absolute right-0 mt-1 w-36 bg-obsidian-900 border border-obsidian-700/80 rounded shadow-xl py-1 z-50 text-xs font-mono animate-fade-in"
                onMouseLeave={() => setIsExportOpen(false)}
              >
                <button
                  onClick={handleDownloadMd}
                  className="w-full text-left px-3 py-2 hover:bg-obsidian-800 text-obsidian-200 hover:text-white touch-manipulation"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="w-full text-left px-3 py-2 hover:bg-obsidian-800 text-obsidian-200 hover:text-white touch-manipulation"
                >
                  Plain Text (.txt)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Mode Switcher (WRITE / RHYME / FLOW), Target Syllables, Structure & Stuck buttons */}
      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-obsidian-800/60 overflow-x-auto no-scrollbar">
        {/* Left: Mode Switcher (WRITE, RHYME, FLOW) */}
        <div className="flex items-center gap-1 bg-obsidian-900/90 border border-obsidian-700/60 rounded p-0.5 shrink-0">
          <button
            onClick={() => onModeChange('write')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs font-mono transition-fast touch-manipulation ${
              mode === 'write'
                ? 'bg-obsidian-800 text-white font-semibold border border-obsidian-600 shadow-sm'
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
            title="Pure Writing Canvas"
          >
            <PenTool className="w-3 h-3" />
            <span>WRITE</span>
          </button>

          <button
            onClick={() => onModeChange('rhyme')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs font-mono transition-fast touch-manipulation ${
              mode === 'rhyme'
                ? 'bg-rhyme-perfect/20 text-rhyme-perfect font-semibold border border-rhyme-perfect/50 shadow-sm'
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
            title="Rhyme Chains & Internal Rhyme Discovery (⌘Shift+R)"
          >
            <Flame className="w-3 h-3" />
            <span>RHYME</span>
          </button>

          <button
            onClick={() => onModeChange('flow')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs font-mono transition-fast touch-manipulation ${
              mode === 'flow'
                ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/50 shadow-sm'
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
            title="Syllable Meter & Flow Density (⌘Shift+F)"
          >
            <Activity className="w-3 h-3" />
            <span>FLOW</span>
          </button>
        </div>

        {/* Right Controls: Target Syllables, Structure, Stats, I'M STUCK */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Target Syllables (Flow / Rhyme mode) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-obsidian-900 border border-obsidian-700/60 rounded px-2 py-1 text-xs font-mono text-obsidian-400">
            <Target className="w-3 h-3 text-obsidian-500" />
            <span className="text-[11px] text-obsidian-500 hidden xs:inline">Target:</span>
            <select
              value={targetSyllables}
              onChange={(e) => onTargetSyllablesChange(Number(e.target.value))}
              className="bg-transparent text-accent font-bold focus:outline-none cursor-pointer touch-manipulation"
            >
              {TARGET_SYLLABLE_OPTIONS.map((count) => (
                <option key={count} value={count} className="bg-obsidian-900 text-obsidian-100">
                  {count} syls
                </option>
              ))}
            </select>
          </div>

          {/* I'M STUCK Catalyst */}
          {onOpenStuck && (
            <button
              onClick={onOpenStuck}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded bg-accent/15 hover:bg-accent/25 border border-accent/40 text-xs font-mono text-accent transition-fast active:scale-95 touch-manipulation whitespace-nowrap"
              title="Creative Catalyst & Idea Seeds (⌘Shift+I)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ I&apos;M STUCK</span>
            </button>
          )}

          {/* Structure Drawer Toggle */}
          {onOpenStructure && (
            <button
              onClick={onOpenStructure}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast touch-manipulation"
              title="Toggle Song Structure (⌘Shift+S)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Structure</span>
            </button>
          )}

          {/* Stats Modal Toggle */}
          {onOpenStats && (
            <button
              onClick={onOpenStats}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast touch-manipulation"
              title="Writing Analytics & Rhyme Density"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Stats</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
