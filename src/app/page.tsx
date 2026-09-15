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
  Loader2
} from 'lucide-react';
import { useSongs } from '../hooks/useSongs';
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
  const { songs, createSong, selectSong, isLoaded } = useSongs();
  const greeting = useMemo(() => getTimeGreeting(), []);

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
    <div className="h-full w-full bg-obsidian-950 overflow-y-auto select-none px-6 sm:px-12 md:px-20 py-12 md:py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Editorial Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-obsidian-700/60">
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

        {/* Recent Songs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-obsidian-500 uppercase tracking-widest">
              RECENT
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
            {songs.slice(0, 4).map((song) => {
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
                      {song.status}
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

        {/* Quick Explore Triggers */}
        <div className="space-y-4 pt-4">
          <span className="text-xs font-mono font-semibold text-obsidian-500 uppercase tracking-widest">
            QUICK EXPLORE
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
              href="/explore/prompts"
              className="p-4 rounded-lg bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-obsidian-950 border border-obsidian-700/60 flex items-center justify-center text-rhyme-near">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-medium text-obsidian-200 group-hover:text-white transition-fast">
                    Give me an idea
                  </h4>
                  <p className="text-[11px] text-obsidian-500 font-sans">
                    Songwriting prompts & rhyme anchors
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
                    Personal saved vocabulary bank
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-obsidian-600 group-hover:text-obsidian-300 group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Quiet Brand Footer */}
        <div className="pt-8 border-t border-obsidian-700/40 flex items-center justify-between text-xs font-mono text-obsidian-500">
          <span>BHASHA OS · Songwriting Instrument</span>
          <span>Find the word. Unlock the line.</span>
        </div>
      </div>
    </div>
  );
}
