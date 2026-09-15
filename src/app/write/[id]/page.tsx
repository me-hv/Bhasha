'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSongs } from '../../../hooks/useSongs';
import { SongEditor } from '../../../components/editor/SongEditor';
import { Loader2 } from 'lucide-react';

export default function SongDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { songs, activeSong, selectSong, updateSong, isLoaded } = useSongs();

  useEffect(() => {
    if (id && songs.some(s => s.id === id)) {
      selectSong(id);
    }
  }, [id, songs, selectSong]);

  const currentSong = (id ? songs.find(s => s.id === id) : null) || activeSong;

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
