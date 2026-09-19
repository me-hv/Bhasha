'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Music,
  Plus,
  Search,
  Trash2,
  Copy,
  Download,
  Check,
  Disc3,
  ExternalLink,
  Archive,
  RotateCcw,
  Upload,
  FileDown,
  ArrowUpDown,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useSongs } from '../../../hooks/useSongs';
import { useLexicon } from '../../../hooks/useLexicon';
import { useIdeas } from '../../../hooks/useIdeas';
import { Song, BhashaProjectBackup } from '../../../types';
import {
  downloadTextFile,
  formatSongMarkdown,
  formatSongTxt,
  copyToClipboard,
  exportProjectJson,
  validateAndImportProjectJson
} from '../../../lib/utils/export';
import { EmptyState } from '../../../components/ui/EmptyState';
import { getStoredVersions } from '../../../lib/storage/songs';
import { setToStorage, STORAGE_KEYS } from '../../../lib/storage/storage';

type StatusFilter = 'ALL' | 'IN PROGRESS' | 'COMPLETE' | 'ARCHIVED';
type SortOrder = 'recent_edited' | 'recent_created' | 'alphabetical' | 'bar_count';

function calculateBarCount(content: string): number {
  if (!content) return 0;
  return content
    .split('\n')
    .filter(l => l.trim() && !l.trim().startsWith('[') && !l.trim().endsWith(']'))
    .length;
}

function calculateSectionCount(content: string): number {
  if (!content) return 0;
  return content
    .split('\n')
    .filter(l => l.trim().startsWith('[') && l.trim().endsWith(']'))
    .length;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'just now';
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return 'recently';
  }
}

export default function MySongsPage() {
  const router = useRouter();
  const {
    songs,
    createSong,
    selectSong,
    deleteSong,
    duplicateSong,
    archiveSong,
    restoreSong
  } = useSongs();
  const { lexicon } = useLexicon();
  const { ideas } = useIdeas();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent_edited');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [deleteConfirmSong, setDeleteConfirmSong] = useState<Song | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<{
    backup: BhashaProjectBackup;
    counts: { songs: number; versions: number; lexicon: number; ideas: number };
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Sort Logic
  const filteredAndSortedSongs = useMemo(() => {
    let result = [...songs];

    // 1. Status Filtering
    if (statusFilter === 'ARCHIVED') {
      result = result.filter(s => (s.status || '').toUpperCase() === 'ARCHIVED');
    } else {
      // For ALL / IN PROGRESS / COMPLETE, hide ARCHIVED unless explicitly on ARCHIVED tab
      if (statusFilter !== 'ALL') {
        result = result.filter(s => (s.status || '').toUpperCase() === statusFilter);
      } else {
        result = result.filter(s => (s.status || '').toUpperCase() !== 'ARCHIVED');
      }
    }

    // 2. Search Query (Title, Section headers, Lyrics)
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(s => (
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q))) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      ));
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOrder === 'recent_edited') {
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      }
      if (sortOrder === 'recent_created') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortOrder === 'bar_count') {
        return calculateBarCount(b.content) - calculateBarCount(a.content);
      }
      return 0;
    });

    return result;
  }, [songs, statusFilter, query, sortOrder]);

  const handleOpenSong = (songId: string) => {
    selectSong(songId);
    router.push(`/write?id=${songId}`);
  };

  const handleCreateNew = () => {
    const newSong = createSong('UNTITLED TRACK', 92, 'Am');
    router.push(`/write?id=${newSong.id}`);
  };

  const handleCopy = (song: Song) => {
    copyToClipboard(song.content);
    setCopiedId(song.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownloadMd = (song: Song) => {
    const markdown = formatSongMarkdown(song);
    const filename = `${song.title.toLowerCase().replace(/\s+/g, '_') || 'song'}.md`;
    downloadTextFile(filename, markdown);
  };

  const handleDownloadTxt = (song: Song) => {
    const txt = formatSongTxt(song);
    const filename = `${song.title.toLowerCase().replace(/\s+/g, '_') || 'song'}.txt`;
    downloadTextFile(filename, txt);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmSong) return;
    deleteSong(deleteConfirmSong.id);
    setDeleteConfirmSong(null);
  };

  // Backup & Import Project
  const handleExportProjectBackup = () => {
    const allVersions = getStoredVersions();
    const backup: BhashaProjectBackup = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      bhashaVersion: '1.0.0',
      songs,
      versions: allVersions,
      lexicon,
      collections: ['NIGHT', 'EMOTIONS', 'DELHI', 'LOVE', 'ANGER', 'STREET', 'MONEY', 'SPIRITUAL', 'TECHNICAL', 'HOOK WORDS'],
      ideas,
    };

    const json = exportProjectJson(backup);
    downloadTextFile(`bhasha_project_backup_${new Date().toISOString().slice(0, 10)}.json`, json);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateAndImportProjectJson(content);
      if (res.success && res.data && res.counts) {
        setImportPreviewData({ backup: res.data, counts: res.counts });
        setImportError(null);
      } else {
        setImportError(res.error || 'Failed to parse backup file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = () => {
    if (!importPreviewData) return;
    const { backup } = importPreviewData;

    // Apply backup to localStorage and reload
    setToStorage(STORAGE_KEYS.SONGS, backup.songs);
    setToStorage(STORAGE_KEYS.VERSIONS, backup.versions || []);
    setToStorage(STORAGE_KEYS.SAVED_LEXICON, backup.lexicon || []);
    if (backup.collections) setToStorage(STORAGE_KEYS.COLLECTIONS, backup.collections);
    if (backup.ideas) setToStorage(STORAGE_KEYS.IDEAS, backup.ideas);

    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto px-4 sm:px-10 md:px-16 py-6 sm:py-10 md:py-16 pb-24 md:pb-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-obsidian-700/60">
          <div>
            <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
              LIBRARY
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
              Song Library
            </h1>
            <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
              Your catalog of tracks, verses, and writing sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Backup Project */}
            <button
              onClick={handleExportProjectBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast"
              title="Backup entire project as JSON"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>

            {/* Import Project */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast"
              title="Import project backup JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* New Song Button */}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-mono font-bold text-xs tracking-wider transition-fast shadow-glow-subtle active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ NEW SONG</span>
            </button>
          </div>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="space-y-3">
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 focus-within:border-accent">
              <Search className="w-4 h-4 text-accent" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search songs by title, lyrics, sections, or tags..."
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none"
              />
            </div>

            {/* Sort Picker */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-obsidian-925 border border-obsidian-700/60 text-xs font-mono text-obsidian-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-obsidian-500" />
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-transparent text-obsidian-200 focus:outline-none cursor-pointer"
              >
                <option value="recent_edited" className="bg-obsidian-900">Recently edited</option>
                <option value="recent_created" className="bg-obsidian-900">Recently created</option>
                <option value="alphabetical" className="bg-obsidian-900">Alphabetical</option>
                <option value="bar_count" className="bg-obsidian-900">Bar count</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['ALL', 'IN PROGRESS', 'COMPLETE', 'ARCHIVED'] as StatusFilter[]).map((tab) => {
              const count = songs.filter(s => {
                const st = (s.status || '').toUpperCase();
                if (tab === 'ALL') return st !== 'ARCHIVED';
                return st === tab;
              }).length;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-fast whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === tab
                      ? 'bg-obsidian-100 text-obsidian-950 font-bold'
                      : 'bg-obsidian-925 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Songs List */}
        {filteredAndSortedSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAndSortedSongs.map((song) => {
              const bars = calculateBarCount(song.content);
              const sections = calculateSectionCount(song.content);
              const isCopied = copiedId === song.id;
              const isArchived = (song.status || '').toUpperCase() === 'ARCHIVED';

              return (
                <div
                  key={song.id}
                  className="p-5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          onClick={() => handleOpenSong(song.id)}
                          className="text-base sm:text-lg font-mono font-semibold text-obsidian-50 group-hover:text-accent transition-fast cursor-pointer"
                        >
                          {song.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-mono text-obsidian-500">
                          <span>{song.bpm} BPM</span>
                          <span>·</span>
                          <span>Key: {song.key}</span>
                          <span>·</span>
                          <span className="text-obsidian-400">{song.status || 'DRAFT'}</span>
                        </div>
                      </div>

                      {/* Action icons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(song)}
                          className="p-1.5 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
                          title="Copy lyrics"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDownloadMd(song)}
                          className="p-1.5 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
                          title="Download Markdown (.md)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => duplicateSong(song.id)}
                          className="p-1.5 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
                          title="Duplicate Song"
                        >
                          <Disc3 className="w-3.5 h-3.5" />
                        </button>

                        {isArchived ? (
                          <button
                            onClick={() => restoreSong(song.id)}
                            className="p-1.5 text-obsidian-500 hover:text-accent rounded hover:bg-obsidian-900 transition-fast"
                            title="Restore Song to Active"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => archiveSong(song.id)}
                            className="p-1.5 text-obsidian-500 hover:text-amber-400 rounded hover:bg-obsidian-900 transition-fast"
                            title="Archive Song"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirmSong(song)}
                          className="p-1.5 text-obsidian-500 hover:text-red-400 rounded hover:bg-obsidian-900 transition-fast"
                          title="Delete Song"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lyrics Preview */}
                    <div
                      onClick={() => handleOpenSong(song.id)}
                      className="p-3 rounded bg-obsidian-950 border border-obsidian-700/40 text-xs font-devanagari text-obsidian-300 cursor-pointer line-clamp-3 hover:text-white transition-fast"
                    >
                      {song.content || 'Empty song draft...'}
                    </div>

                    {/* Tags */}
                    {song.tags && song.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {song.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-obsidian-950 text-obsidian-500 border border-obsidian-700/40"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-obsidian-700/40 text-xs font-mono text-obsidian-500">
                    <span>
                      {bars} {bars === 1 ? 'bar' : 'bars'} · {sections} {sections === 1 ? 'section' : 'sections'} · {formatRelativeTime(song.updatedAt)}
                    </span>

                    <button
                      onClick={() => handleOpenSong(song.id)}
                      className="flex items-center gap-1 text-accent hover:underline font-medium"
                    >
                      <span>Open in Studio</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            headline="No songs yet."
            subline="Start with one line. The rest will follow."
            actionLabel="+ New Song"
            onAction={handleCreateNew}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setDeleteConfirmSong(null)}
        >
          <div
            className="w-full max-w-md bg-obsidian-925 border border-red-500/40 rounded-lg p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-mono font-bold text-white">
                Delete Song Permanently?
              </h3>
            </div>

            <p className="text-xs font-mono text-obsidian-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">&quot;{deleteConfirmSong.title}&quot;</strong> and all associated snapshots? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeleteConfirmSong(null)}
                className="px-3 py-1.5 rounded text-obsidian-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {importPreviewData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setImportPreviewData(null)}
        >
          <div
            className="w-full max-w-md bg-obsidian-925 border border-accent/40 rounded-lg p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-accent">
              <Upload className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-mono font-bold text-white">
                Confirm Project Import
              </h3>
            </div>

            <p className="text-xs font-mono text-obsidian-300">
              Backup version {importPreviewData.backup.schemaVersion} verified successfully.
            </p>

            <div className="p-3 bg-obsidian-950 rounded border border-obsidian-800 space-y-1 text-xs font-mono text-obsidian-300">
              <div>• <strong>{importPreviewData.counts.songs}</strong> Songs</div>
              <div>• <strong>{importPreviewData.counts.versions}</strong> Version Snapshots</div>
              <div>• <strong>{importPreviewData.counts.lexicon}</strong> Lexicon Words</div>
              <div>• <strong>{importPreviewData.counts.ideas}</strong> Creative Ideas</div>
            </div>

            <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setImportPreviewData(null)}
                className="px-3 py-1.5 rounded text-obsidian-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-3.5 py-1.5 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-bold"
              >
                Import & Replace Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Error Modal */}
      {importError && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setImportError(null)}
        >
          <div
            className="w-full max-w-md bg-obsidian-925 border border-red-500/40 rounded-lg p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-mono font-bold text-white">
                Import Error
              </h3>
            </div>

            <p className="text-xs font-mono text-red-300 leading-relaxed">
              {importError}
            </p>

            <div className="flex justify-end pt-2 font-mono text-xs">
              <button
                onClick={() => setImportError(null)}
                className="px-3.5 py-1.5 rounded bg-obsidian-800 text-white font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
