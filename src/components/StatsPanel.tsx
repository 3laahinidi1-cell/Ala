import React, { useMemo } from 'react';
import { Employee, Match, Prediction } from '../types';
import { Award, Users, Trophy, Percent, HelpCircle, Star, Sparkles } from 'lucide-react';

interface StatsPanelProps {
  employees: Employee[];
  matches: Match[];
  predictions: Prediction[];
}

export default function StatsPanel({ employees, matches, predictions }: StatsPanelProps) {
  // 1. Calculate overall stats sources
  const pointBreakdown = useMemo(() => {
    let exactCount = 0;
    let diffCount = 0;
    let outcomeCount = 0;

    employees.forEach(emp => {
      exactCount += emp.exactScores;
      diffCount += emp.goalDifferences;
      outcomeCount += emp.correctOutcomes;
    });

    const total = exactCount + diffCount + outcomeCount || 1;

    return {
      exact: exactCount,
      exactPct: Math.round((exactCount / total) * 100),
      diff: diffCount,
      diffPct: Math.round((diffCount / total) * 100),
      outcome: outcomeCount,
      outcomePct: Math.round((outcomeCount / total) * 100),
    };
  }, [employees]);

  // 2. Champion predictions summary
  const popularChampions = useMemo(() => {
    const counts: { [key: string]: number } = {};
    employees.forEach(e => {
      if (e.championPrediction) {
        counts[e.championPrediction] = (counts[e.championPrediction] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([team, count]) => ({ team, count, pct: Math.round((count / employees.length) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [employees]);

  // 3. Overall numbers
  const totals = useMemo(() => {
    const finishedMatchesCount = matches.filter(m => m.status === 'finished').length;
    const totalPredictionsPlaced = predictions.length;
    return {
      finishedMatchesCount,
      totalPredictionsPlaced,
      completionRate: matches.length ? Math.round((finishedMatchesCount / matches.length) * 100) : 0
    };
  }, [matches, predictions]);

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-white">{employees.length}</span>
            <span className="text-[10px] text-slate-400 block font-medium mt-1">المشاركين المسجلين في البطولة</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-white">{totals.totalPredictionsPlaced}</span>
            <span className="text-[10px] text-slate-400 block font-medium mt-1">توقع تم تسجيله حتى الآن</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-white">{totals.finishedMatchesCount} / {matches.length}</span>
            <span className="text-[10px] text-slate-400 block font-medium mt-1">مباراة منتهية تم حسابها</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-white">{totals.completionRate}%</span>
            <span className="text-[10px] text-slate-400 block font-medium mt-1">نسبة اكتمال البطولة</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Points Breakdown Panel (Replaces Department standing) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                📊 مصادر النقاط وتوزيع التوقعات (Points Sources)
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">تحليل لمدى دقة توقعات جميع المشاركين في البطولة الكلية</p>
            </div>

            <div className="p-4 space-y-5">
              {/* Source 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-emerald-400">النتائج الدقيقة (5 نقاط)</span>
                  <span className="text-slate-400 font-mono">{pointBreakdown.exact} توقع دقيق ({pointBreakdown.exactPct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pointBreakdown.exactPct}%` }} />
                </div>
              </div>

              {/* Source 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-blue-400">فارق الأهداف (3 نقاط)</span>
                  <span className="text-slate-400 font-mono">{pointBreakdown.diff} توقع للفارق ({pointBreakdown.diffPct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${pointBreakdown.diffPct}%` }} />
                </div>
              </div>

              {/* Source 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-purple-400">الاتجاه والنتيجة الكلية (نقطتان)</span>
                  <span className="text-slate-400 font-mono">{pointBreakdown.outcome} نتيجة فوز/تعادل ({pointBreakdown.outcomePct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${pointBreakdown.outcomePct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex gap-2 items-center text-[10px] text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>نظام النقاط يشجع المهارة الكروية العالية والتوقع المدروس للفرق المفضلة!</span>
          </div>
        </div>

        {/* Popular Champions Predictions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                🔮 البطل الأكثر ترشيحاً بالشركة (Champion Consensus)
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">المنتخبات الأكثر شعبية للفوز بكأس العالم 2026 بين المشاركين</p>
            </div>

            <div className="p-4 space-y-4">
              {popularChampions.map((champ, index) => {
                // Find corresponding flag
                const flags: { [key: string]: string } = {
                  'السعودية': '🇸🇦', 'المغرب': '🇲🇦', 'الأرجنتين': '🇦🇷', 'البرازيل': '🇧🇷',
                  'فرنسا': '🇫🇷', 'إسبانيا': '🇪🇸', 'ألمانيا': '🇩🇪', 'إنجلترا': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
                  'البرتغال': '🇵🇹', 'إيطاليا': '🇮🇹', 'أمريكا': '🇺🇸', 'هولندا': '🇳🇱'
                };
                const flag = flags[champ.team] || '🏳️';

                return (
                  <div key={champ.team} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl shrink-0">{flag}</span>
                      <span className="font-bold text-white">{champ.team}</span>
                    </div>

                    <div className="flex items-center gap-4 flex-1 max-w-[60%] justify-end">
                      {/* Mini bar chart */}
                      <div className="w-32 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850 hidden sm:block">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${champ.pct}%` }}
                        />
                      </div>
                      <span className="text-slate-400 font-medium">
                        <strong className="text-white font-mono">{champ.count}</strong> ترشيحاً ({champ.pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex gap-2 items-center text-[10px] text-slate-500">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>سيتم إضافة نقاط توقع البطل والوصيف والهداف (15 و 10 نقاط) تلقائياً فور نهاية المباراة النهائية لكأس العالم!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
