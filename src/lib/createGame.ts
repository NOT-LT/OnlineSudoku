import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function createGame(uid1: string, uid2: string): Promise<string> {
  const gameId = `g${Date.now()}`;
  await setDoc(doc(db, 'games', gameId), {
    players: [uid1, uid2],
    createdAt: serverTimestamp(),
    startTime: serverTimestamp(),
    state: 'ongoing',
    playerBoards: {
      [uid1]: [], // to be filled later
      [uid2]: [],
    },
  });
  return gameId;
}
