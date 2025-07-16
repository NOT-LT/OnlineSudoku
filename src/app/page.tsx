// pages/index.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const startMatchmaking = () => {
    router.push('/matchmaking');
  };

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Welcome to Online Sudoku</h1>
      <button
        onClick={startMatchmaking}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: 20,
        }}
      >
        Create Game
      </button>
    </div>
  );
}
