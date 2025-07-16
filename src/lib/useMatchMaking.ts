// 'use client';

// import { useEffect, useState } from 'react';
// import { db } from './firebase';
// import {
//   collection,
//   addDoc,
//   query,
//   where,
//   onSnapshot,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   getDocs,
// } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { createGame } from './createGame';

// export function useMatchmaking(currentUser: any) {
//   const router = useRouter();
//   const [isMatching, setIsMatching] = useState(true);

//   useEffect(() => {
//     if (!currentUser) return;

//     const matchRef = collection(db, 'matchmaking');

//     // Add user to matchmaking
//     let myMatchDocRef: any = null;
//     const startMatching = async () => {
//       myMatchDocRef = await addDoc(matchRef, {
//         uid: currentUser.uid,
//         user: doc(db, 'users', currentUser.uid),
//         createdAt: serverTimestamp(),
//       });

//       // Look for another waiting user
//       const q = query(matchRef, where('uid', '!=', currentUser.uid));

//       const unsubscribe = onSnapshot(q, async (snapshot) => {
//         const opponents = snapshot.docs;

//         if (opponents.length > 0) {
//           const opponentDoc = opponents[0];
//           const opponent = opponentDoc.data();

//           // Clean up matchmaking
//           await deleteDoc(opponentDoc.ref);
//           await deleteDoc(myMatchDocRef);

//           // Create game in DB
//           const gameId = await createGame(currentUser.uid, opponent.uid);

//           setIsMatching(false);
//           router.push(`/game/${gameId}`);
//         }
//       });

//       return () => {
//         unsubscribe();
//         if (myMatchDocRef) deleteDoc(myMatchDocRef);
//       };
//     };

//     startMatching();
//   }, [currentUser]);

//   return { isMatching };
// }
