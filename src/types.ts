export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  exactScores: number; // 5 pts
  goalDifferences: number; // 3 pts
  correctOutcomes: number; // 2 pts
  championPrediction: string;
  runnerUpPrediction: string;
  topScorerPrediction: string;
  rank?: number;
  previousRank?: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string; // Emoji flag
  awayFlag: string; // Emoji flag
  group: string;
  dateTime: string;
  status: 'scheduled' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  isKnockout: boolean;
  round: string; // "Group Stage" | "Round of 16" | "Quarter-finals" | "Semi-finals" | "Final"
  globalHomeWinPct?: number;
  globalAwayWinPct?: number;
  globalDrawPct?: number;
  lastSyncedFromGlobal?: string; // e.g. "Kicktipp"
}

export interface Prediction {
  matchId: string;
  employeeId: string;
  homeScore: number;
  awayScore: number;
  isJoker: boolean; // Double points
  pointsEarned?: number;
}

export interface AppState {
  employees: Employee[];
  matches: Match[];
  predictions: Prediction[];
}
