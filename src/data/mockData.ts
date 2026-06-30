import { Employee, Match, Prediction } from '../types';

export const WORLD_CUP_TEAMS = [
  'السعودية', 'المغرب', 'الأرجنتين', 'البرازيل', 'فرنسا', 'إسبانيا', 'ألمانيا',
  'إنجلترا', 'البرتغال', 'إيطاليا', 'أمريكا', 'المكسيك', 'كندا', 'اليابان',
  'كوريا الجنوبية', 'مصر', 'تونس', 'الجزائر', 'هولندا', 'بلجيكا', 'كرواتيا',
  'الأوروغواي', 'السنغال'
];

export const MOCK_TOP_SCORERS = [
  'كيليان مبابي (فرنسا)',
  'ليونيل ميسي (الأرجنتين)',
  'فينيسيوس جونيور (البرازيل)',
  'هاري كين (إنجلترا)',
  'إرلينغ هالاند (النرويج)',
  'جود بيلينجهام (إنجلترا)',
  'سفيان رحيمي (المغرب)',
  'سالم الدوسري (السعودية)'
];

// Calculation engine
export function calculatePointsForPrediction(
  predHome: number,
  predAway: number,
  actualHome: number | undefined,
  actualAway: number | undefined,
  isJoker: boolean
): { points: number; outcome: 'exact' | 'difference' | 'outcome' | 'none' } {
  if (actualHome === undefined || actualAway === undefined) {
    return { points: 0, outcome: 'none' };
  }

  const actualDiff = actualHome - actualAway;
  const predDiff = predHome - predAway;

  const actualWinner = actualDiff > 0 ? 'home' : actualDiff < 0 ? 'away' : 'draw';
  const predWinner = predDiff > 0 ? 'home' : predDiff < 0 ? 'away' : 'draw';

  let basePoints = 0;
  let outcome: 'exact' | 'difference' | 'outcome' | 'none' = 'none';

  if (predHome === actualHome && predAway === actualAway) {
    basePoints = 5; // Exact Score
    outcome = 'exact';
  } else if (actualWinner === predWinner && actualDiff === predDiff) {
    basePoints = 3; // Correct winner + exact goal difference
    outcome = 'difference';
  } else if (actualWinner === predWinner) {
    basePoints = 2; // Correct outcome only (win/draw)
    outcome = 'outcome';
  } else {
    basePoints = 0;
    outcome = 'none';
  }

  const points = isJoker ? basePoints * 2 : basePoints;
  return { points, outcome };
}

// 2026 World Cup matches
export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    homeTeam: 'السعودية',
    awayTeam: 'المكسيك',
    homeFlag: '🇸🇦',
    awayFlag: '🇲🇽',
    group: 'Group A',
    dateTime: '2026-06-11T18:00:00',
    status: 'finished',
    homeScore: 2,
    awayScore: 1,
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 45,
    globalAwayWinPct: 35,
    globalDrawPct: 20,
    lastSyncedFromGlobal: 'Kicktipp (موقع التوقعات العالمي)'
  },
  {
    id: 'm2',
    homeTeam: 'أمريكا',
    awayTeam: 'إنجلترا',
    homeFlag: '🇺🇸',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    group: 'Group B',
    dateTime: '2026-06-12T21:00:00',
    status: 'finished',
    homeScore: 1,
    awayScore: 3,
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 15,
    globalAwayWinPct: 70,
    globalDrawPct: 15,
    lastSyncedFromGlobal: 'Super6 (توقعات بريطانيا)'
  },
  {
    id: 'm3',
    homeTeam: 'المغرب',
    awayTeam: 'البرتغال',
    homeFlag: '🇲🇦',
    awayFlag: '🇵🇹',
    group: 'Group C',
    dateTime: '2026-06-15T15:00:00',
    status: 'finished',
    homeScore: 2,
    awayScore: 2,
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 35,
    globalAwayWinPct: 40,
    globalDrawPct: 25,
    lastSyncedFromGlobal: 'Kicktipp (موقع التوقعات العالمي)'
  },
  {
    id: 'm4',
    homeTeam: 'الأرجنتين',
    awayTeam: 'فرنسا',
    homeFlag: '🇦🇷',
    awayFlag: '🇫🇷',
    group: 'Group D',
    dateTime: '2026-06-18T19:00:00',
    status: 'finished',
    homeScore: 3,
    awayScore: 2,
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 42,
    globalAwayWinPct: 38,
    globalDrawPct: 20,
    lastSyncedFromGlobal: 'ESPN Soccer Prediction'
  },
  {
    id: 'm5',
    homeTeam: 'البرازيل',
    awayTeam: 'ألمانيا',
    homeFlag: '🇧🇷',
    awayFlag: '🇩🇪',
    group: 'Group E',
    dateTime: '2026-06-28T21:00:00',
    status: 'live',
    homeScore: 1,
    awayScore: 0,
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 50,
    globalAwayWinPct: 30,
    globalDrawPct: 20,
    lastSyncedFromGlobal: 'FiveThirtyEight Soccer Index'
  },
  {
    id: 'm6',
    homeTeam: 'إسبانيا',
    awayTeam: 'اليابان',
    homeFlag: '🇪🇸',
    awayFlag: '🇯🇵',
    group: 'Group F',
    dateTime: '2026-06-30T16:00:00',
    status: 'scheduled',
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 65,
    globalAwayWinPct: 15,
    globalDrawPct: 20,
    lastSyncedFromGlobal: 'Kicktipp (موقع التوقعات العالمي)'
  },
  {
    id: 'm7',
    homeTeam: 'مصر',
    awayTeam: 'بلجيكا',
    homeFlag: '🇪🇬',
    awayFlag: '🇧🇪',
    group: 'Group G',
    dateTime: '2026-07-02T18:00:00',
    status: 'scheduled',
    isKnockout: false,
    round: 'Group Stage',
    globalHomeWinPct: 28,
    globalAwayWinPct: 48,
    globalDrawPct: 24,
    lastSyncedFromGlobal: 'Kicktipp (موقع التوقعات العالمي)'
  },
  {
    id: 'm8',
    homeTeam: 'المغرب',
    awayTeam: 'الأرجنتين',
    homeFlag: '🇲🇦',
    awayFlag: '🇦🇷',
    group: 'Knockout',
    dateTime: '2026-07-08T20:00:00',
    status: 'scheduled',
    isKnockout: true,
    round: 'Round of 16',
    globalHomeWinPct: 30,
    globalAwayWinPct: 50,
    globalDrawPct: 20,
    lastSyncedFromGlobal: 'FIFA World Cup API Portal'
  },
  {
    id: 'm9',
    homeTeam: 'السعودية',
    awayTeam: 'البرازيل',
    homeFlag: '🇸🇦',
    awayFlag: '🇧🇷',
    group: 'Knockout',
    dateTime: '2026-07-09T20:00:00',
    status: 'scheduled',
    isKnockout: true,
    round: 'Round of 16',
    globalHomeWinPct: 20,
    globalAwayWinPct: 65,
    globalDrawPct: 15,
    lastSyncedFromGlobal: 'FIFA World Cup API Portal'
  }
];

// Special spotlight employees who are active participants
export const SPOTLIGHT_EMPLOYEES: Employee[] = [
  {
    id: 'emp_3laa',
    name: 'علاء الهنيدي',
    email: '3laa.hinidi1@gmail.com',
    avatar: '👨‍💻',
    points: 18,
    exactScores: 2,
    goalDifferences: 2,
    correctOutcomes: 1,
    championPrediction: 'المغرب',
    runnerUpPrediction: 'الأرجنتين',
    topScorerPrediction: 'سفيان رحيمي (المغرب)'
  },
  {
    id: 'emp_mona',
    name: 'منى الأحمد',
    email: 'mona.ahmad@company.com',
    avatar: '👩‍💼',
    points: 23,
    exactScores: 3,
    goalDifferences: 2,
    correctOutcomes: 1,
    championPrediction: 'الأرجنتين',
    runnerUpPrediction: 'فرنسا',
    topScorerPrediction: 'ليونيل ميسي (الأرجنتين)'
  },
  {
    id: 'emp_ahmad',
    name: 'أحمد القحطاني',
    email: 'ahmad.q@company.com',
    avatar: '👨‍💻',
    points: 21,
    exactScores: 2,
    goalDifferences: 3,
    correctOutcomes: 1,
    championPrediction: 'البرازيل',
    runnerUpPrediction: 'إسبانيا',
    topScorerPrediction: 'فينيسيوس جونيور (البرازيل)'
  },
  {
    id: 'emp_sarah',
    name: 'سارة المصري',
    email: 'sarah.m@company.com',
    avatar: '👩‍⚕️',
    points: 12,
    exactScores: 1,
    goalDifferences: 1,
    correctOutcomes: 2,
    championPrediction: 'السعودية',
    runnerUpPrediction: 'المغرب',
    topScorerPrediction: 'سالم الدوسري (السعودية)'
  },
  {
    id: 'emp_khaled',
    name: 'خالد العتيبي',
    email: 'khaled.o@company.com',
    avatar: '👨‍💼',
    points: 15,
    exactScores: 1,
    goalDifferences: 2,
    correctOutcomes: 2,
    championPrediction: 'ألمانيا',
    runnerUpPrediction: 'إنجلترا',
    topScorerPrediction: 'هاري كين (إنجلترا)'
  },
  {
    id: 'emp_raed',
    name: 'رائد الشمراني',
    email: 'raed.sh@company.com',
    avatar: '🧔',
    points: 19,
    exactScores: 2,
    goalDifferences: 1,
    correctOutcomes: 4,
    championPrediction: 'إسبانيا',
    runnerUpPrediction: 'البرازيل',
    topScorerPrediction: 'جود بيلينجهام (إنجلترا)'
  },
  {
    id: 'emp_yasmin',
    name: 'ياسمين الغامدي',
    email: 'yasmin.g@company.com',
    avatar: '👩‍💻',
    points: 14,
    exactScores: 1,
    goalDifferences: 2,
    correctOutcomes: 1,
    championPrediction: 'فرنسا',
    runnerUpPrediction: 'إنجلترا',
    topScorerPrediction: 'كيليان مبابي (فرنسا)'
  },
  {
    id: 'emp_fahad',
    name: 'فهد الدوسري',
    email: 'fahad.d@company.com',
    avatar: '👱‍♂️',
    points: 10,
    exactScores: 0,
    goalDifferences: 2,
    correctOutcomes: 2,
    championPrediction: 'البرتغال',
    runnerUpPrediction: 'ألمانيا',
    topScorerPrediction: 'ليونيل ميسي (الأرجنتين)'
  },
  {
    id: 'emp_noura',
    name: 'نورة الحربي',
    email: 'noura.h@company.com',
    avatar: '👩‍💼',
    points: 25,
    exactScores: 3,
    goalDifferences: 2,
    correctOutcomes: 2,
    championPrediction: 'المغرب',
    runnerUpPrediction: 'البرازيل',
    topScorerPrediction: 'سفيان رحيمي (المغرب)'
  },
  {
    id: 'emp_tareq',
    name: 'طارق المالكي',
    email: 'tareq.m@company.com',
    avatar: '👨‍💼',
    points: 8,
    exactScores: 0,
    goalDifferences: 1,
    correctOutcomes: 2,
    championPrediction: 'إيطاليا',
    runnerUpPrediction: 'الأرجنتين',
    topScorerPrediction: 'ليونيل ميسي (الأرجنتين)'
  },
  {
    id: 'emp_alanoud',
    name: 'العنود السبيعي',
    email: 'alanoud.s@company.com',
    avatar: '👱‍♀️',
    points: 17,
    exactScores: 2,
    goalDifferences: 1,
    correctOutcomes: 2,
    championPrediction: 'الأرجنتين',
    runnerUpPrediction: 'المغرب',
    topScorerPrediction: 'كيليان مبابي (فرنسا)'
  }
];

// Return only the active participating employees
export function generateEmployees(): Employee[] {
  const employees: Employee[] = [...SPOTLIGHT_EMPLOYEES];

  // Sort and assign ranks
  employees.sort((a, b) => b.points - a.points);
  employees.forEach((emp, index) => {
    emp.rank = index + 1;
    emp.previousRank = index + 1 + (index % 3 === 0 ? 1 : index % 3 === 1 ? -1 : 0);
  });

  return employees;
}

// Generate realistic mock predictions for the active employees
export function generateMockPredictions(employees: Employee[], matches: Match[]): Prediction[] {
  const predictions: Prediction[] = [];

  employees.forEach(emp => {
    matches.forEach((m, idx) => {
      // Create some variation in scores
      const seed = emp.name.charCodeAt(0) + m.id.charCodeAt(1);
      let homeScore = (seed + idx) % 3;
      let awayScore = (seed * (idx + 1)) % 3;
      let isJoker = idx === 1; // Mark match index 1 as joker for simulation

      if (m.id === 'm1') { homeScore = 2; awayScore = 1; }
      if (m.id === 'm2') { homeScore = 1; awayScore = 3; }
      if (m.id === 'm3') { homeScore = 2; awayScore = 2; }

      const result = calculatePointsForPrediction(homeScore, awayScore, m.homeScore, m.awayScore, isJoker);

      predictions.push({
        matchId: m.id,
        employeeId: emp.id,
        homeScore,
        awayScore,
        isJoker,
        pointsEarned: m.status === 'finished' ? result.points : 0
      });
    });
  });

  return predictions;
}

// Recalculates all scores and ranks after a match is updated
export function recalculateAllScores(employees: Employee[], matches: Match[], predictions: Prediction[]): { employees: Employee[], predictions: Prediction[] } {
  const updatedEmployees = employees.map(emp => {
    let pts = 0;
    let exact = 0;
    let diff = 0;
    let out = 0;

    // Find all predictions for this employee
    const empPreds = predictions.filter(p => p.employeeId === emp.id);

    empPreds.forEach(pred => {
      const match = matches.find(m => m.id === pred.matchId);
      if (match && match.status === 'finished') {
        const result = calculatePointsForPrediction(pred.homeScore, pred.awayScore, match.homeScore, match.awayScore, pred.isJoker);
        pred.pointsEarned = result.points;
        pts += result.points;

        if (result.outcome === 'exact') exact++;
        else if (result.outcome === 'difference') diff++;
        else if (result.outcome === 'outcome') out++;
      }
    });

    return {
      ...emp,
      points: pts,
      exactScores: exact,
      goalDifferences: diff,
      correctOutcomes: out
    };
  });

  // Recalculate ranks
  updatedEmployees.sort((a, b) => b.points - a.points);
  updatedEmployees.forEach((emp, idx) => {
    emp.previousRank = emp.rank || (idx + 1);
    emp.rank = idx + 1;
  });

  return { employees: updatedEmployees, predictions };
}
