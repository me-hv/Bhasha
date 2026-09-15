'use client';

import React, { useMemo } from 'react';
import { WordEntry } from '../../types';
import { useLexicon } from '../../hooks/useLexicon';
import { getRhymes } from '../../lib/language-engine/rhyme-engine';
import {
  X,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Flame,
  Layers,
  FileText,
  Compass,
  Heart,
  Eye,
  Music,
  MapPin
} from 'lucide-react';
import { copyToClipboard } from '../../lib/utils/export';

interface WordDetailModalProps {
  word: WordEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRhyme?: (rhyme: string) => void;
  onNavigateWord?: (wordDevanagari: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  isOpen,
  onClose,
  onSelectRhyme,
  onNavigateWord,
}) => {
  const { isSaved, addWord, removeWord } = useLexicon();
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const dynamicRhymes = useMemo(() => {
    if (!word) return null;
    return getRhymes(word.devanagari);
  }, [word?.devanagari]);

  if (!isOpen || !word) return null;

  const saved = isSaved(word.devanagari);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const toggleSave = () => {
    if (saved) {
      removeWord(word.devanagari);
    } else {
      addWord({
        id: word.id,
        devanagari: word.devanagari,
        roman: word.roman,
        meaning: word.meaning,
        pronunciation: word.pronunciation,
        tags: word.moods,
        perfectRhymes: word.perfectRhymes,
        strongRhymes: word.strongRhymes,
        nearRhymes: word.nearRhymes,
        relatedImagery: word.relatedImagery,
        relatedGraph: word.relatedGraph,
      });
    }
  };

  // Combine static and dynamic rhymes
  const perfectList = dynamicRhymes?.perfect && dynamicRhymes.perfect.length > 0 
    ? dynamicRhymes.perfect 
    : (word.perfectRhymes || []).map(w => ({ word: w, score: 1.00, syllables: word.syllables }));

  const strongList = dynamicRhymes?.strong && dynamicRhymes.strong.length > 0
    ? dynamicRhymes.strong
    : (word.strongRhymes || []).map(w => ({ word: w, score: 0.90, syllables: word.syllables }));

  const nearList = dynamicRhymes?.near && dynamicRhymes.near.length > 0
    ? dynamicRhymes.near
    : (word.nearRhymes || []).map(w => ({ word: w, score: 0.65, syllables: word.syllables }));

  const multiSyllables = dynamicRhymes?.multiSyllable && dynamicRhymes.multiSyllable.length > 0
    ? dynamicRhymes.multiSyllable
    : word.multiSyllableRhymes || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-obsidian-900 border border-obsidian-700 rounded-lg shadow-2xl p-6 text-obsidian-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between pb-4 border-b border-obsidian-700">
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl font-bold font-devanagari text-white tracking-wide">
                {word.devanagari}
              </h2>
              {word.urdu && (
                <span className="text-xl font-serif text-amber-200/80 px-1.5 py-0.5 rounded bg-obsidian-950 border border-obsidian-800" title="Urdu Script">
                  {word.urdu}
                </span>
              )}
              <span className="text-lg font-mono text-obsidian-400">
                {word.roman}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-800 text-accent border border-obsidian-700">
                {word.pronunciation}
              </span>
            </div>
            <p className="text-sm text-obsidian-300 mt-1.5 font-sans">
              {word.meaning}
            </p>
            {word.hindiMeaning && (
              <p className="text-xs text-obsidian-400 font-devanagari mt-0.5">
                {word.hindiMeaning}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                saved
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-obsidian-800 border-obsidian-700 text-obsidian-300 hover:text-white hover:border-obsidian-600'
              }`}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Saved in Lexicon</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>+ Save to Lexicon</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-obsidian-400 hover:text-white rounded hover:bg-obsidian-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 my-4">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
            {word.syllables} {word.syllables === 1 ? 'Syllable' : 'Syllables'}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
            Origin: {word.origin}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
            Coda: -{word.coda}
          </span>
          {word.moods.map((mood) => (
            <span
              key={mood}
              className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-950 text-accent-glow border border-accent/20"
            >
              #{mood}
            </span>
          ))}
        </div>

        {/* Scored Rhymes Section */}
        <div className="space-y-5 my-6">
          {/* Perfect Rhymes */}
          {perfectList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-rhyme-perfect tracking-wider uppercase">
                    ● Perfect Rhymes
                  </span>
                  <span className="text-xs text-obsidian-400 font-mono">
                    ({perfectList.length})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">
                  Score: 1.00
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {perfectList.map((r) => (
                  <button
                    key={r.word}
                    onClick={() => {
                      if (onSelectRhyme) onSelectRhyme(r.word);
                      handleCopy(r.word);
                    }}
                    className="group flex items-center gap-2 px-2.5 py-1 rounded bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-rhyme-perfect text-sm font-devanagari text-obsidian-100 hover:text-white transition"
                  >
                    <span>{r.word}</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-obsidian-900 text-rhyme-perfect">
                      1.00
                    </span>
                    {copiedText === r.word ? (
                      <Check className="w-3 h-3 text-rhyme-perfect" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Strong Rhymes */}
          {strongList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-rhyme-strong tracking-wider uppercase">
                    ● Strong Assonances
                  </span>
                  <span className="text-xs text-obsidian-400 font-mono">
                    ({strongList.length})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">
                  Score: 0.88–0.94
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {strongList.map((r) => (
                  <button
                    key={r.word}
                    onClick={() => {
                      if (onSelectRhyme) onSelectRhyme(r.word);
                      handleCopy(r.word);
                    }}
                    className="group flex items-center gap-2 px-2.5 py-1 rounded bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-rhyme-strong text-sm font-devanagari text-obsidian-100 hover:text-white transition"
                  >
                    <span>{r.word}</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-obsidian-900 text-rhyme-strong">
                      {r.score.toFixed(2)}
                    </span>
                    {copiedText === r.word ? (
                      <Check className="w-3 h-3 text-rhyme-strong" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Near Rhymes */}
          {nearList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-rhyme-near tracking-wider uppercase">
                    ● Near / Slant Rhymes
                  </span>
                  <span className="text-xs text-obsidian-400 font-mono">
                    ({nearList.length})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">
                  Score: 0.50–0.72
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {nearList.map((r) => (
                  <button
                    key={r.word}
                    onClick={() => {
                      if (onSelectRhyme) onSelectRhyme(r.word);
                      handleCopy(r.word);
                    }}
                    className="group flex items-center gap-2 px-2.5 py-1 rounded bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-rhyme-near text-sm font-devanagari text-obsidian-100 hover:text-white transition"
                  >
                    <span>{r.word}</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-obsidian-900 text-rhyme-near">
                      {r.score.toFixed(2)}
                    </span>
                    {copiedText === r.word ? (
                      <Check className="w-3 h-3 text-rhyme-near" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Syllable Cadence */}
          {multiSyllables.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-rhyme-cadence tracking-wider uppercase">
                  ● Multi-Syllable Flow Cadence
                </span>
                <span className="text-[10px] font-mono text-obsidian-500">
                  Cadence Pairs
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {multiSyllables.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onSelectRhyme) onSelectRhyme(p.phraseOrWord);
                      handleCopy(p.phraseOrWord);
                    }}
                    className="group flex items-center justify-between px-3 py-1.5 rounded bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-rhyme-cadence text-sm font-devanagari text-obsidian-100 hover:text-white transition"
                  >
                    <span>{p.phraseOrWord}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-obsidian-400">
                        {p.syllables} syls
                      </span>
                      {copiedText === p.phraseOrWord ? (
                        <Check className="w-3 h-3 text-rhyme-cadence" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Structured Related Word Graph (Visual, Emotion, Sound, Place) */}
        {word.relatedGraph ? (
          <div className="space-y-3 my-6 p-4 rounded bg-obsidian-950 border border-obsidian-700/60">
            <h4 className="text-xs font-mono font-semibold text-obsidian-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-accent" />
              Related Word Graph
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Visual */}
              {word.relatedGraph.visual && word.relatedGraph.visual.length > 0 && (
                <div className="p-2.5 rounded bg-obsidian-900 border border-obsidian-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-accent uppercase mb-1.5">
                    <Eye className="w-3 h-3" />
                    Visual & Imagery
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {word.relatedGraph.visual.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          if (onNavigateWord) onNavigateWord(item);
                          handleCopy(item);
                        }}
                        className="px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-750 hover:border-accent text-xs font-devanagari text-obsidian-200 hover:text-white transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emotion */}
              {word.relatedGraph.emotion && word.relatedGraph.emotion.length > 0 && (
                <div className="p-2.5 rounded bg-obsidian-900 border border-obsidian-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-pink-400 uppercase mb-1.5">
                    <Heart className="w-3 h-3" />
                    Emotion & Mood
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {word.relatedGraph.emotion.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          if (onNavigateWord) onNavigateWord(item);
                          handleCopy(item);
                        }}
                        className="px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-750 hover:border-pink-400 text-xs font-devanagari text-obsidian-200 hover:text-white transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sound */}
              {word.relatedGraph.sound && word.relatedGraph.sound.length > 0 && (
                <div className="p-2.5 rounded bg-obsidian-900 border border-obsidian-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-cyan-400 uppercase mb-1.5">
                    <Music className="w-3 h-3" />
                    Sound & Rhythm
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {word.relatedGraph.sound.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          if (onNavigateWord) onNavigateWord(item);
                          handleCopy(item);
                        }}
                        className="px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-750 hover:border-cyan-400 text-xs font-devanagari text-obsidian-200 hover:text-white transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Place */}
              {word.relatedGraph.place && word.relatedGraph.place.length > 0 && (
                <div className="p-2.5 rounded bg-obsidian-900 border border-obsidian-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-400 uppercase mb-1.5">
                    <MapPin className="w-3 h-3" />
                    Place & Setting
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {word.relatedGraph.place.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          if (onNavigateWord) onNavigateWord(item);
                          handleCopy(item);
                        }}
                        className="px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-750 hover:border-emerald-400 text-xs font-devanagari text-obsidian-200 hover:text-white transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Fallback Related Imagery & Synonyms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 rounded bg-obsidian-950 border border-obsidian-700/60">
            <div>
              <h4 className="text-xs font-mono font-semibold text-obsidian-400 uppercase tracking-wider mb-2">
                Related Imagery & World
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {word.relatedImagery.map((img) => (
                  <span
                    key={img}
                    className="text-xs font-devanagari px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-750 text-obsidian-300"
                  >
                    {img}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-semibold text-obsidian-400 uppercase tracking-wider mb-2">
                Poetic Synonyms
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="text-xs font-devanagari px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-750 text-obsidian-300"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sample Rap Bars */}
        {word.sampleBars && word.sampleBars.length > 0 && (
          <div className="my-6">
            <h4 className="text-xs font-mono font-semibold text-obsidian-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-accent" />
              Lyrical Rap Examples
            </h4>
            <div className="space-y-2">
              {word.sampleBars.map((bar, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-obsidian-950 border-l-2 border-accent border-y border-r border-obsidian-800 text-sm font-devanagari text-obsidian-100"
                >
                  {bar}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-obsidian-700 text-xs font-mono text-obsidian-400">
          <span>Click any rhyme to copy or insert into song</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-200 rounded border border-obsidian-700 transition"
          >
            Esc to close
          </button>
        </div>
      </div>
    </div>
  );
};

