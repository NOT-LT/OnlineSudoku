// src/hooks/useGameStartTime.ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function useGameStartTime(gameId: string) {
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!gameId) return;

    const docRef = doc(db, 'games', gameId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Game;
        if (data.startedAt) {
          setStartTime(data.startedAt.toMillis());
        } else {
          setStartTime(null);
        }
      } else {
        setStartTime(null);
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  return startTime;
}
