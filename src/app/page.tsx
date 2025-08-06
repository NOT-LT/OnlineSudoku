import SudokuGrid from '@/components/sudokuGrid';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Sudoku - Challenge Your Mind',
  description: 'Play challenging Sudoku puzzles online. Compete with players worldwide in real-time Sudoku matches. Improve your logic and problem-solving skills.',
  keywords: 'sudoku, puzzle, online game, brain training, logic game, multiplayer, online sudoku',
  openGraph: {
    title: 'Online Sudoku - Challenge Your Mind',
    description: 'Play challenging Sudoku puzzles online. Compete with players worldwide.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <HomeClient />

      <h1>Welcome to Online Sudoku</h1>
      <p>Challenge your mind with our interactive Sudoku puzzles. Play solo or compete with players from around the world!</p>

      <SudokuGrid />
    </div>
  );
}