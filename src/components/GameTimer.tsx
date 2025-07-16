// src/components/GameTimer.tsx
'use client';
import React, { useEffect, useState } from 'react';
import useGameStartTime from '@/hooks/useGameStartTime';

type GameTimerProps = {
  gameId: string;
};

const GameTimer: React.FC<GameTimerProps> = ({ gameId }) => {
  const startTime = useGameStartTime(gameId);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div>
      <p>Elapsed Time: {new Date(elapsed * 1000).toISOString().substr(11, 8)}</p>
    </div>
  );
};

export default GameTimer;
