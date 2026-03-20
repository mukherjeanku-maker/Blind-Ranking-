export interface Player {
  id: number;
  name: string;
  stats: {
    runs: number;
    avg: number;
    sr: number;
    wickets: number;
    economy: number;
  };
  trueRank: number;
  commentary: string;
}

export interface GameState {
  round: number;
  players: Player[];
  userRanking: (Player | null)[];
  availableSlots: boolean[];
  isFinished: boolean;
}
