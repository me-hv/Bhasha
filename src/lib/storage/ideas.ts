import { CreativeIdea, IdeaType, IdeaStatus } from '../../types';
import { STORAGE_KEYS, getFromStorage, setToStorage } from './storage';

export const INITIAL_SAMPLE_IDEAS: CreativeIdea[] = [
  {
    id: 'idea-noise-silence',
    title: 'Noise outside / silence inside',
    type: 'CONTRAST',
    content: 'Standing in the middle of a screaming traffic junction in Delhi at 6 PM, but inside the mind there is a chilling, hollow silence.',
    tags: ['loneliness', 'city', 'contrast'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'IN PROGRESS',
    attachedSongIds: ['kaali-raat-demo'],
    relatedWords: ['शहर', 'भीड़', 'सन्नाटा', 'कमरा', 'तन्हाई'],
  },
  {
    id: 'idea-ashes-mirror',
    title: 'Ashes on a broken mirror',
    type: 'IMAGE',
    content: 'A cracked bathroom mirror reflecting cigarette smoke and tired eyes that still refuse to surrender.',
    tags: ['visual', 'raw', 'midnight'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'UNUSED',
    attachedSongIds: [],
    relatedWords: ['आईना', 'धुआँ', 'राख', 'निशान'],
  },
  {
    id: 'idea-empty-pinnacle',
    title: 'Success that feels empty',
    type: 'CONCEPT',
    content: 'Reaching the top floor of the building you dreamed about, looking down and realizing you lost everyone who was with you at the ground floor.',
    tags: ['ambition', 'pain', 'legacy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'UNUSED',
    attachedSongIds: [],
    relatedWords: ['मंज़िल', 'ऊंचाई', 'तन्हाई', 'विरासत'],
  }
];

export function getStoredIdeas(): CreativeIdea[] {
  const ideas = getFromStorage<CreativeIdea[]>(STORAGE_KEYS.IDEAS, []);
  if (!ideas || ideas.length === 0) {
    setToStorage(STORAGE_KEYS.IDEAS, INITIAL_SAMPLE_IDEAS);
    return INITIAL_SAMPLE_IDEAS;
  }
  return ideas;
}

export function saveIdea(idea: Partial<CreativeIdea> & { title: string }): CreativeIdea[] {
  const ideas = getStoredIdeas();
  const existingIndex = ideas.findIndex(i => i.id === idea.id);

  const newIdea: CreativeIdea = {
    id: idea.id || `idea-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: idea.title.trim(),
    type: idea.type || 'CONCEPT',
    content: idea.content || '',
    tags: idea.tags || ['creative'],
    createdAt: idea.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: idea.status || 'UNUSED',
    attachedSongIds: idea.attachedSongIds || [],
    relatedWords: idea.relatedWords || [],
  };

  let updated: CreativeIdea[];
  if (existingIndex >= 0) {
    updated = [...ideas];
    updated[existingIndex] = { ...updated[existingIndex], ...newIdea };
  } else {
    updated = [newIdea, ...ideas];
  }

  setToStorage(STORAGE_KEYS.IDEAS, updated);
  return updated;
}

export function deleteIdea(ideaId: string): CreativeIdea[] {
  const ideas = getStoredIdeas().filter(i => i.id !== ideaId);
  setToStorage(STORAGE_KEYS.IDEAS, ideas);
  return ideas;
}

export function attachIdeaToSong(ideaId: string, songId: string): CreativeIdea[] {
  const ideas = getStoredIdeas();
  const updated = ideas.map(idea => {
    if (idea.id === ideaId) {
      const currentSongs = idea.attachedSongIds || [];
      if (!currentSongs.includes(songId)) {
        return {
          ...idea,
          attachedSongIds: [...currentSongs, songId],
          status: 'IN PROGRESS' as IdeaStatus,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return idea;
  });

  setToStorage(STORAGE_KEYS.IDEAS, updated);
  return updated;
}

export function detachIdeaFromSong(ideaId: string, songId: string): CreativeIdea[] {
  const ideas = getStoredIdeas();
  const updated = ideas.map(idea => {
    if (idea.id === ideaId) {
      const currentSongs = idea.attachedSongIds || [];
      return {
        ...idea,
        attachedSongIds: currentSongs.filter(s => s !== songId),
        updatedAt: new Date().toISOString(),
      };
    }
    return idea;
  });

  setToStorage(STORAGE_KEYS.IDEAS, updated);
  return updated;
}

export function attachWordToIdea(ideaId: string, word: string): CreativeIdea[] {
  const ideas = getStoredIdeas();
  const clean = word.trim();
  if (!clean) return ideas;

  const updated = ideas.map(idea => {
    if (idea.id === ideaId) {
      const currentWords = idea.relatedWords || [];
      if (!currentWords.includes(clean)) {
        return {
          ...idea,
          relatedWords: [...currentWords, clean],
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return idea;
  });

  setToStorage(STORAGE_KEYS.IDEAS, updated);
  return updated;
}

export function detachWordFromIdea(ideaId: string, word: string): CreativeIdea[] {
  const ideas = getStoredIdeas();
  const updated = ideas.map(idea => {
    if (idea.id === ideaId) {
      const currentWords = idea.relatedWords || [];
      return {
        ...idea,
        relatedWords: currentWords.filter(w => w !== word),
        updatedAt: new Date().toISOString(),
      };
    }
    return idea;
  });

  setToStorage(STORAGE_KEYS.IDEAS, updated);
  return updated;
}
