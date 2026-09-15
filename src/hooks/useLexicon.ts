'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedWord } from '../types';
import {
  getStoredLexicon,
  saveWordToLexicon,
  removeWordFromLexicon,
  isWordSavedInLexicon,
} from '../lib/storage/lexicon';

export function useLexicon() {
  const [lexicon, setLexicon] = useState<SavedWord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLexicon(getStoredLexicon());
    setIsLoaded(true);
  }, []);

  const addWord = useCallback((word: Partial<SavedWord> & { devanagari: string }) => {
    const updated = saveWordToLexicon(word);
    setLexicon(updated);
    return updated;
  }, []);

  const removeWord = useCallback((devanagari: string) => {
    const updated = removeWordFromLexicon(devanagari);
    setLexicon(updated);
    return updated;
  }, []);

  const isSaved = useCallback((devanagari: string) => {
    return isWordSavedInLexicon(devanagari);
  }, [lexicon]);

  return {
    lexicon,
    isLoaded,
    addWord,
    removeWord,
    isSaved,
  };
}
