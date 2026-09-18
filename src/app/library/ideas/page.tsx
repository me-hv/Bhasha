'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  Search,
  Trash2,
  Tag,
  Music,
  Bookmark,
  X,
  Edit2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useIdeas } from '../../../hooks/useIdeas';
import { useSongs } from '../../../hooks/useSongs';
import { CreativeIdea, IdeaType, IdeaStatus } from '../../../types';
import { EmptyState } from '../../../components/ui/EmptyState';

const IDEA_TYPES: IdeaType[] = ['CONCEPT', 'IMAGE', 'EMOTION', 'CONTRAST', 'SCENE', 'PHRASE', 'THEME'];
const IDEA_STATUSES: IdeaStatus[] = ['UNUSED', 'IN PROGRESS', 'USED'];

export default function CreativeIdeasPage() {
  const router = useRouter();
  const {
    ideas,
    saveIdea,
    deleteIdea,
    attachToSong,
    detachFromSong,
    attachWord,
    detachWord
  } = useIdeas();
  const { songs } = useSongs();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Partial<CreativeIdea> | null>(null);
  const [newWordInput, setNewWordInput] = useState<{ [ideaId: string]: string }>({});

  const filteredIdeas = useMemo(() => {
    let list = ideas;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(i => (
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(q))) ||
        (i.relatedWords && i.relatedWords.some(w => w.toLowerCase().includes(q)))
      ));
    }

    if (selectedType !== 'ALL') {
      list = list.filter(i => i.type === selectedType);
    }

    if (selectedStatus !== 'ALL') {
      list = list.filter(i => i.status === selectedStatus);
    }

    return list;
  }, [ideas, query, selectedType, selectedStatus]);

  const handleOpenNewModal = () => {
    setEditingIdea({
      title: '',
      type: 'CONCEPT',
      content: '',
      tags: ['seed'],
      status: 'UNUSED',
      attachedSongIds: [],
      relatedWords: [],
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (idea: CreativeIdea) => {
    setEditingIdea({ ...idea });
    setIsEditModalOpen(true);
  };

  const handleSaveIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea || !editingIdea.title?.trim()) return;

    saveIdea({
      id: editingIdea.id,
      title: editingIdea.title.trim(),
      type: editingIdea.type || 'CONCEPT',
      content: editingIdea.content || '',
      tags: editingIdea.tags || ['creative'],
      status: editingIdea.status || 'UNUSED',
      attachedSongIds: editingIdea.attachedSongIds || [],
      relatedWords: editingIdea.relatedWords || [],
    });

    setIsEditModalOpen(false);
    setEditingIdea(null);
  };

  const handleAddWordToIdea = (ideaId: string) => {
    const word = newWordInput[ideaId]?.trim();
    if (!word) return;
    attachWord(ideaId, word);
    setNewWordInput(prev => ({ ...prev, [ideaId]: '' }));
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto p-6 sm:p-12 md:p-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-obsidian-700/60">
          <div>
            <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
              CREATIVE MEMORY
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
              Ideas & Fragments
            </h1>
            <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
              Private vault of concepts, imagery, contrasts, and fragments to build verses around.
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-bold text-xs font-mono transition-fast active:scale-95 shadow-glow-subtle"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ New Idea</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 focus-within:border-accent">
            <Search className="w-4 h-4 text-accent" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ideas, concepts, imagery, or attached vocabulary..."
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mr-1">
              TYPE:
            </span>
            {['ALL', ...IDEA_TYPES].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-fast whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-obsidian-100 text-obsidian-950 font-bold'
                    : 'bg-obsidian-925 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mr-1">
              STATUS:
            </span>
            {['ALL', ...IDEA_STATUSES].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-fast whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-accent text-obsidian-950 font-bold'
                    : 'bg-obsidian-925 text-obsidian-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdeas.map((idea) => {
              const attachedSongs = songs.filter(s => idea.attachedSongIds?.includes(s.id));

              return (
                <div
                  key={idea.id}
                  className="p-5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Title, Type badge, Edit/Delete */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent font-bold border border-accent/30">
                            {idea.type}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-950 text-obsidian-400 border border-obsidian-700/50">
                            {idea.status}
                          </span>
                        </div>
                        <h3 className="text-base font-mono font-bold text-obsidian-50 group-hover:text-accent transition-fast">
                          {idea.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(idea)}
                          className="p-1.5 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
                          title="Edit Idea"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteIdea(idea.id)}
                          className="p-1.5 text-obsidian-500 hover:text-red-400 rounded hover:bg-obsidian-900 transition-fast"
                          title="Delete Idea"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-xs font-mono text-obsidian-300 leading-relaxed bg-obsidian-950 p-3 rounded border border-obsidian-800/80">
                      {idea.content}
                    </p>

                    {/* Attached Songs */}
                    {attachedSongs.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider block">
                          Attached to Songs:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {attachedSongs.map(s => (
                            <button
                              key={s.id}
                              onClick={() => router.push(`/write?id=${s.id}`)}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 text-accent border border-accent/20 flex items-center gap-1 transition-fast"
                            >
                              <Music className="w-3 h-3" />
                              <span>{s.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Vocabulary Chips */}
                    {idea.relatedWords && idea.relatedWords.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider block">
                          Related Vocabulary:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {idea.relatedWords.map(w => (
                            <span
                              key={w}
                              className="text-xs font-devanagari px-2 py-0.5 rounded bg-obsidian-950 text-obsidian-200 border border-obsidian-700/50 flex items-center gap-1"
                            >
                              <span>{w}</span>
                              <button
                                onClick={() => detachWord(idea.id, w)}
                                className="text-obsidian-600 hover:text-red-400"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between text-[11px] font-mono text-obsidian-500">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ add word..."
                        value={newWordInput[idea.id] || ''}
                        onChange={(e) => setNewWordInput(prev => ({ ...prev, [idea.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddWordToIdea(idea.id);
                          }
                        }}
                        className="bg-obsidian-950 border border-obsidian-800 rounded px-2 py-0.5 text-xs font-devanagari text-white placeholder-obsidian-600 w-24 focus:outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => handleAddWordToIdea(idea.id)}
                        className="px-1.5 py-0.5 rounded bg-obsidian-900 text-obsidian-300 hover:text-white text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            headline="No ideas yet."
            subline="Keep fragments worth returning to."
            actionLabel="+ New Idea"
            onAction={handleOpenNewModal}
          />
        )}
      </div>

      {/* Edit / Create Idea Modal */}
      {isEditModalOpen && editingIdea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-obsidian-925 border border-obsidian-700/80 rounded-lg shadow-panel p-6 text-obsidian-50 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700/60">
              <h3 className="text-base font-mono font-bold tracking-wide">
                {editingIdea.id ? 'EDIT IDEA' : '+ NEW CREATIVE IDEA'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-obsidian-500 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIdeaSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Title / Hook Summary *
                </label>
                <input
                  type="text"
                  value={editingIdea.title || ''}
                  onChange={(e) => setEditingIdea(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Noise outside / silence inside..."
                  required
                  autoFocus
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                    Type
                  </label>
                  <select
                    value={editingIdea.type || 'CONCEPT'}
                    onChange={(e) => setEditingIdea(prev => ({ ...prev, type: e.target.value as IdeaType }))}
                    className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    {IDEA_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                    Status
                  </label>
                  <select
                    value={editingIdea.status || 'UNUSED'}
                    onChange={(e) => setEditingIdea(prev => ({ ...prev, status: e.target.value as IdeaStatus }))}
                    className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    {IDEA_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Content / Scene Description / Metaphor
                </label>
                <textarea
                  value={editingIdea.content || ''}
                  onChange={(e) => setEditingIdea(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe the imagery, contrast, emotional tension or punchline direction..."
                  rows={4}
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white placeholder-obsidian-600 focus:outline-none resize-none"
                />
              </div>

              {/* Attach to Song dropdown */}
              <div>
                <label className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider block mb-1">
                  Attach to Song (Optional)
                </label>
                <select
                  value={editingIdea.attachedSongIds?.[0] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingIdea(prev => ({
                      ...prev,
                      attachedSongIds: val ? [val] : [],
                    }));
                  }}
                  className="w-full bg-obsidian-950 border border-obsidian-700/60 focus:border-accent rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="">-- No Attached Song --</option>
                  {songs.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded text-obsidian-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-bold"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
