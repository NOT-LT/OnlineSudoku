type User = {
  uid: string;             // Firebase Auth User ID (unique)
  username: string;        // Display name or chosen username
  email: string;           // User email (optional if using anonymous auth)
  createdAt: Timestamp;    // Account creation timestamp
  stats?: {                // Game statistics (optional)
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    // add more as needed, e.g. winRate, rating, etc.
  };
  completeProfile?: boolean; // Whether the user has completed their profile
  preferences?: {          // User settings/preferences (optional)
    theme: 'light' | 'dark';
    notificationsEnabled: boolean;
  };
  currentGameId?: string;  // If user is in a current active game
  [key: string]: any;
};


type Game = {
  gameId: string;          // Unique identifier for the game
  createdAt: Timestamp;  // When the game was created
  startedAt: Timestamp | null; // When the game started, null if not started
  mode: string;          // Game mode (e.g. "standard", "custom")
  puzzle: string;
  solution: string;
  players: {
    player1: User
    player2: User
    player1Progress: number; // Progress percentage for player 1
    player2Progress: number; // Progress percentage for player 2
  };
  status: 'waiting' | 'active' | 'completed'; // Game status
  winner?: User;          // Optional, if game is completed
}

interface MatchmakingDoc {
  user: DocumentReference;
  createdAt: Timestamp;
}