import React, { useState } from 'react';
import { Match } from '../types';
import { Settings, Save, RefreshCw, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';

interface AdminPanelProps {
  matches: Match[];
  onUpdateMatchScore: (matchId: string, homeScore: number, awayScore: number, status: 'scheduled' | 'live' | 'finished') => void;
  onResetTournament: () => void;
}

export default function AdminPanel({ matches, onUpdateMatchScore, onResetTournament }: AdminPanelProps) {
  const [editingScores, setEditingScores] = useState<{ [key: string]: { home: string, away: string, status: 'scheduled' | 'live' | 'finished' } }>({});

  const handleScoreChange = (matchId: string, side: 'home' | 'away', val: string) => {
    if (val !== '' && !/^\d+$/.test(val)) return;

    const current = editingScores[matchId] || {
      home: (matches.find(m => m.id === matchId)?.homeScore ?? '').toString(),
      away: (matches.find(m => m.id === matchId)?.awayScore ?? '').toString(),
      status: matches.find(m => m.id === matchId)?.status ?? 'scheduled'
    };

    setEditingScores(prev => ({
      ...prev,
      [matchId]: {
        ...current,
        [side]: val
      }
    }));
  };

  const handleStatusChange = (matchId: string, status: 'scheduled' | 'live' | 'finished') => {
    const current = editingScores[matchId] || {
      home: (matches.find(m => m.id === matchId)?.homeScore ?? '').toString(),
      away: (matches.find(m => m.id === matchId)?.awayScore ?? '').toString(),
      status: matches.find(m => m.id === matchId)?.status ?? 'scheduled'
    };

    setEditingScores(prev => ({
      ...prev,
      [matchId]: {
        ...current,
        status
      }
    }));
  };

  const handleSave = (matchId: string) => {
    const edit = editingScores[matchId];
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Default to existing scores if not edited
    const homeStr = edit ? edit.home : (match.homeScore ?? '').toString();
    const awayStr = edit ? edit.away : (match.awayScore ?? '').toString();
    const status = edit ? edit.status : match.status;

    if (status !== 'scheduled' && (homeStr === '' || awayStr === '')) {
      alert('الرجاء إدخال أرقام صحيحة لنتائج المباريات المباشرة أو المنتهية! ⚽');
      return;
    }

    const homeScore = homeStr === '' ? 0 : parseInt(homeStr);
    const awayScore = awayStr === '' ? 0 : parseInt(awayStr);

    onUpdateMatchScore(matchId, homeScore, awayScore, status);
    alert('تم تحديث النتيجة وإعادة احتساب نقاط الموظفين المشاركين وتحديث الترتيب فورياً! 🏆🔥');
  };

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Disclaimer / Notice */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-400 text-xs">شاشة محاكاة المسؤول (Admin Dashboard Simulation)</h4>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            هذه الشاشة مخصصة لمحاكاة دور منسق البطولة في الشركة. يمكنك تعديل نتائج مباريات كأس العالم الحقيقية وتغيير حالتها. بمجرد الضغط على <strong>"حفظ وتحديث"</strong>، سيقوم النظام بتوزيع النقاط وإعادة ترتيب الموظفين المشاركين فورياً وفقاً للتوقعات التي سجلوها!
          </p>
        </div>
      </div>

      {/* Fixtures List for editing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-emerald-400" /> إدارة وتحديث مباريات البطولة
          </span>
          <button
            onClick={onResetTournament}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> إعادة ضبط البطولة للوضع الافتراضي
          </button>
        </div>

        <div className="divide-y divide-slate-850">
          {matches.map(m => {
            const edit = editingScores[m.id];
            const currentHome = edit ? edit.home : (m.homeScore ?? '').toString();
            const currentAway = edit ? edit.away : (m.awayScore ?? '').toString();
            const currentStatus = edit ? edit.status : m.status;

            return (
              <div key={m.id} className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between hover:bg-slate-850/20 transition-colors">
                {/* Match Identity */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-2xl">{m.homeFlag}</span>
                  <span className="text-xs font-bold text-white w-20 text-center">{m.homeTeam}</span>
                  <span className="text-slate-500 text-[10px]">VS</span>
                  <span className="text-xs font-bold text-white w-20 text-center">{m.awayTeam}</span>
                  <span className="text-2xl">{m.awayFlag}</span>
                  <span className="px-1.5 py-0.5 bg-slate-800 text-[9px] text-slate-400 rounded-md font-sans">
                    {m.group}
                  </span>
                </div>

                {/* Score Controls & Status */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">الحالة:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(m.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 font-sans"
                    >
                      <option value="scheduled">قادمة (Scheduled)</option>
                      <option value="live">مباشر (Live)</option>
                      <option value="finished">منتهية (Finished)</option>
                    </select>
                  </div>

                  {/* Score Inputs (only active if not scheduled) */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 ml-1">النتيجة:</span>
                    <input
                      type="text"
                      maxLength={2}
                      disabled={currentStatus === 'scheduled'}
                      value={currentHome}
                      onChange={(e) => handleScoreChange(m.id, 'home', e.target.value)}
                      placeholder="-"
                      className="w-10 h-8 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs font-bold text-white disabled:opacity-30 disabled:bg-slate-900"
                    />
                    <span className="text-slate-600">-</span>
                    <input
                      type="text"
                      maxLength={2}
                      disabled={currentStatus === 'scheduled'}
                      value={currentAway}
                      onChange={(e) => handleScoreChange(m.id, 'away', e.target.value)}
                      placeholder="-"
                      className="w-10 h-8 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs font-bold text-white disabled:opacity-30 disabled:bg-slate-900"
                    />
                  </div>

                  {/* Save button */}
                  <button
                    onClick={() => handleSave(m.id)}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> حفظ وتحديث
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
