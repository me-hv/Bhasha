'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ArrowRight,
  Flame,
  BookOpen,
  Sparkles,
  Bookmark,
  Music,
  Disc3,
  Clock,
  Loader2,
  PenTool,
  Lightbulb
} from 'lucide-react';
import { useSongs } from '../hooks/useSongs';
import { useLexicon } from '../hooks/useLexicon';
import { Song } from '../types';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good morning.';
  if (hour >= 12 && hour < 17) return 'Good afternoon.';
  if (hour >= 17 && hour < 22) return 'Good evening.';
  return 'Late night reflection.';
}

function formatRelativeTime(dateStr: string): string {
  try {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return 'recently';
  }
}

function calculateBarCount(content: string): number {
  if (!content) return 0;
  return content
    .split('\n')
    .filter(l => l.trim() && !l.trim().startsWith('[') && !l.trim().endsWith(']'))
    .length;
}

export default function StudioHomePage() {
  const router = useRouter();
  const { songs, createSong, selectSong, activeSong, isLoaded } = useSongs();
  const { recentWords } = useLexicon();
  const greeting = useMemo(() => getTimeGreeting(), []);

  // Most recently edited active song
  const mostRecentSong = useMemo(() => {
    const activeSongs = songs.filter(s => (s.status || '').toUpperCase() !== 'ARCHIVED');
    if (activeSongs.length === 0) return null;
    return [...activeSongs].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())[0];
  }, [songs]);

  const handleCreateNewSong = () => {
    const newSong = createSong('UNTITLED TRACK', 92, 'Am');
    router.push(`/write?id=${newSong.id}`);
  };

  const handleOpenSong = (songId: string) => {
    selectSong(songId);
    router.push(`/write?id=${songId}`);
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-obsidian-950 text-obsidian-500 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-accent mb-2" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-obsidian-950 overflow-y-auto select-none px-4 sm:px-10 md:px-20 py-6 sm:py-12 md:py-16 pb-24 md:pb-16 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
        {/* Editorial Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-obsidian-700/60">
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest">
              Writing Studio
            </span>
            <h1 className="text-3xl sm:text-4xl font-light text-obsidian-50 font-sans tracking-tight">
              {greeting}
            </h1>
            <p className="text-lg sm:text-xl text-obsidian-400 font-sans font-light">
              What are you writing?
            </p>
          </div>

          <button
            onClick={handleCreateNewSong}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-mono font-bold text-xs tracking-wider transition-fast self-start sm:self-auto shadow-glow-subtle hover:shadow-glow-emerald active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ NEW SONG</span>
          </button>
        </div>

        {/* Continue Writing Hero Card */}
        {mostRecentSong && (
          <div
            onClick={() => handleOpenSong(mostRecentSong.id)}
            className="p-6 rounded-lg bg-obsidian-925 border border-accent/40 hover:border-accent shadow-panel transition-fast cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                  CONTINUE WRITING
                </span>
                <h2 className="text-xl sm:text-2xl font-mono font-bold text-white group-hover:text-accent transition-fast">
                  {mostRecentSong.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-obsidian-400">
                  <span>{calculateBarCount(mostRecentSong.content)} bars</span>
                  <span>·</span>
                  <span>{mostRecentSong.bpm} BPM</span>
                  <span>·</span>
                  <span>Key: {mostRecentSong.key}</span>
                  <span>·</span>
                  <span>Edited {formatRelativeTime(mostRecentSong.updatedAt)}</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-obsidian-950 transition-all">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Lyric Snippet */}
            <div className="p-3 rounded bg-obsidian-950 border border-obsidian-800 text-xs font-devanagari text-obsidian-300 line-clamp-2">
              {mostRecentSong.content.split('\n').filter(l => l.trim() && !l.trim().startsWith('[')).slice(0, 2).join(' · ') || 'Empty draft canvas...'}
            </div>
          </div>
        )}

        {/* Recent Songs List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-obsidian-500 uppercase tracking-widest">
              RECENT SONGS
            </span>
            <a
              href="/library/songs"
              className="text-xs font-mono text-obsidian-500 hover:text-obsidian-300 transition-fast flex items-center gap-1"
            >
              <span>All Songs ({songs.length})</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="divide-y divide-obsidian-700/40 rounded-lg bg-obsidian-925 border border-obsidian-700/60 overflow-hidden">
            {songs.filter(s => (s.status || '').toUpperCase() !== 'ARCHIVED').slice(0, 4).map((song) => {
              const bars = calculateBarCount(song.content);
              return (
                <div
                  key={song.id}
                  onClick={() => handleOpenSong(song.id)}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-obsidian-900 transition-fast cursor-pointer group"
                >
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-mono font-semibold text-obsidian-50 group-hover:text-accent transition-fast">
                      {song.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-obsidian-500">
                      <span>{bars} {bars === 1 ? 'bar' : 'bars'}</span>
                      <span>·</span>
                      <span>{song.bpm} BPM</span>
                      <span>·</span>
                      <span>Key: {song.key}</span>
                      <span>·</span>
                      <span>Updated {formatRelativeTime(song.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-950 text-obsidian-400 border border-obsidian-700/50">
                      {song.status || 'DRAFT'}
                    </span>
                    <span className="text-xs font-mono text-obsidian-600 group-hover:text-accent group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Vocabulary Strip */}
        {recentWords && recentWords.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-obsidian-500 uppercase tracking-widest block">
              RECENT VOCABULARY
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {recentWords.slice(0, 8).map((word) => (
                <a
                  key={word}
                  href={`/explore/rhymes?q=${encodeURIComponent(word)}`}
                  className="px-3 py-1.5 rounded bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-accent text-sm font-devanagari text-obsidian-200 hover:text-white transition-fast whitespace-nowrap"
                >
                  {word}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Quick Explore Triggers */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono font-semibold text-obsidian-500 uppercase tracking-widest">
            QUICK ACTIONS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/explore/rhymes"
              className="p-4 rounded-lg bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-obsidian-950 border border-obsidian-700/60 flex items-center justify-center text-rhyme-perfect">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-medium text-obsidian-200 group-hover:text-white transition-fast">
                    Find a rhyme
                  </h4>
                  <p className="text-[11px] text-obsidian-500 font-sans">
                    Phonetic & Roman Hindi search
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-obsidian-600 group-hover:text-obsidian-300 group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href="/explore/words"
              className="p-4 rounded-lg bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-obsidian-950 border border-obsidian-700/60 flex items-center justify-center text-rhyme-strong">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-medium text-obsidian-200 group-hover:text-white transition-fast">
                    Explore a word
                  </h4>
                  <p className="text-[11px] text-obsidian-500 font-sans">
                    150+ hip-hop & poetic root words
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-obsidian-600 group-hover:text-obsidian-300 group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href="/library/ideas"
              className="p-4 rounded-lg bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-obsidian-950 border border-obsidian-700/60 flex items-center justify-center text-accent">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-medium text-obsidian-200 group-hover:text-white transition-fast">
                    Ideas & Fragments
                  </h4>
                  <p className="text-[11px] text-obsidian-500 font-sans">
                    Private creative memory bank
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-obsidian-600 group-hover:text-obsidian-300 group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href="/library/lexicon"
              className="p-4 rounded-lg bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-obsidian-950 border border-obsidian-700/60 flex items-center justify-center text-accent">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-medium text-obsidian-200 group-hover:text-white transition-fast">
                    Open my lexicon
                  </h4>
                  <p className="text-[11px] text-obsidian-500 font-sans">
                    Personal saved vocabulary collections
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-obsidian-600 group-hover:text-obsidian-300 group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Quiet Brand Footer */}
        <div className="pt-6 border-t border-obsidian-700/40 flex items-center justify-between text-xs font-mono text-obsidian-500">
          <span>BHASHA OS · Songwriting Instrument</span>
          <span>Find the word. Unlock the line. Build the verse.</span>
        </div>
      </div>
    </div>
  );
}
