'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Disc3,
  FileText,
  Flame,
  BookOpen,
  Sparkles,
  Music,
  Bookmark,
  Keyboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSongs } from '../../hooks/useSongs';
import { useLexicon } from '../../hooks/useLexicon';
import { useIdeas } from '../../hooks/useIdeas';

interface SidebarProps {
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSearch,
  onOpenShortcuts,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { songs, createSong, activeSong } = useSongs();
  const { lexicon } = useLexicon();
  const { ideas } = useIdeas();

  const handleCreateNewSong = () => {
    const newSong = createSong('UNTITLED TRACK', 92, 'Am');
    router.push(`/write?id=${newSong.id}`);
  };

  const isRouteActive = (path: string) => {
    if (path === '/write' && pathname.startsWith('/write')) return true;
    return pathname === path;
  };

  return (
    <aside
      className={`relative flex flex-col justify-between h-screen bg-obsidian-925 border-r border-obsidian-700/60 transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Section: Brand & Nav */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-obsidian-700/50">
          {!isCollapsed ? (
            <a href="/" className="block space-y-0.5 group">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-widest text-obsidian-50 font-mono group-hover:text-accent transition-fast">
                  BHASHA
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-obsidian-950 text-accent border border-accent/20">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-obsidian-500 font-mono tracking-tight">
                Find the word. Unlock the line.
              </p>
            </a>
          ) : (
            <a href="/" className="mx-auto block" title="BHASHA OS">
              <span className="text-base font-black text-accent font-mono">
                भ
              </span>
            </a>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-obsidian-500 hover:text-obsidian-200 rounded hover:bg-obsidian-850 transition-fast"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Global Search Button */}
        <div className="p-3">
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 text-xs font-mono text-obsidian-400 hover:text-white transition-fast group ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Global Search (⌘P / ⌘K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-accent" />
              {!isCollapsed && <span>Search...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-900 text-obsidian-500 border border-obsidian-700/40">
                ⌘P
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* WRITING */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-widest px-2 block">
                WRITING
              </span>
            )}
            <div className="space-y-0.5">
              <button
                onClick={handleCreateNewSong}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium text-obsidian-300 hover:text-white hover:bg-obsidian-900 transition-fast group ${
                  isCollapsed ? 'justify-center px-0' : ''
                }`}
                title="New Song (⌘N)"
              >
                <Plus className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>New Song</span>
                    <span className="text-[10px] font-mono text-obsidian-500">⌘N</span>
                  </div>
                )}
              </button>

              <a
                href="/write"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/write')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="Writing Studio"
              >
                <Disc3 className={`w-3.5 h-3.5 ${isRouteActive('/write') ? 'text-accent' : 'text-obsidian-500'}`} />
                {!isCollapsed && <span>Studio</span>}
              </a>

              <a
                href="/library/songs"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/library/songs')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="Song Library"
              >
                <FileText className="w-3.5 h-3.5 text-obsidian-500" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Songs</span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      {songs.length}
                    </span>
                  </div>
                )}
              </a>
            </div>
          </div>

          {/* LIBRARY */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-widest px-2 block">
                LIBRARY
              </span>
            )}
            <div className="space-y-0.5">
              <a
                href="/library/lexicon"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/library/lexicon')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="My Lexicon"
              >
                <Bookmark className="w-3.5 h-3.5 text-accent" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Lexicon</span>
                    <span className="text-[10px] font-mono text-accent">
                      {lexicon.length}
                    </span>
                  </div>
                )}
              </a>

              <a
                href="/library/ideas"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/library/ideas')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="Ideas & Fragments"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Ideas</span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      {ideas.length}
                    </span>
                  </div>
                )}
              </a>
            </div>
          </div>

          {/* TOOLS */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-widest px-2 block">
                TOOLS
              </span>
            )}
            <div className="space-y-0.5">
              <a
                href="/explore/rhymes"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/explore/rhymes')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-rhyme-perfect pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="Rhymes Explorer"
              >
                <Flame className="w-3.5 h-3.5 text-rhyme-perfect" />
                {!isCollapsed && <span>Rhymes</span>}
              </a>

              <a
                href="/explore/words"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/explore/words')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-rhyme-strong pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="Word Lexicon"
              >
                <BookOpen className="w-3.5 h-3.5 text-rhyme-strong" />
                {!isCollapsed && <span>Words</span>}
              </a>

              <a
                href="/explore/prompts"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-fast ${
                  isRouteActive('/explore/prompts')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-rhyme-near pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed ? 'justify-center px-0 border-none' : ''}`}
                title="Song Prompts"
              >
                <Sparkles className="w-3.5 h-3.5 text-rhyme-near" />
                {!isCollapsed && <span>Prompts</span>}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Keyboard Shortcuts */}
      <div className="p-3 border-t border-obsidian-700/50 bg-obsidian-950">
        <button
          onClick={onOpenShortcuts}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-obsidian-900 text-xs font-mono text-obsidian-500 hover:text-obsidian-200 transition-fast ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Keyboard Shortcuts"
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-3.5 h-3.5" />
            {!isCollapsed && <span>⌘K Command</span>}
          </div>
          {!isCollapsed && <span className="text-[10px] text-obsidian-600">Keys</span>}
        </button>
      </div>
    </aside>
  );
};
