import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { Search, Trophy, ArrowUp, ArrowDown, Minus, Filter, Award } from 'lucide-react';

interface LeaderboardProps {
  employees: Employee[];
  activeEmployeeId: string;
}

export default function Leaderboard({ employees, activeEmployeeId }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Search Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [employees, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const activeUserRank = useMemo(() => {
    const index = employees.findIndex(e => e.id === activeEmployeeId);
    return index !== -1 ? index + 1 : null;
  }, [employees, activeEmployeeId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 font-sans text-right" dir="rtl">
      {/* Top Cards for Top 3 Leaders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Second Place */}
        {employees[1] && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden order-2 md:order-1">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-3">
              <span className="text-3xl">{employees[1].avatar}</span>
              <div>
                <h4 className="font-bold text-white text-sm">{employees[1].name}</h4>
                <div className="flex gap-2 text-[10px] text-slate-500 mt-1">
                  <span>دقيق: {employees[1].exactScores}</span>
                  <span>•</span>
                  <span>فارق: {employees[1].goalDifferences}</span>
                </div>
              </div>
            </div>
            <div className="text-left z-10">
              <span className="text-2xl font-black text-blue-400">{employees[1].points}</span>
              <span className="text-[10px] text-slate-400 block font-medium">المركز الثاني 🥈</span>
            </div>
          </div>
        )}

        {/* First Place */}
        {employees[0] && (
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-xl p-5 flex items-center justify-between relative overflow-hidden order-1 md:order-2 shadow-lg shadow-emerald-950/20">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-3">
              <span className="text-4xl">{employees[0].avatar}</span>
              <div>
                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] rounded-md font-bold mb-1 inline-block">البطل الحالي 👑</span>
                <h4 className="font-bold text-white text-base">{employees[0].name}</h4>
                <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
                  <span>دقيق: {employees[0].exactScores}</span>
                  <span>•</span>
                  <span>فارق: {employees[0].goalDifferences}</span>
                </div>
              </div>
            </div>
            <div className="text-left z-10">
              <span className="text-3xl font-black text-amber-400">{employees[0].points}</span>
              <span className="text-[10px] text-amber-300 block font-bold">المركز الأول 🥇</span>
            </div>
          </div>
        )}

        {/* Third Place */}
        {employees[2] && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden order-3">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-3">
              <span className="text-3xl">{employees[2].avatar}</span>
              <div>
                <h4 className="font-bold text-white text-sm">{employees[2].name}</h4>
                <div className="flex gap-2 text-[10px] text-slate-500 mt-1">
                  <span>دقيق: {employees[2].exactScores}</span>
                  <span>•</span>
                  <span>فارق: {employees[2].goalDifferences}</span>
                </div>
              </div>
            </div>
            <div className="text-left z-10">
              <span className="text-2xl font-black text-amber-600">{employees[2].points}</span>
              <span className="text-[10px] text-slate-400 block font-medium">المركز الثالث 🥉</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Filters Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="ابحث عن زميل بالاسم أو الإيميل..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-right"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs border-b border-slate-800">
                <th className="p-4 w-16 text-center">الترتيب</th>
                <th className="p-4">الموظف</th>
                <th className="p-4 text-center">النتائج الدقيقة (5ن)</th>
                <th className="p-4 text-center">الفارق (3ن)</th>
                <th className="p-4 text-center">الاتجاه (2ن)</th>
                <th className="p-4 text-center font-bold text-white">إجمالي النقاط</th>
                <th className="p-4 w-20 text-center">الاتجاه</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => {
                  const isActive = emp.id === activeEmployeeId;
                  const rankDifference = (emp.previousRank || 0) - (emp.rank || 0);

                  return (
                    <tr
                      key={emp.id}
                      className={`text-xs border-b border-slate-850 hover:bg-slate-850/40 transition-colors ${
                        isActive ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="p-4 text-center font-bold text-slate-300">
                        <div className="flex items-center justify-center gap-1.5">
                          {emp.rank === 1 && <span className="text-amber-400">🥇</span>}
                          {emp.rank === 2 && <span className="text-slate-400">🥈</span>}
                          {emp.rank === 3 && <span className="text-amber-600">🥉</span>}
                          {emp.rank && emp.rank > 3 && <span>{emp.rank}</span>}
                        </div>
                      </td>

                      {/* Employee Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            {emp.avatar}
                          </span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {emp.name}
                              {isActive && (
                                <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[9px] rounded-md font-bold">
                                  أنت
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 block">{emp.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Exact Scores */}
                      <td className="p-4 text-center font-medium text-emerald-400">
                        {emp.exactScores}
                      </td>

                      {/* Goal Differences */}
                      <td className="p-4 text-center font-medium text-blue-400">
                        {emp.goalDifferences}
                      </td>

                      {/* Correct Outcomes */}
                      <td className="p-4 text-center font-medium text-purple-400">
                        {emp.correctOutcomes}
                      </td>

                      {/* Total Points */}
                      <td className="p-4 text-center font-black text-emerald-400 text-sm">
                        {emp.points}
                      </td>

                      {/* Rank Trend */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          {rankDifference > 0 ? (
                            <div className="flex items-center gap-0.5 text-emerald-400 font-bold text-[10px]">
                              <ArrowUp className="w-3.5 h-3.5" /> {rankDifference}
                            </div>
                          ) : rankDifference < 0 ? (
                            <div className="flex items-center gap-0.5 text-red-400 font-bold text-[10px]">
                              <ArrowDown className="w-3.5 h-3.5" /> {Math.abs(rankDifference)}
                            </div>
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    لا يوجد نتائج تطابق بحثك الحالي!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-[11px] text-slate-500">
            عرض <strong className="text-slate-300">{Math.min(filteredEmployees.length, currentPage * itemsPerPage)}</strong> من أصل <strong className="text-slate-300">{filteredEmployees.length}</strong> مشاركاً
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-800 text-[11px] disabled:opacity-40 disabled:hover:bg-slate-900 transition-colors"
            >
              السابق
            </button>
            <div className="flex items-center px-3 text-xs text-slate-400">
              صفحة {currentPage} من {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-800 text-[11px] disabled:opacity-40 disabled:hover:bg-slate-900 transition-colors"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
