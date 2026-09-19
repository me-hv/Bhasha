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
  ChevronRight,
  X,
  Home
} from 'lucide-react';
import { useSongs } from '../../hooks/useSongs';
import { useLexicon } from '../../hooks/useLexicon';
import { useIdeas } from '../../hooks/useIdeas';

interface SidebarProps {
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSearch,
  onOpenShortcuts,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { songs, createSong } = useSongs();
  const { lexicon } = useLexicon();
  const { ideas } = useIdeas();

  const handleCreateNewSong = () => {
    const newSong = createSong('UNTITLED TRACK', 92, 'Am');
    if (onCloseMobile) onCloseMobile();
    router.push(`/write?id=${newSong.id}`);
  };

  const handleNavigate = (path: string) => {
    if (onCloseMobile) onCloseMobile();
    router.push(path);
  };

  const isRouteActive = (path: string) => {
    if (path === '/write' && pathname.startsWith('/write')) return true;
    return pathname === path;
  };

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full">
      {/* Top Section: Brand & Nav */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-obsidian-700/50">
          {!isCollapsed || isMobile ? (
            <button
              onClick={() => handleNavigate('/')}
              className="text-left space-y-0.5 group focus:outline-none"
            >
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
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('/')}
              className="mx-auto block focus:outline-none"
              title="BHASHA OS"
            >
              <span className="text-base font-black text-accent font-mono">
                भ
              </span>
            </button>
          )}

          {isMobile ? (
            <button
              onClick={onCloseMobile}
              className="p-2 text-obsidian-400 hover:text-white rounded-lg hover:bg-obsidian-850 transition-fast"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            onToggleCollapse && (
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
            )
          )}
        </div>

        {/* Global Search Button */}
        <div className="p-3">
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onOpenSearch();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-obsidian-600 text-xs font-mono text-obsidian-400 hover:text-white transition-fast group touch-target ${
              isCollapsed && !isMobile ? 'justify-center px-0' : ''
            }`}
            title="Global Search (⌘P / ⌘K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-accent" />
              {(!isCollapsed || isMobile) && <span>Search...</span>}
            </div>
            {(!isCollapsed || isMobile) && (
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-900 text-obsidian-500 border border-obsidian-700/40">
                ⌘P
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 space-y-4 overflow-y-auto max-h-[calc(100dvh-220px)]">
          {/* Quick Home link on mobile */}
          {isMobile && (
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-fast touch-target ${
                  pathname === '/'
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2.5'
                    : 'text-obsidian-300 hover:text-white hover:bg-obsidian-900'
                }`}
              >
                <Home className="w-4 h-4 text-accent" />
                <span>Dashboard</span>
              </button>
            </div>
          )}

          {/* WRITING */}
          <div className="space-y-1">
            {(!isCollapsed || isMobile) && (
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-widest px-2 block">
                WRITING
              </span>
            )}
            <div className="space-y-1 sm:space-y-0.5">
              <button
                onClick={handleCreateNewSong}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium text-obsidian-300 hover:text-white hover:bg-obsidian-900 transition-fast group touch-target ${
                  isCollapsed && !isMobile ? 'justify-center px-0' : ''
                }`}
                title="New Song (⌘N)"
              >
                <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-accent group-hover:scale-110 transition-transform" />
                {(!isCollapsed || isMobile) && (
                  <div className="flex items-center justify-between flex-1">
                    <span>New Song</span>
                    <span className="text-[10px] font-mono text-obsidian-500">⌘N</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleNavigate('/write')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/write')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="Writing Studio"
              >
                <Disc3 className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isRouteActive('/write') ? 'text-accent' : 'text-obsidian-500'}`} />
                {(!isCollapsed || isMobile) && <span>Studio Canvas</span>}
              </button>

              <button
                onClick={() => handleNavigate('/library/songs')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/library/songs')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="Song Library"
              >
                <FileText className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-obsidian-500" />
                {(!isCollapsed || isMobile) && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Songs</span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      {songs.length}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* LIBRARY */}
          <div className="space-y-1">
            {(!isCollapsed || isMobile) && (
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-widest px-2 block">
                LIBRARY
              </span>
            )}
            <div className="space-y-1 sm:space-y-0.5">
              <button
                onClick={() => handleNavigate('/library/lexicon')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/library/lexicon')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="My Lexicon"
              >
                <Bookmark className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-accent" />
                {(!isCollapsed || isMobile) && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Lexicon</span>
                    <span className="text-[10px] font-mono text-accent">
                      {lexicon.length}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleNavigate('/library/ideas')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/library/ideas')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-accent pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="Ideas & Fragments"
              >
                <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-accent" />
                {(!isCollapsed || isMobile) && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Ideas</span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      {ideas.length}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* TOOLS */}
          <div className="space-y-1">
            {(!isCollapsed || isMobile) && (
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-widest px-2 block">
                TOOLS
              </span>
            )}
            <div className="space-y-1 sm:space-y-0.5">
              <button
                onClick={() => handleNavigate('/explore/rhymes')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/explore/rhymes')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-rhyme-perfect pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="Rhymes Explorer"
              >
                <Flame className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-rhyme-perfect" />
                {(!isCollapsed || isMobile) && <span>Rhymes</span>}
              </button>

              <button
                onClick={() => handleNavigate('/explore/words')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/explore/words')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-rhyme-strong pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="Word Lexicon"
              >
                <BookOpen className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-rhyme-strong" />
                {(!isCollapsed || isMobile) && <span>Words</span>}
              </button>

              <button
                onClick={() => handleNavigate('/explore/prompts')}
                className={`w-full flex items-center gap-3 sm:gap-2.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-fast touch-target ${
                  isRouteActive('/explore/prompts')
                    ? 'bg-obsidian-900 text-white font-semibold border-l-2 border-rhyme-near pl-2.5 sm:pl-2'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                } ${isCollapsed && !isMobile ? 'justify-center px-0 border-none' : ''}`}
                title="Song Prompts"
              >
                <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-rhyme-near" />
                {(!isCollapsed || isMobile) && <span>Prompts</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Keyboard Shortcuts / Tips */}
      <div className="p-3 border-t border-obsidian-700/50 bg-obsidian-950">
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            onOpenShortcuts();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-obsidian-900 text-xs font-mono text-obsidian-500 hover:text-obsidian-200 transition-fast touch-target ${
            isCollapsed && !isMobile ? 'justify-center px-0' : ''
          }`}
          title="Keyboard Shortcuts"
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            {(!isCollapsed || isMobile) && <span>Keyboard Map</span>}
          </div>
          {(!isCollapsed || isMobile) && <span className="text-[10px] text-obsidian-600">⌘K</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between h-screen bg-obsidian-925 border-r border-obsidian-700/60 transition-all duration-200 z-30 select-none ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-[100dvh] bg-obsidian-925 border-r border-obsidian-700/80 shadow-2xl z-10 flex flex-col justify-between animate-slide-up">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
