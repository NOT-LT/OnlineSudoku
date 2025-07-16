// pages/game/[gameId].tsx
'use client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type GameTimerProps = {
  gameId: string;
};

const GameTimer: React.FC<GameTimerProps> = ({ gameId }) => {
  const [elapsed, setElapsed] = useState(0);

  // TODO: Replace with real start time from backend
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameId]);

  return (
    <div style={{ marginBottom: 20 }}>
      <strong>Game ID:</strong> {gameId}
      <br />
      <strong>Elapsed Time:</strong> {new Date(elapsed * 1000).toISOString().substr(11, 8)}
    </div>
  );
};

export default function GamePage() {
  const router = useRouter();
  const { gameId } = router.query;

  if (!gameId || typeof gameId !== 'string') {
    return <p>Loading game...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Sudoku Game</h1>
      <GameTimer gameId={gameId} />
      {/* TODO: Render your player's and opponent's Sudoku boards here */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          maxWidth: 900,
          marginTop: 40,
        }}
      >
        <div>
          <h3>Your Board</h3>
          <div
            style={{
              width: 350,
              height: 350,
              backgroundColor: '#eee',
              border: '1px solid #ccc',
            }}
          >
            {/* Player's Sudoku Board placeholder */}
          </div>
        </div>

        <div>
          <h3>Opponent's Board</h3>
          <div
            style={{
              width: 350,
              height: 350,
              backgroundColor: '#ddd',
              border: '1px solid #ccc',
              filter: 'blur(6px)',
            }}
          >
            {/* Opponent's Sudoku Board placeholder (blurred) */}
          </div>
        </div>
      </div>
    </div>
  );
}
