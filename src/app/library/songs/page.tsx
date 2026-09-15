'use client';

import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useSongs } from '../../../hooks/useSongs';
import { Song } from '../../../types';
import { downloadTextFile, formatSongMarkdown, copyToClipboard } from '../../../lib/utils/export';
import { EmptyState } from '../../../components/ui/EmptyState';

function calculateBarCount(content: string): number {
  if (!content) return 0;
  return content
    .split('\n')
    .filter(l => l.trim() && !l.trim().startsWith('[') && !l.trim().endsWith(']'))
    .length;
}

export default function MySongsPage() {
  const router = useRouter();
  const { songs, createSong, selectSong, deleteSong, duplicateSong } = useSongs();
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSongs = React.useMemo(() => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase().trim();
    return songs.filter(s => (
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    ));
  }, [songs, query]);

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

  const handleDownload = (song: Song) => {
    const markdown = formatSongMarkdown(song);
    const filename = `${song.title.toLowerCase().replace(/\s+/g, '_') || 'song'}.md`;
    downloadTextFile(filename, markdown);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto p-6 sm:p-12 md:p-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-obsidian-700/60">
          <div>
            <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
              LIBRARY
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
              My Songs & Drafts
            </h1>
            <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
              All your tracks, verses, and hooks preserved in your local browser storage.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-mono font-bold text-xs tracking-wider transition-fast self-start sm:self-auto shadow-glow-subtle active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ NEW SONG</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 focus-within:border-accent">
          <Search className="w-4 h-4 text-accent" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs by title, lyrics, or tags..."
            className="w-full bg-transparent text-xs sm:text-sm font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none"
          />
        </div>

        {/* Songs List */}
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSongs.map((song) => {
              const bars = calculateBarCount(song.content);
              const wordCount = song.content.split(/\s+/).filter(Boolean).length;
              const isCopied = copiedId === song.id;

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
                          <span className="text-obsidian-400">{song.status}</span>
                        </div>
                      </div>

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
                          onClick={() => handleDownload(song)}
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

                        {songs.length > 1 && (
                          <button
                            onClick={() => deleteSong(song.id)}
                            className="p-1.5 text-obsidian-500 hover:text-red-400 rounded hover:bg-obsidian-900 transition-fast"
                            title="Delete Song"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
                      {bars} {bars === 1 ? 'bar' : 'bars'} · {wordCount} words
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
    </div>
  );
}
