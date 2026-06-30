import React from 'react';
import { X, Award, ShieldAlert, Zap, Trophy, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="rules-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-sans">قوانين التوقعات العالمية (Kicktipp Rules)</h2>
              <p className="text-xs text-slate-400 mt-0.5">كيفية احتساب النقاط وتوزيع الجوائز في بطولة الشركة</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-right font-sans" dir="rtl">
          {/* Main Rules Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex flex-col justify-between text-center">
              <div>
                <span className="text-3xl font-extrabold text-emerald-400">5+</span>
                <span className="text-xs text-emerald-300 block font-medium mt-1">نقاط</span>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-white text-sm">النتيجة الدقيقة</h4>
                <p className="text-xs text-slate-400 mt-1">توقعت 2-1 وانتهت المباراة 2-1 فعلاً. برافو!</p>
              </div>
            </div>

            <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl flex flex-col justify-between text-center">
              <div>
                <span className="text-3xl font-extrabold text-blue-400">3+</span>
                <span className="text-xs text-blue-300 block font-medium mt-1">نقاط</span>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-white text-sm">فارق الأهداف والاتجاه</h4>
                <p className="text-xs text-slate-400 mt-1">توقعت 3-1 وانتهت 2-0. الفائز صحيح وفارق الأهداف (+2) صحيح.</p>
              </div>
            </div>

            <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-xl flex flex-col justify-between text-center">
              <div>
                <span className="text-3xl font-extrabold text-purple-400">2+</span>
                <span className="text-xs text-purple-300 block font-medium mt-1">نقاط</span>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-white text-sm">النتيجة العامة (الاتجاه)</h4>
                <p className="text-xs text-slate-400 mt-1">توقعت 2-1 وانتهت 3-1. الفائز صحيح فقط أو التعادل صحيح (توقعت 1-1 وانتهت 0-0).</p>
              </div>
            </div>
          </div>

          {/* Special Joker Feature */}
          <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg mt-1">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-400 text-sm">ميزة الجوكر المضاعف (Joker Card) 🃏</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  يمكنك تحديد <strong>مباراة جوكر واحدة فقط</strong> في كل جولة! توقعك لهذه المباراة سيعطيك <strong>ضعف النقاط</strong> في حال نجاحه:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside mt-2 space-y-1">
                  <li>النتيجة الدقيقة للجوكر = <strong className="text-amber-400">10 نقاط</strong></li>
                  <li>فارق الأهداف للجوكر = <strong className="text-amber-400">6 نقاط</strong></li>
                  <li>الاتجاه الصحيح للجوكر = <strong className="text-amber-400">4 نقاط</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tournament Long-term predictions */}
          <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-700 text-slate-300 rounded-lg mt-1">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">التوقعات الكبرى للبطولة (Tournament Outrights) 🏆</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  توقعات يتم تسجيلها قبل انطلاق البطولة وتُحتسب نقاطها في ختام المونديال:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">بطل المونديال</span>
                    <strong className="text-sm text-emerald-400">15 نقطة</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">وصيف المونديال</span>
                    <strong className="text-sm text-blue-400">10 نقاط</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">هداف المونديال</span>
                    <strong className="text-sm text-purple-400">10 نقاط</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deadlines and Policies */}
          <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl flex gap-3 items-start">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-red-300 text-xs">الشروط والالتزام بالوقت</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                يُقفل باب توقع أي مباراة تلقائياً **قبل دقيقة واحدة من ركلة البداية**. لا يمكن تعديل التوقعات بعد بدء المباراة مطلقاً لضمان النزاهة التامة والعدل بين جميع المشاركين.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors font-sans"
          >
            فهمت، بالتوفيق لجميع الموظفين! 👍
          </button>
        </div>
      </div>
    </div>
  );
}
