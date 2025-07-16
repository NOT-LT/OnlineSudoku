'use client';

import React, { useState, useEffect } from 'react';
import GameTimer from '@/components/GameTimer';
export default function GamePage() {

  const [timer, setTimer] = useState(0); // in seconds
  const [playerProgress, setPlayerProgress] = useState(35); // %
  const [opponentProgress, setOpponentProgress] = useState(50); // %

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">
      {/* Shared Timer */}
      <GameTimer gameId=''></GameTimer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Player Board */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">You</h2>
            <p className="text-gray-600">{playerProgress}% Complete</p>
          </div>
          <div className="w-full aspect-square bg-white shadow rounded p-2 grid grid-cols-9 gap-[1px]">
            {/* Mock cells */}
            {[...Array(81)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 text-center text-sm h-full flex items-center justify-center"
              >
                {/* Cell content here */}
              </div>
            ))}
          </div>
        </div>

        {/* Opponent Board */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Opponent</h2>
            <p className="text-gray-600">{opponentProgress}% Complete</p>
          </div>
          <div className="w-full aspect-square bg-white shadow rounded p-2 grid grid-cols-9 gap-[1px] blur-sm">
            {/* Mock cells */}
            {[...Array(81)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 text-center text-sm h-full flex items-center justify-center"
              >
                {/* Hidden content */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
