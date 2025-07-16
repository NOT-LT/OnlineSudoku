// 'use client';

// import { useMatchmaking } from '@/lib/useMatchmaking';
// import { useAuth } from '@/lib/useAuth'; // optional, or get currentUser some other way

// export default function MatchmakingPage() {
//   const { currentUser } = useAuth(); // you provide this based on your setup
//   const { isMatching } = useMatchmaking(currentUser);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-3xl mb-4">Looking for an opponent...</h1>
//       {isMatching && (
//         <div className="animate-pulse text-blue-500 text-xl">Matching...</div>
//       )}
//     </div>
//   );
// }
