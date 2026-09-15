'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSongs } from '../../hooks/useSongs';
import { SongEditor } from '../../components/editor/SongEditor';
import { Loader2 } from 'lucide-react';

function WriteContent() {
  const searchParams = useSearchParams();
  const idFromQuery = searchParams.get('id');
  const { songs, activeSong, selectSong, updateSong, isLoaded } = useSongs();

  useEffect(() => {
    if (idFromQuery && songs.some(s => s.id === idFromQuery)) {
      selectSong(idFromQuery);
    }
  }, [idFromQuery, songs, selectSong]);

  const currentSong = (idFromQuery ? songs.find(s => s.id === idFromQuery) : null) || activeSong;

  if (!isLoaded || !currentSong) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-obsidian-950 text-obsidian-400">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <SongEditor
      song={currentSong}
      onUpdateSong={(updated) => updateSong({ ...currentSong, ...updated })}
    />
  );
}

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center bg-obsidian-950 text-obsidian-400">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      }
    >
      <WriteContent />
    </Suspense>
  );
}
