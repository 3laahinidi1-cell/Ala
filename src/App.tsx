import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, Users, HelpCircle, Bot, Settings, 
  Globe, RefreshCw, ChevronDown, User, ShieldCheck
} from 'lucide-react';

import { Employee, Match, Prediction, AppState } from './types';
import { 
  generateEmployees, 
  generateMockPredictions, 
  recalculateAllScores, 
  INITIAL_MATCHES, 
  calculatePointsForPrediction 
} from './data/mockData';

import MatchList from './components/MatchList';
import Leaderboard from './components/Leaderboard';
import StatsPanel from './components/StatsPanel';
import AiAnalyst from './components/AiAnalyst';
import AdminPanel from './components/AdminPanel';
import RulesModal from './components/RulesModal';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  
  // Spotlight active users we can switch between for simulation
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('emp_3laa');
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'matches' | 'leaderboard' | 'stats' | 'chat' | 'admin'>('matches');
  const [isLoadingState, setIsLoadingState] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Synchronize state with Full-Stack server
  useEffect(() => {
    async function loadState() {
      setIsLoadingState(true);
      try {
        const res = await fetch('/api/state');
        const data = await res.json();
        
        if (data && data.success !== false && data.status !== 'not_initialized') {
          // Loaded successfully from server file
          setEmployees(data.employees);
          setMatches(data.matches);
          setPredictions(data.predictions);
        } else {
          // Initialize default state
          const initialEmployees = generateEmployees();
          const initialMatches = INITIAL_MATCHES;
          const initialPredictions = generateMockPredictions(initialEmployees, initialMatches);
          
          setEmployees(initialEmployees);
          setMatches(initialMatches);
          setPredictions(initialPredictions);
          
          // Save initialized state to server
          await fetch('/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employees: initialEmployees,
              matches: initialMatches,
              predictions: initialPredictions
            })
          });
        }
      } catch (error) {
        console.error('Failed to communicate with state API, initializing local storage backup:', error);
        // Fallback to local storage
        const local = localStorage.getItem('world_cup_state');
        if (local) {
          const parsed = JSON.parse(local);
          setEmployees(parsed.employees);
          setMatches(parsed.matches);
          setPredictions(parsed.predictions);
        } else {
          const initialEmployees = generateEmployees();
          const initialMatches = INITIAL_MATCHES;
          const initialPredictions = generateMockPredictions(initialEmployees, initialMatches);
          
          setEmployees(initialEmployees);
          setMatches(initialMatches);
          setPredictions(initialPredictions);
        }
      } finally {
        setIsLoadingState(false);
      }
    }
    loadState();
  }, []);

  // Save changes helper
  const saveStateToServer = async (newEmployees: Employee[], newMatches: Match[], newPredictions: Prediction[]) => {
    setEmployees(newEmployees);
    setMatches(newMatches);
    setPredictions(newPredictions);

    // Save to LocalStorage first as fallback
    localStorage.setItem('world_cup_state', JSON.stringify({
      employees: newEmployees,
      matches: newMatches,
      predictions: newPredictions
    }));

    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employees: newEmployees,
          matches: newMatches,
          predictions: newPredictions
        })
      });
    } catch (err) {
      console.warn('Could not post updated state to server:', err);
    }
  };

  // 1. Save prediction from active employee
  const handleSavePrediction = (matchId: string, homeScore: number, awayScore: number, isJoker: boolean) => {
    // 1. Find and update or insert prediction
    let updatedPredictions = [...predictions];
    const index = updatedPredictions.findIndex(p => p.matchId === matchId && p.employeeId === activeEmployeeId);

    // If setting joker, disable joker on other predictions for this employee
    if (isJoker) {
      updatedPredictions = updatedPredictions.map(p => {
        if (p.employeeId === activeEmployeeId && p.matchId !== matchId) {
          return { ...p, isJoker: false };
        }
        return p;
      });
    }

    if (index !== -1) {
      updatedPredictions[index] = {
        ...updatedPredictions[index],
        homeScore,
        awayScore,
        isJoker
      };
    } else {
      updatedPredictions.push({
        matchId,
        employeeId: activeEmployeeId,
        homeScore,
        awayScore,
        isJoker
      });
    }

    // If the match is already finished, calculate points immediately
    const match = matches.find(m => m.id === matchId);
    if (match && match.status === 'finished') {
      const result = calculatePointsForPrediction(homeScore, awayScore, match.homeScore, match.awayScore, isJoker);
      const predIdx = updatedPredictions.findIndex(p => p.matchId === matchId && p.employeeId === activeEmployeeId);
      updatedPredictions[predIdx].pointsEarned = result.points;
    }

    // Trigger full score/rank update for everyone
    const recalculated = recalculateAllScores(employees, matches, updatedPredictions);
    saveStateToServer(recalculated.employees, matches, recalculated.predictions);
  };

  // 2. Admin updates a match score/status
  const handleUpdateMatchScore = (matchId: string, homeScore: number, awayScore: number, status: 'scheduled' | 'live' | 'finished') => {
    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          homeScore: status === 'scheduled' ? undefined : homeScore,
          awayScore: status === 'scheduled' ? undefined : awayScore,
          status
        };
      }
      return m;
    });

    // Run calculation engine for all participating employees based on this updated match
    const recalculated = recalculateAllScores(employees, updatedMatches, predictions);
    saveStateToServer(recalculated.employees, updatedMatches, recalculated.predictions);
  };

  // 3. Reset entire tournament back to default seed
  const handleResetTournament = () => {
    const initialEmployees = generateEmployees();
    const initialMatches = INITIAL_MATCHES;
    const initialPredictions = generateMockPredictions(initialEmployees, initialMatches);
    saveStateToServer(initialEmployees, initialMatches, initialPredictions);
    alert('تم إعادة ضبط البطولة ومسح تعديلات المحاكاة بنجاح! 🏆⚽');
  };

  // 4. Sync with Global FIFA/Kicktipp Prediction APIs
  const handleSyncGlobal = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-global');
      const data = await res.json();
      if (data.success) {
        // Merge global prediction percentages and sources into our matches state!
        const updatedMatches = matches.map(m => {
          const consensus = data.globalConsensusList.find((g: any) => g.id === m.id);
          if (consensus) {
            return {
              ...m,
              globalHomeWinPct: consensus.homeWin,
              globalAwayWinPct: consensus.awayWin,
              globalDrawPct: consensus.draw,
              lastSyncedFromGlobal: consensus.source
            };
          }
          return m;
        });

        // Trigger full score/rank update for everyone
        const recalculated = recalculateAllScores(employees, updatedMatches, predictions);
        await saveStateToServer(recalculated.employees, updatedMatches, recalculated.predictions);

        alert(`✅ ${data.message}\n\nالمصدر النشط: ${data.dataSource}`);
      } else {
        alert('❌ فشل الاتصال بالمواقع العالمية للتوقعات.');
      }
    } catch (error) {
      console.error(error);
      alert('❌ خطأ في الاتصال بالخادم لمزامنة البيانات العالمية.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Get active employee details
  const activeEmployee = employees.find(e => e.id === activeEmployeeId);

  if (isLoadingState) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <h2 className="text-white font-bold text-sm">جاري تهيئة ملعب البطولة واستدعاء زملائنا المشاركين... 🏟️🏆</h2>
          <p className="text-xs text-slate-500">يرجى الانتظار ثانية واحدة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Visual Top Bar decoration */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-900 border border-slate-850 p-5 rounded-2xl relative overflow-hidden text-right" dir="rtl">
          {/* Subtle field graphic background */}
          <div className="absolute left-0 bottom-0 top-0 w-1/3 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
          
          {/* Brand Logo & Meta */}
          <div className="flex items-center gap-4">
            {/* Elegant SVG Corporate Emblem / Logo */}
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center border border-emerald-400/20">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
                <circle cx="12" cy="11" r="4" strokeWidth="2" />
                <path d="M12 7v8M8 11h8" strokeWidth="1.5" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase leading-none">GLOBAL ENTERPRISE</span>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-none">كأس توقعات الشركة الكبرى 🏆</h1>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded-full">
                    داخلي للمشاركين 🏢
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">المنصة الرياضية الخاصة بموظفي الشركة لتوقعات كأس العالم بالتوافق مع القوانين الكروية العالمية</p>
            </div>
          </div>

          {/* Active Testing User & Rules Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Sync Global Button */}
            <button
              onClick={handleSyncGlobal}
              disabled={isSyncing}
              className={`px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 text-xs font-bold transition-all flex items-center gap-1.5 ${isSyncing ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>مزامنة التوقعات العالمية</span>
            </button>

            {/* Rules Button */}
            <button
              onClick={() => setIsRulesOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>قوانين احتساب النقاط</span>
            </button>

            {/* Profile Picker Switcher (Crucial for Demoing) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">تجربة موظف آخر:</span>
              <div className="relative">
                <select
                  value={activeEmployeeId}
                  onChange={(e) => setActiveEmployeeId(e.target.value)}
                  className="bg-transparent border-none text-xs text-emerald-400 font-black pr-6 pl-2 focus:outline-none focus:ring-0 cursor-pointer font-sans appearance-none"
                >
                  {employees.filter(emp => ['emp_3laa', 'emp_mona', 'emp_ahmad', 'emp_sarah', 'emp_khaled'].includes(emp.id)).map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-slate-950 text-slate-300 text-xs">
                      {emp.avatar} {emp.name} (مشارك نشط)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-emerald-400 absolute right-0 top-0.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* User Stats Snapshot Widget */}
        {activeEmployee && (
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950/20 border border-slate-850 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between text-right" dir="rtl">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-slate-950 w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                {activeEmployee.avatar}
              </span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">بطاقتك الشخصية للتوقعات:</span>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  {activeEmployee.name}
                  <span className="text-[11px] text-emerald-400">(مشارك نشط ⚽)</span>
                </h3>
              </div>
            </div>

            {/* User Standings Breakdown */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs justify-end">
              <div className="p-2 bg-slate-950/50 border border-slate-800 rounded-lg min-w-20 text-center">
                <span className="text-[10px] text-slate-500 block">ترتيبك</span>
                <strong className="text-sm text-white font-mono">#{activeEmployee.rank}</strong>
              </div>
              <div className="p-2 bg-slate-950/50 border border-slate-800 rounded-lg min-w-20 text-center">
                <span className="text-[10px] text-slate-500 block">النقاط</span>
                <strong className="text-sm text-emerald-400 font-mono">{activeEmployee.points} ن</strong>
              </div>
              <div className="p-2 bg-slate-950/50 border border-slate-800 rounded-lg min-w-20 text-center">
                <span className="text-[10px] text-slate-500 block">النتيجة الدقيقة</span>
                <strong className="text-sm text-amber-400 font-mono">{activeEmployee.exactScores}</strong>
              </div>
              <div className="p-2 bg-slate-950/50 border border-slate-800 rounded-lg min-w-20 text-center">
                <span className="text-[10px] text-slate-500 block">فارق الأهداف</span>
                <strong className="text-sm text-blue-400 font-mono">{activeEmployee.goalDifferences}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <nav className="flex overflow-x-auto gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-850 justify-start scrollbar-none" dir="rtl">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'matches'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>جدول المباريات والتوقعات</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>جدول ترتيب المشاركين</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'stats'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إحصائيات وتحليلات البطولة</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'chat'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>محلل المونديال: أبو الفوز 🎙️</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 mr-auto whitespace-nowrap shrink-0 ${
              activeTab === 'admin'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25 font-bold'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-850 border border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>محاكاة النتائج (مسؤول)</span>
          </button>
        </nav>

        {/* Tab View Contents */}
        <main className="min-h-[400px]">
          {activeTab === 'matches' && activeEmployee && (
            <MatchList 
              matches={matches}
              predictions={predictions}
              activeEmployeeId={activeEmployee.id}
              onSavePrediction={handleSavePrediction}
            />
          )}

          {activeTab === 'leaderboard' && activeEmployee && (
            <Leaderboard 
              employees={employees}
              activeEmployeeId={activeEmployee.id}
            />
          )}

          {activeTab === 'stats' && (
            <StatsPanel 
              employees={employees}
              matches={matches}
              predictions={predictions}
            />
          )}

          {activeTab === 'chat' && activeEmployee && (
            <AiAnalyst 
              currentUser={activeEmployee}
              employees={employees}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel 
              matches={matches}
              onUpdateMatchScore={handleUpdateMatchScore}
              onResetTournament={handleResetTournament}
            />
          )}
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="p-6 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-600 font-sans mt-12 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Globe className="w-4 h-4 text-emerald-500" />
          <span>المونديال بين الموظفين ⚽ نظام توقعات داخلي لبيئة عمل مليئة بالحماس والمنافسة الشريفة.</span>
        </div>
        <p>© 2026 جميع الحقوق محفوظة لشركتنا الكبرى الموقرة. تصميم مع لمسة إثارة رياضية.</p>
      </footer>

      {/* Rules Modal component */}
      <RulesModal 
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
