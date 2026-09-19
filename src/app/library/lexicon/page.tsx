'use client';

import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  Download,
  Info,
  X,
  FolderPlus,
  Tag
} from 'lucide-react';
import { useLexicon } from '../../../hooks/useLexicon';
import { WordDetailModal } from '../../../components/words/WordDetailModal';
import { getWordDetails } from '../../../lib/rhyme-engine';
import { WordEntry, SavedWord } from '../../../types';
import { copyToClipboard, downloadTextFile } from '../../../lib/utils/export';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function MyLexiconPage() {
  const {
    lexicon,
    collections,
    addWord,
    removeWord,
    createCollection,
    toggleCollection
  } = useLexicon();

  const [query, setQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('ALL');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // New Word Form State
  const [newDevanagari, setNewDevanagari] = useState('');
  const [newRoman, setNewRoman] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newTagInput, setNewTagInput] = useState('Custom');
  const [newCollectionInput, setNewCollectionInput] = useState('HOOK WORDS');

  const allCollectionsList = useMemo(() => {
    return ['ALL', ...collections];
  }, [collections]);

  const filteredLexicon = useMemo(() => {
    let list = lexicon;
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(w => (
        w.devanagari.includes(q) ||
        w.roman.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        (w.notes && w.notes.toLowerCase().includes(q)) ||
        (w.personalNote && w.personalNote.toLowerCase().includes(q)) ||
        (w.tags && w.tags.some(t => t.toLowerCase().includes(q))) ||
        (w.collections && w.collections.some(c => c.toLowerCase().includes(q)))
      ));
    }
    if (selectedCollection !== 'ALL') {
      list = list.filter(w => w.collections?.includes(selectedCollection));
    }
    return list;
  }, [lexicon, query, selectedCollection]);

  const handleCopy = (wordStr: string) => {
    copyToClipboard(wordStr);
    setCopiedWord(wordStr);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const handleCreateCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevanagari.trim()) return;

    addWord({
      devanagari: newDevanagari.trim(),
      roman: newRoman.trim() || newDevanagari.trim(),
      meaning: newMeaning.trim(),
      notes: newNotes.trim(),
      personalNote: newNotes.trim(),
      tags: [newTagInput.trim() || 'Custom'],
      collections: [newCollectionInput.trim().toUpperCase() || 'HOOK WORDS'],
    });

    setNewDevanagari('');
    setNewRoman('');
    setNewMeaning('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleCreateCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim());
    setSelectedCollection(newCollectionName.trim().toUpperCase());
    setNewCollectionName('');
    setIsAddCollectionOpen(false);
  };

  const handleExportBackup = () => {
    const json = JSON.stringify(lexicon, null, 2);
    downloadTextFile('bhasha_my_lexicon.json', json);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto px-4 sm:px-10 md:px-16 py-6 sm:py-10 md:py-16 pb-24 md:pb-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-obsidian-700/60">
          <div>
            <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
              VOCABULARY BANK
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
              My Lexicon
            </h1>
            <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
              Your personal vault of words, rhymes, personal notes, and collections.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast"
              title="Download backup JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsAddCollectionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast"
              title="Create new collection"
            >
              <FolderPlus className="w-3.5 h-3.5 text-accent" />
              <span>+ Collection</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-bold text-xs font-mono transition-fast active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Word</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 focus-within:border-accent">
          <Search className="w-4 h-4 text-accent" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your saved vocabulary by word, meaning, notes, or tags..."
            className="w-full bg-transparent text-xs sm:text-sm font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none"
          />
        </div>

        {/* Collections Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-500 block">
            COLLECTIONS
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {allCollectionsList.map((col) => {
              const count = col === 'ALL'
                ? lexicon.length
                : lexicon.filter(w => w.collections?.includes(col)).length;

              return (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-fast whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCollection === col
                      ? 'bg-obsidian-100 text-obsidian-950 font-bold'
                      : 'bg-obsidian-925 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                  }`}
                >
                  <span>{col}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lexicon Cards Grid */}
        {filteredLexicon.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLexicon.map((word) => {
              const isCopied = copiedWord === word.devanagari;

              return (
                <div
                  key={word.id || word.devanagari}
                  className="p-4 rounded-lg bg-obsidian-925 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-xl font-bold font-devanagari text-white group-hover:text-accent transition-fast">
                            {word.devanagari}
                          </h3>
                          <span className="text-xs font-mono text-obsidian-400">
                            /{word.roman}/
                          </span>
                        </div>
                        {word.pronunciation && (
                          <span className="text-[10px] font-mono text-accent">
                            {word.pronunciation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(word.devanagari)}
                          className="p-1 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
                          title="Copy word"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => removeWord(word.devanagari)}
                          className="p-1 text-obsidian-500 hover:text-red-400 rounded hover:bg-obsidian-900 transition-fast"
                          title="Remove from Lexicon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meaning */}
                    {word.meaning && (
                      <p className="text-xs text-obsidian-300 font-sans line-clamp-2">
                        {word.meaning}
                      </p>
                    )}

                    {/* Personal Writer's Notes */}
                    {(word.personalNote || word.notes) && (
                      <div className="p-2 rounded bg-obsidian-950 border border-obsidian-700/40 text-[11px] font-mono text-obsidian-300 border-l-2 border-l-accent">
                        <span className="text-[9px] uppercase tracking-wider text-obsidian-500 block mb-0.5">
                          Personal Note:
                        </span>
                        {word.personalNote || word.notes}
                      </div>
                    )}

                    {/* Collections & Tags */}
                    <div className="flex flex-wrap gap-1">
                      {word.collections?.map((col) => (
                        <span
                          key={col}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30 font-semibold"
                        >
                          {col}
                        </span>
                      ))}
                      {word.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-obsidian-950 text-obsidian-500 border border-obsidian-700/40"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-obsidian-700/40 text-xs font-mono text-obsidian-500">
                    <span>
                      Saved {new Date(word.savedAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => {
                        const details = getWordDetails(word.devanagari);
                        if (details) {
                          setInspectingWord(details);
                        } else {
                          setInspectingWord({
                            id: word.id,
                            devanagari: word.devanagari,
                            roman: word.roman,
                            aliases: [word.roman],
                            normalizedSearchForms: [word.devanagari, word.roman],
                            pronunciation: word.pronunciation || '',
                            meaning: word.meaning,
                            origin: 'Hindustani',
                            moods: word.tags || [],
                            frequency: 50,
                            syllables: 1,
                            coda: '',
                            rhymeKey: '',
                            perfectRhymes: word.perfectRhymes || [],
                            strongRhymes: word.strongRhymes || [],
                            nearRhymes: word.nearRhymes || [],
                            synonyms: [],
                            relatedImagery: word.relatedImagery || [],
                          });
                        }
                      }}
                      className="flex items-center gap-1 text-accent hover:underline font-medium"
                    >
                      <span>Rhymes</span>
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            headline="Your lexicon is empty."
            subline="Save words that deserve another verse."
            actionLabel="Explore Words"
            onAction={() => (window.location.href = '/explore/words')}
          />
        )}
      </div>

      {/* Add Custom Word Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-obsidian-925 border border-obsidian-700/80 rounded-lg shadow-panel p-6 text-obsidian-50 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700/60">
              <h3 className="text-base font-mono font-bold tracking-wide">
                + ADD WORD TO MY LEXICON
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-obsidian-500 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomWord} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Word in Devanagari *
                </label>
                <input
                  type="text"
                  value={newDevanagari}
                  onChange={(e) => setNewDevanagari(e.target.value)}
                  placeholder="e.g. फ़ना, कायनात, सुकून..."
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-sm font-devanagari text-white placeholder-obsidian-600 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Roman Hindi Spelling
                </label>
                <input
                  type="text"
                  value={newRoman}
                  onChange={(e) => setNewRoman(e.target.value)}
                  placeholder="e.g. fanaa, kainaat, sukoon..."
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white placeholder-obsidian-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Meaning / Definition
                </label>
                <textarea
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Brief meaning in English or Hindi..."
                  rows={2}
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-sans text-white placeholder-obsidian-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Personal Note / Punchline Concept
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Metaphor for social media, hook pair for track 3..."
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white placeholder-obsidian-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                    Collection
                  </label>
                  <select
                    value={newCollectionInput}
                    onChange={(e) => setNewCollectionInput(e.target.value)}
                    className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    {collections.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="e.g. Deep, Slang"
                    className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-mono text-obsidian-400 hover:text-white transition-fast"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-mono font-bold text-xs transition-fast"
                >
                  Save to Lexicon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Collection Modal */}
      {isAddCollectionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddCollectionOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-obsidian-925 border border-obsidian-700/80 rounded-lg shadow-panel p-6 text-obsidian-50 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-obsidian-700/60">
              <h3 className="text-base font-mono font-bold tracking-wide">
                + NEW COLLECTION
              </h3>
              <button
                onClick={() => setIsAddCollectionOpen(false)}
                className="p-1 text-obsidian-500 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCollectionSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Collection Name (e.g. BARS, UNDERGROUND, RAAT)
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. CYPHER, METAPHORS..."
                  autoFocus
                  required
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCollectionOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono text-obsidian-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-mono font-bold text-xs"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Word Details Modal */}
      <WordDetailModal
        word={inspectingWord}
        isOpen={!!inspectingWord}
        onClose={() => setInspectingWord(null)}
      />
    </div>
  );
}
