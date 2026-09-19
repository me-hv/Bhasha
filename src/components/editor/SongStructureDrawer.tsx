'use client';

import React from 'react';
import { X, Layers, Plus, Music, AlignLeft, Hash } from 'lucide-react';
import { ParsedSection } from '../../types';

interface SongStructureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: ParsedSection[];
  onInsertSection: (sectionTag: string) => void;
  onScrollToLine?: (lineIndex: number) => void;
}

const SECTION_TEMPLATES = [
  { tag: '[Verse 1]', label: 'Verse 1' },
  { tag: '[Verse 2]', label: 'Verse 2' },
  { tag: '[Verse 3]', label: 'Verse 3' },
  { tag: '[Hook]', label: 'Hook' },
  { tag: '[Chorus]', label: 'Chorus' },
  { tag: '[Bridge]', label: 'Bridge' },
  { tag: '[Intro]', label: 'Intro' },
  { tag: '[Outro]', label: 'Outro' },
  { tag: '[Pre-Chorus]', label: 'Pre-Chorus' },
  { tag: '[Beat Drop]', label: 'Beat Drop' },
];

export const SongStructureDrawer: React.FC<SongStructureDrawerProps> = ({
  isOpen,
  onClose,
  sections,
  onInsertSection,
  onScrollToLine,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:relative md:w-96 md:inset-auto h-full bg-obsidian-925 border-l border-obsidian-700/60 flex flex-col justify-between shadow-2xl select-none animate-slide-up md:animate-fade-in">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-obsidian-700/60 bg-obsidian-950">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono font-semibold text-obsidian-200 tracking-wider uppercase">
                Song Structure
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-obsidian-400 hover:text-white rounded-lg hover:bg-obsidian-850 transition-fast touch-target flex items-center justify-center"
              title="Close Structure Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Sections List */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100dvh-230px)]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block mb-1">
                ARRANGEMENT ({sections.length} {sections.length === 1 ? 'Section' : 'Sections'})
              </span>

              {sections.length > 0 ? (
                <div className="space-y-1.5">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      onClick={() => {
                        if (onScrollToLine) onScrollToLine(sec.startLineIndex);
                      }}
                      className="flex items-center justify-between px-3.5 py-3 rounded-lg bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-accent cursor-pointer transition-fast group touch-target"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-mono text-obsidian-500 group-hover:text-accent">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm sm:text-xs font-mono font-semibold text-white group-hover:text-accent transition-fast">
                          {sec.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-900 text-obsidian-400 border border-obsidian-800 group-hover:border-accent/40 group-hover:text-accent">
                          {sec.barCount} {sec.barCount === 1 ? 'bar' : 'bars'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center rounded bg-obsidian-950 border border-obsidian-800 text-obsidian-500 text-xs font-mono">
                  No sections defined yet. Add a section below.
                </div>
              )}
            </div>

            {/* Quick Insert Section Chips */}
            <div className="pt-4 border-t border-obsidian-700/50 space-y-2">
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block">
                + Insert New Section
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SECTION_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.tag}
                    onClick={() => onInsertSection(`\n${tmpl.tag}\n`)}
                    className="flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-lg bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-obsidian-500 text-xs font-mono text-obsidian-300 hover:text-white transition-fast group text-left touch-target"
                  >
                    <span className="truncate">{tmpl.label}</span>
                    <Plus className="w-3.5 h-3.5 text-obsidian-500 group-hover:text-accent opacity-70 group-hover:opacity-100 transition-fast" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-obsidian-700/60 bg-obsidian-950 text-[10px] font-mono text-obsidian-500 text-center">
          Click section to jump · ⌘Shift+S to toggle
        </div>
      </div>
    </>
  );
};
