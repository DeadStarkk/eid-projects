export type GameStatus = 'waiting' | 'day_trivia' | 'night_trivia' | 'fitr_trivia' | 'transition_to_night' | 'majlis' | 'game_over';

export interface Question {
  q: string;
  options: string[];
  a: string;
}

export interface Envelope {
  id: string;
  amount: number;
}

export interface RelativeData {
  id: number;
  name: string;
  title: string;
  image: string;
  personality: string;
  hint: string;
  availableEnvelopes: Envelope[];
}

export interface PlayerStats {
  fastestCorrectCount: number;
  totalResponseTime: number;
  pointsAtMidpoint: number;
  riskScore: number;
}

export interface Player {
  id: string;
  socketId: string | null;
  name: string;
  points: number;
  wallet: number;
  faz3aLevel: string;
  faz3aUsesLeft: number;
  color: string;
  avatar: string;
  disconnected: boolean;
  stats: PlayerStats;
}

export interface GameState {
  status: GameStatus;
  currentDay: number;
  currentQuestion: Question | null;
  usedQuestionIds: number[];
  activePlayerIndex: number;
  currentRelativeIndex: number;
  selectedRelativeIndex: number | null;
  endTime: number | null;
  timeLeft: number | null;
  isLocked: boolean;
  answeredPlayers: string[];
  playerChoices: Record<string, string>;
  laylatulQadrDay: number;
  relativesData?: RelativeData[];
}

export interface Relative {
  name: string;
  title: string;
  image: string;
  personality: string;
  envelopes: number[];
  hint: string;
  lottiePath: string;
}
