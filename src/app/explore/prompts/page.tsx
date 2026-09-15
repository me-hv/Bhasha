'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { SONG_PROMPTS } from '../../../data/prompts';
import { useSongs } from '../../../hooks/useSongs';
import { SongPrompt, WordEntry } from '../../../types';
import { WordDetailModal } from '../../../components/words/WordDetailModal';
import { getWordDetails } from '../../../lib/rhyme-engine';

const CATEGORIES = [
  'ALL',
  'AMBITION',
  'SUCCESS',
  'PAIN',
  'CITY',
  'LONELINESS',
  'LOVE',
  'FAMILY',
  'MONEY',
  'FAILURE',
];

export default function PromptsPage() {
  const router = useRouter();
  const { createSong } = useSongs();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);

  const filteredPrompts = React.useMemo(() => {
    if (selectedCategory === 'ALL') return SONG_PROMPTS;
    return SONG_PROMPTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleStartSong = (prompt: SongPrompt) => {
    const bpmMatch = prompt.suggestedBpm.match(/\d+/);
    const parsedBpm = bpmMatch ? parseInt(bpmMatch[0], 10) : 92;

    const newSong = createSong(
      prompt.title.toUpperCase(),
      parsedBpm,
      'Am'
    );

    newSong.content = `[Verse 1]\n${prompt.sampleOpeningBar || ''}\n`;
    newSong.scratchpadNotes = `PROMPT THEME: ${prompt.category} - ${prompt.title}
PREMISE: ${prompt.premise}
ANGLE: ${prompt.angle}
SUGGESTED BPM: ${prompt.suggestedBpm} (${prompt.mood})
KEYWORDS: ${prompt.keywords.map(k => `${k.devanagari} (${k.roman})`).join(', ')}`;
    newSong.stashedRhymes = prompt.rhymeAnchors.flatMap(a => [a.word, ...a.rhymes]);
    newSong.tags = [prompt.category, 'Prompt Driven'];

    router.push(`/write?id=${newSong.id}`);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto p-6 sm:p-12 md:p-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-obsidian-700/60">
          <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
            CREATIVE AMMUNITION
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
            Songwriting Ideas & Prompts
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
            Premises, angles, and anchor keywords engineered to trigger original verses.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-obsidian-100 text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-obsidian-950 text-rhyme-near border border-rhyme-near/30 uppercase">
                      {prompt.category}
                    </span>
                    <h3 className="text-base font-bold font-mono text-obsidian-50 mt-1">
                      {prompt.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-obsidian-500 text-right">
                    {prompt.suggestedBpm}
                  </span>
                </div>

                {/* Premise */}
                <p className="text-xs text-obsidian-200 font-sans leading-relaxed">
                  {prompt.premise}
                </p>

                {/* Angle */}
                <p className="text-xs text-obsidian-400 font-sans leading-relaxed">
                  {prompt.angle}
                </p>

                {/* Thematic Keywords */}
                <div>
                  <span className="text-[9px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block mb-1">
                    KEYWORDS
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {prompt.keywords.map((kw) => (
                      <button
                        key={kw.roman}
                        onClick={() => {
                          const w = getWordDetails(kw.devanagari);
                          if (w) setInspectingWord(w);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/40 text-xs font-devanagari text-obsidian-300 hover:text-white transition-fast"
                        title="Inspect word details"
                      >
                        <span>{kw.devanagari}</span>
                        <span className="text-[10px] font-mono text-obsidian-500">
                          /{kw.roman}/
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rhyme Anchors */}
                <div>
                  <span className="text-[9px] font-mono font-semibold text-rhyme-perfect uppercase tracking-wider block mb-1">
                    RHYME ANCHORS
                  </span>
                  <div className="space-y-1">
                    {prompt.rhymeAnchors.map((anchor, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-devanagari">
                        <span className="font-bold text-obsidian-100 bg-obsidian-950 px-1.5 py-0.2 rounded border border-obsidian-700/40">
                          {anchor.word}
                        </span>
                        <span className="text-obsidian-600 text-[10px] font-mono">→</span>
                        <span className="text-obsidian-400">
                          {anchor.rhymes.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Song Action */}
              <div className="pt-4 mt-4 border-t border-obsidian-700/40">
                <button
                  onClick={() => handleStartSong(prompt)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-obsidian-900 hover:bg-accent hover:text-obsidian-950 text-xs font-mono text-obsidian-200 font-medium transition-fast group"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Start Song With This Idea</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WordDetailModal
        word={inspectingWord}
        isOpen={!!inspectingWord}
        onClose={() => setInspectingWord(null)}
      />
    </div>
  );
}
