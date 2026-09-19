'use client';

import React, { useState } from 'react';
import { Song } from '../../types';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Bookmark,
  X
} from 'lucide-react';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  onUpdateSong: (updated: Partial<Song>) => void;
  onInsertWord: (word: string) => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({
  isOpen,
  onClose,
  song,
  onUpdateSong,
  onInsertWord,
}) => {
  const [newRhymeInput, setNewRhymeInput] = useState('');

  if (!isOpen) return null;

  const handleAddStashedRhyme = () => {
    if (!newRhymeInput.trim()) return;
    const current = song.stashedRhymes || [];
    if (!current.includes(newRhymeInput.trim())) {
      onUpdateSong({
        stashedRhymes: [...current, newRhymeInput.trim()],
      });
    }
    setNewRhymeInput('');
  };

  const handleRemoveStashedRhyme = (word: string) => {
    const current = song.stashedRhymes || [];
    onUpdateSong({
      stashedRhymes: current.filter(w => w !== word),
    });
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:relative md:w-96 md:inset-auto h-full bg-obsidian-900 border-l border-obsidian-700 flex flex-col justify-between shadow-2xl select-none animate-slide-up md:animate-fade-in">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-3.5 border-b border-obsidian-700 bg-obsidian-950">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                SCRATCHPAD & STASH
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-obsidian-400 hover:text-white rounded-lg hover:bg-obsidian-800 transition touch-target flex items-center justify-center"
              title="Close Scratchpad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100dvh-140px)]">
            {/* Notes Area */}
            <div>
              <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1.5">
                Idea Notes & Punchline Angles
              </label>
              <textarea
                value={song.scratchpadNotes || ''}
                onChange={(e) => onUpdateSong({ scratchpadNotes: e.target.value })}
                placeholder="Dump rough bars, rhyme ideas, flow thoughts, or punchlines here without polluting your main lyrics..."
                rows={8}
                className="w-full bg-obsidian-950 border border-obsidian-750 focus:border-accent rounded-lg p-3 text-xs font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none resize-y"
              />
            </div>

            {/* Stashed Rhymes */}
            <div>
              <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1.5">
                Stashed Rhymes for this Track
              </label>

              {/* Input to stash new word */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={newRhymeInput}
                  onChange={(e) => setNewRhymeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStashedRhyme()}
                  placeholder="Stash a word (e.g. औकात)..."
                  className="flex-1 bg-obsidian-950 border border-obsidian-750 focus:border-accent rounded-lg px-3 py-2 text-sm sm:text-xs font-devanagari text-white placeholder-obsidian-500 focus:outline-none touch-target"
                />
                <button
                  onClick={handleAddStashedRhyme}
                  className="px-3.5 py-2 bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-accent rounded-lg text-xs font-mono font-semibold transition touch-target flex items-center justify-center"
                >
                  + Stash
                </button>
              </div>

              {/* Stash pills */}
              <div className="flex flex-wrap gap-2">
                {song.stashedRhymes && song.stashedRhymes.length > 0 ? (
                  song.stashedRhymes.map((word) => (
                    <div
                      key={word}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-750 text-xs font-devanagari text-obsidian-100 group"
                    >
                      <button
                        onClick={() => onInsertWord(word)}
                        className="hover:text-accent transition font-medium"
                        title="Insert into song"
                      >
                        {word}
                      </button>
                      <button
                        onClick={() => handleRemoveStashedRhyme(word)}
                        className="text-obsidian-500 hover:text-red-400 p-1 transition touch-manipulation"
                        title="Remove from stash"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] font-mono text-obsidian-500">
                    No stashed rhymes yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-2.5 border-t border-obsidian-700 bg-obsidian-950 text-[10px] font-mono text-obsidian-400 text-center">
          Scratchpad is saved automatically with this song
        </div>
      </div>
    </>
  );
};
