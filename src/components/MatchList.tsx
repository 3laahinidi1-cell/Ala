import React, { useState, useEffect } from 'react';
import { Match, Prediction } from '../types';
import { Zap, HelpCircle, Save, CheckCircle2, Lock, Flame } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  predictions: Prediction[];
  activeEmployeeId: string;
  onSavePrediction: (matchId: string, homeScore: number, awayScore: number, isJoker: boolean) => void;
}

export default function MatchList({ matches, predictions, activeEmployeeId, onSavePrediction }: MatchListProps) {
  const [localScores, setLocalScores] = useState<{ [key: string]: { home: string, away: string } }>({});
  const [jokerMatchId, setJokerMatchId] = useState<string | null>(null);

  // Initialize local scores and joker from predictions
  useEffect(() => {
    const scores: { [key: string]: { home: string, away: string } } = {};
    let activeJoker: string | null = null;

    matches.forEach(m => {
      const pred = predictions.find(p => p.matchId === m.id && p.employeeId === activeEmployeeId);
      if (pred) {
        scores[m.id] = {
          home: pred.homeScore.toString(),
          away: pred.awayScore.toString()
        };
        if (pred.isJoker) {
          activeJoker = m.id;
        }
      } else {
        scores[m.id] = { home: '', away: '' };
      }
    });

    setLocalScores(scores);
    setJokerMatchId(activeJoker);
  }, [matches, predictions, activeEmployeeId]);

  const handleScoreChange = (matchId: string, side: 'home' | 'away', val: string) => {
    // Only accept numbers
    if (val !== '' && !/^\d+$/.test(val)) return;

    setLocalScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [side]: val
      }
    }));
  };

  const handleJokerToggle = (matchId: string) => {
    // Only allow setting joker on scheduled matches (not finished or live)
    const match = matches.find(m => m.id === matchId);
    if (!match || match.status !== 'scheduled') return;

    setJokerMatchId(current => (current === matchId ? null : matchId));
  };

  const handleSave = (matchId: string) => {
    const scores = localScores[matchId];
    if (!scores || scores.home === '' || scores.away === '') {
      alert('الرجاء إدخال نتيجة كاملة وصحيحة أولاً! ⚽');
      return;
    }

    const hScore = parseInt(scores.home);
    const aScore = parseInt(scores.away);
    const isJoker = jokerMatchId === matchId;

    onSavePrediction(matchId, hScore, aScore, isJoker);
  };

  // Group matches by round or status for clean tab view
  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished' | 'all'>('upcoming');

  const filteredMatches = matches.filter(m => {
    if (activeTab === 'upcoming') return m.status === 'scheduled' || m.status === 'live';
    if (activeTab === 'finished') return m.status === 'finished';
    return true;
  });

  return (
    <div className="space-y-4 font-sans text-right" dir="rtl">
      {/* Category Tabs */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المباريات القادمة والحالية
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'finished'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المباريات المنتهية
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({matches.length})
          </button>
        </div>
        <div className="text-xs text-amber-400 font-bold hidden sm:block">
          * تذكير: مباراة الجوكر تعطي ضعف النقاط! 🃏
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map(m => {
          const pred = predictions.find(p => p.matchId === m.id && p.employeeId === activeEmployeeId);
          const hasSaved = !!pred;
          const scores = localScores[m.id] || { home: '', away: '' };

          // Status Badge details
          let statusBadge = null;
          if (m.status === 'live') {
            statusBadge = (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-500 text-[10px] rounded-full font-bold animate-pulse">
                <Flame className="w-3 h-3 fill-current" /> مباشر
              </span>
            );
          } else if (m.status === 'finished') {
            statusBadge = (
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 text-[10px] rounded-full font-bold">
                منتهية
              </span>
            );
          } else {
            statusBadge = (
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-bold">
                قريباً
              </span>
            );
          }

          return (
            <div
              key={m.id}
              className={`bg-slate-900 border rounded-xl overflow-hidden shadow-md flex flex-col justify-between transition-all ${
                m.status === 'live'
                  ? 'border-red-500/30 bg-gradient-to-b from-slate-900 to-red-950/10'
                  : hasSaved
                  ? 'border-slate-800'
                  : 'border-slate-850 bg-slate-900/50'
              }`}
            >
              {/* Header Info */}
              <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-850 flex justify-between items-center text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-medium text-[9px] uppercase">
                    {m.group}
                  </span>
                  <span>{m.round}</span>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge}
                  <span>
                    {new Date(m.dateTime).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Teams & Scores Area */}
              <div className="p-4 flex items-center justify-between gap-4">
                {/* Home Team */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl filter drop-shadow" role="img" aria-label={m.homeTeam}>
                    {m.homeFlag}
                  </span>
                  <span className="text-xs font-bold text-white mt-1.5 line-clamp-1">{m.homeTeam}</span>
                  {m.status !== 'scheduled' && (
                    <span className="text-xl font-black text-slate-300 mt-1">{m.homeScore}</span>
                  )}
                </div>

                {/* VS / Score Divider */}
                <div className="flex flex-col items-center justify-center">
                  {m.status === 'scheduled' ? (
                    <div className="text-slate-600 font-bold text-xs uppercase px-2.5 py-1 bg-slate-950 rounded-lg">
                      VS
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 bg-slate-950/80 rounded border border-slate-850 text-[10px] font-bold text-slate-400">
                      النتيجة
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl filter drop-shadow" role="img" aria-label={m.awayTeam}>
                    {m.awayFlag}
                  </span>
                  <span className="text-xs font-bold text-white mt-1.5 line-clamp-1">{m.awayTeam}</span>
                  {m.status !== 'scheduled' && (
                    <span className="text-xl font-black text-slate-300 mt-1">{m.awayScore}</span>
                  )}
                </div>
              </div>

              {/* Global Consensus Progress Bar */}
              {m.globalHomeWinPct !== undefined && (
                <div className="px-4 pb-3 pt-1 border-t border-slate-850/60 bg-slate-900/10 flex flex-col gap-1 text-right">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">
                      مؤشر التوقعات العالمية: <strong className="text-slate-400 font-semibold">{m.lastSyncedFromGlobal}</strong>
                    </span>
                    <span className="flex gap-2 text-slate-400 font-mono text-[9px] shrink-0">
                      <span>{m.homeTeam} {m.globalHomeWinPct}%</span>
                      <span>تعادل {m.globalDrawPct}%</span>
                      <span>{m.awayTeam} {m.globalAwayWinPct}%</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden flex border border-slate-850">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${m.globalHomeWinPct}%` }} title={`فوز ${m.homeTeam}: ${m.globalHomeWinPct}%`} />
                    <div className="bg-slate-600 h-full transition-all duration-500" style={{ width: `${m.globalDrawPct}%` }} title={`تعادل: ${m.globalDrawPct}%`} />
                    <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${m.globalAwayWinPct}%` }} title={`فوز ${m.awayTeam}: ${m.globalAwayWinPct}%`} />
                  </div>
                </div>
              )}

              {/* Prediction Inputs Section */}
              <div className="px-4 py-3 bg-slate-950 border-t border-slate-850 flex flex-col gap-2.5">
                {m.status === 'scheduled' ? (
                  <div className="flex items-center justify-between gap-3">
                    {/* Scores Entry */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={2}
                        value={scores.home}
                        onChange={(e) => handleScoreChange(m.id, 'home', e.target.value)}
                        placeholder="0"
                        className="w-10 h-8 bg-slate-900 border border-slate-800 rounded-lg text-center text-sm font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-slate-600">-</span>
                      <input
                        type="text"
                        maxLength={2}
                        value={scores.away}
                        onChange={(e) => handleScoreChange(m.id, 'away', e.target.value)}
                        placeholder="0"
                        className="w-10 h-8 bg-slate-900 border border-slate-800 rounded-lg text-center text-sm font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Joker & Save */}
                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() => handleJokerToggle(m.id)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                          jokerMatchId === m.id
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                        title="تفعيل بطاقة الجوكر لمضاعفة نقاط هذه المباراة"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[10px]">جوكر</span>
                      </button>

                      <button
                        onClick={() => handleSave(m.id)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        حفظ التوقع
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Live or Finished Prediction results */
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      {hasSaved ? (
                        <span className="text-slate-400">
                          توقعت: <strong className="text-white font-mono">{pred.homeScore} - {pred.awayScore}</strong>
                          {pred.isJoker && <span className="text-amber-400 font-bold ml-1">🃏 (جوكر)</span>}
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-red-500/70" /> لم تسجل توقعاً قبل الإغلاق
                        </span>
                      )}
                    </div>

                    {hasSaved && m.status === 'finished' && (
                      <div className="flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">
                          تم الحساب: +{pred.pointsEarned} نقاط
                        </span>
                      </div>
                    )}
                    {hasSaved && m.status === 'live' && (
                      <span className="text-amber-500 font-bold text-[10px] animate-pulse">
                        بانتظار صافرة النهاية...⏳
                      </span>
                    )}
                  </div>
                )}

                {/* Saved confirmation toast style for upcoming */}
                {m.status === 'scheduled' && hasSaved && (
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3 h-3" /> تم حفظ توقعك بنجاح
                    <span className="text-slate-500 font-mono">({pred.homeScore} - {pred.awayScore})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
