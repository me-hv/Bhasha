'use client';

import React, { useState } from 'react';
import {
  FileText,
  Bookmark,
  Plus,
  Trash2,
  X,
  Layers,
  Sparkles,
  AlignLeft,
  ArrowRight
} from 'lucide-react';
import { Song } from '../../types';

interface SongNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  onUpdateSong: (updated: Partial<Song>) => void;
  onInsertWordIntoCanvas?: (word: string) => void;
  onOpenRhymesForWord?: (word: string) => void;
}

export const SongNotesDrawer: React.FC<SongNotesDrawerProps> = ({
  isOpen,
  onClose,
  song,
  onUpdateSong,
  onInsertWordIntoCanvas,
  onOpenRhymesForWord,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'sections' | 'vocabulary'>('notes');
  const [newVocabWord, setNewVocabWord] = useState('');

  if (!isOpen) return null;

  // Extract detected sections from song content
  const detectedSections = (song.content || '')
    .split('\n')
    .filter(l => l.trim().startsWith('[') && l.trim().endsWith(']'))
    .map(l => l.trim().slice(1, -1).trim());

  const uniqueSections = Array.from(new Set(detectedSections.length > 0 ? detectedSections : ['Verse 1', 'Hook']));

  const handleNotesChange = (notesText: string) => {
    onUpdateSong({ notes: notesText });
  };

  const handleSectionNoteChange = (sectionTitle: string, noteText: string) => {
    const currentSectionNotes = song.sectionNotes || {};
    onUpdateSong({
      sectionNotes: {
        ...currentSectionNotes,
        [sectionTitle]: noteText,
      },
    });
  };

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVocabWord.trim()) return;
    const current = song.songVocabulary || [];
    if (!current.includes(newVocabWord.trim())) {
      onUpdateSong({ songVocabulary: [...current, newVocabWord.trim()] });
    }
    setNewVocabWord('');
  };

  const handleRemoveVocab = (word: string) => {
    const current = song.songVocabulary || [];
    onUpdateSong({ songVocabulary: current.filter(w => w !== word) });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg sm:max-w-xl h-full bg-obsidian-925 border-l border-obsidian-700/80 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-obsidian-700/60 bg-obsidian-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-accent" />
            <div>
              <h2 className="text-sm sm:text-base font-mono font-bold text-obsidian-50">
                Creative Notes & Memory
              </h2>
              <p className="text-[11px] text-obsidian-400 font-mono">
                {song.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-obsidian-400 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pt-3 pb-2 border-b border-obsidian-800 bg-obsidian-950 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-fast ${
              activeTab === 'notes'
                ? 'bg-obsidian-800 text-white font-semibold border border-obsidian-600'
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
          >
            <AlignLeft className="w-3 h-3" />
            <span>Song Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-fast ${
              activeTab === 'sections'
                ? 'bg-obsidian-800 text-white font-semibold border border-obsidian-600'
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Section Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-fast ${
              activeTab === 'vocabulary'
                ? 'bg-obsidian-800 text-white font-semibold border border-obsidian-600'
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
          >
            <Bookmark className="w-3 h-3 text-accent" />
            <span>Song Vocabulary ({song.songVocabulary?.length || 0})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: General Song Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-obsidian-400 block mb-1">
                  THEME & CREATIVE DIRECTION
                </span>
                <textarea
                  value={song.notes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Store song concept, emotional direction, references, delivery notes, or production ideas..."
                  className="w-full h-64 p-3.5 bg-obsidian-950 border border-obsidian-700/60 rounded-lg text-xs font-mono text-obsidian-100 placeholder-obsidian-600 focus:outline-none focus:border-accent resize-none leading-relaxed"
                />
              </div>

              {/* Scratchpad Reference */}
              <div className="p-3 bg-obsidian-950/60 rounded border border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider block">
                  Quick Scratchpad
                </span>
                <textarea
                  value={song.scratchpadNotes || ''}
                  onChange={(e) => onUpdateSong({ scratchpadNotes: e.target.value })}
                  placeholder="Fast scratchpad fragments..."
                  className="w-full h-24 bg-transparent text-xs font-mono text-obsidian-300 placeholder-obsidian-700 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Section-Level Notes */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-obsidian-400 block">
                DELIVERY & ARRANGEMENT NOTES BY SECTION
              </span>

              {uniqueSections.map((sec) => {
                const currentNote = song.sectionNotes?.[sec] || '';
                return (
                  <div key={sec} className="p-3.5 rounded-lg bg-obsidian-950 border border-obsidian-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-accent">
                        [{sec}]
                      </span>
                      <span className="text-[10px] font-mono text-obsidian-500">
                        Section Note
                      </span>
                    </div>
                    <textarea
                      value={currentNote}
                      onChange={(e) => handleSectionNoteChange(sec, e.target.value)}
                      placeholder={`Notes for ${sec} (e.g. delivery energy, cadence change, beat drop, ad-libs)...`}
                      className="w-full h-20 p-2.5 bg-obsidian-900 border border-obsidian-800 rounded text-xs font-mono text-obsidian-200 placeholder-obsidian-600 focus:outline-none focus:border-accent resize-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Song Vocabulary Bank */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-obsidian-400 block mb-1">
                  SONG VOCABULARY VAULT
                </span>
                <p className="text-[11px] text-obsidian-500 font-sans mb-3">
                  Words intentionally gathered for this track. Click any word to insert into your lyrics or explore rhymes.
                </p>

                <form onSubmit={handleAddVocab} className="flex gap-2">
                  <input
                    type="text"
                    value={newVocabWord}
                    onChange={(e) => setNewVocabWord(e.target.value)}
                    placeholder="Add a word to song vocabulary (e.g. सन्नाटा)..."
                    className="flex-1 bg-obsidian-950 border border-obsidian-700/60 rounded px-3 py-1.5 text-xs font-devanagari text-obsidian-100 placeholder-obsidian-600 focus:outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={!newVocabWord.trim()}
                    className="px-3 py-1.5 rounded bg-accent disabled:opacity-40 text-obsidian-950 font-mono font-bold text-xs"
                  >
                    + Add
                  </button>
                </form>
              </div>

              {/* Chips Grid */}
              {song.songVocabulary && song.songVocabulary.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {song.songVocabulary.map((word) => (
                    <div
                      key={word}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-700/60 hover:border-accent transition-fast group"
                    >
                      <button
                        onClick={() => onInsertWordIntoCanvas && onInsertWordIntoCanvas(word)}
                        className="text-sm font-devanagari font-bold text-white group-hover:text-accent transition-fast"
                        title="Click to insert into canvas"
                      >
                        {word}
                      </button>

                      {onOpenRhymesForWord && (
                        <button
                          onClick={() => onOpenRhymesForWord(word)}
                          className="text-[10px] font-mono text-obsidian-500 hover:text-accent px-1 rounded"
                          title="Explore rhymes for this word"
                        >
                          Rhymes
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveVocab(word)}
                        className="text-obsidian-600 hover:text-red-400 p-0.5 rounded transition-fast"
                        title="Remove from song vocabulary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center space-y-2 border border-dashed border-obsidian-800 rounded-lg">
                  <p className="text-xs font-mono text-obsidian-400">
                    No words saved to this song yet.
                  </p>
                  <p className="text-[11px] font-sans text-obsidian-500">
                    Save words from the Rhyme Rack, Discovery tab, or Add Word box above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-obsidian-700/60 bg-obsidian-950 flex items-center justify-between text-[11px] font-mono text-obsidian-500">
          <span>Notes auto-save with your song</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 text-obsidian-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
