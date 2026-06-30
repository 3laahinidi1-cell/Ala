import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Flame, User, Bot, Loader2 } from 'lucide-react';
import { Employee } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AiAnalystProps {
  currentUser: Employee;
  employees: Employee[];
}

export default function AiAnalyst({ currentUser, employees }: AiAnalystProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `يا هلا وغلا يا كابتن ${currentUser.name}! ⚽🔥 معك "أبو الفوز" محلل المونديال وصوت المدرجات الأول في الشركة! الصدارة تشتعل والمنافسة حامية بين زملائنا المشاركين في التحدي! هل تريد نصيحة فنية لتوقعاتك القادمة، أم تريد تحليلاً لجدول الترتيب والمزاح الكروي اللطيف؟ اسألني ما شئت ودعنا نعيش الإثارة! 🎙️📣`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message history, current leaderboard status, and active user to our API
      const leaderboardContext = employees.slice(0, 10).map(e => ({
        rank: e.rank,
        name: e.name,
        points: e.points,
        exacts: e.exactScores
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          })),
          leaderboardContext,
          currentUser: {
            name: currentUser.name,
            points: currentUser.points,
            rank: currentUser.rank,
            predictions: {
              champion: currentUser.championPrediction,
              runner: currentUser.runnerUpPrediction,
              topScorer: currentUser.topScorerPrediction
            }
          }
        })
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بمحلل المونديال الذكي.');
      }

      const data = await res.json();

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text
      };

      setMessages(prev => [...prev, replyMsg]);
    } catch (error) {
      console.error(error);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'يا كابتن! يبدو أن الكرة قطعت في منتصف الملعب بسبب مشكلة اتصال بالخادم! حاول إرسال رسالتك مجدداً وسأكون بانتظارك بالتكتيك المناسب. 🛠️⚽'
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetPrompts = [
    'حلل لي لوحة الصدارة الحالية بالشركة 📊',
    'ما هي أفضل نصيحة لتوقعي لمباراة إسبانيا ضد اليابان القادمة؟ 🇪🇸🇯🇵',
    'أعطني مزحة أو تعليقاً ساخراً عن حماس المنافسة وتوقعات زملائي! 😂🔥',
    'من هو ترشيحك النهائي لبطل كأس العالم والهداف؟ 🏆⚽'
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[550px] font-sans text-right" dir="rtl">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-emerald-950/20 to-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="text-2xl bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/30">
              🎙️
            </span>
            <span className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-ping" />
            <span className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-xs">محلل المونديال: أبو الفوز</h3>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block">معلّق الذكاء الاصطناعي متاح حالياً للتحليل والتكتيك</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
        {messages.map(m => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                isUser 
                  ? 'bg-emerald-500 text-white font-medium rounded-tr-none' 
                  : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          );
        })}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] ml-auto items-center">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-tl-none p-3 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>أبو الفوز يراجع خطة اللعب ويرتب الرد التكتيكي...⚽</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Preset Prompts Area */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
        {presetPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 rounded-full transition-colors font-medium shrink-0 disabled:opacity-40"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="اسأل أبو الفوز عن أي شيء بالمونديال والمسابقة..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-right"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors shrink-0"
        >
          <Send className="w-4 h-4 transform rotate-180" />
        </button>
      </form>
    </div>
  );
}
