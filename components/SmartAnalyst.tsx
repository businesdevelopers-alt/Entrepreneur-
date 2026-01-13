
import React, { useState } from 'react';
import { generateSmartBriefing } from '../services/geminiService';
import { BriefingResponse } from '../types';
import { Sparkles, BrainCircuit, Loader2, FileText, Target, Zap, Compass, RefreshCw, BarChart3, Share2, ShieldCheck } from 'lucide-react';
import ShareModal from './ShareModal';

const SUGGESTED_TOPICS = ["مستقبل الحوسبة الكمية", "ثورة الذكاء الاصطناعي في الطب", "التحول الرقمي في السعودية 2030", "العملات الرقمية المشفرة", "استراتيجيات النمو للشركات الناشئة"];

const SmartAnalyst: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateSmartBriefing(topic);
      setBriefing(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-6xl">
      <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[550px] border border-white/5 flex flex-col">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 p-8 md:p-14 flex-grow flex flex-col">
          {!briefing && !loading ? (
            <div className="flex-grow flex flex-col justify-center text-center max-w-2xl mx-auto space-y-10">
              <div>
                <div className="inline-flex p-5 bg-emerald-500/10 rounded-3xl mb-8 border border-emerald-500/20"><BrainCircuit size={48} className="text-emerald-400" /></div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-tajawal">المحلل الذكي</h1>
                <p className="text-slate-400 text-lg leading-relaxed">اكتشف الرؤى الاستراتيجية حول أي موضوع تقني أو ريادي في ثوانٍ معدودة.</p>
              </div>
              <form onSubmit={handleSubmit} className="relative">
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="ماذا تريد أن نحلل اليوم؟" className="w-full p-6 pl-32 bg-white/5 border border-white/10 text-white rounded-2xl text-xl focus:outline-none focus:border-emerald-500/50 transition-all" />
                <button type="submit" disabled={!topic.trim()} className="absolute left-2.5 top-2.5 bottom-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-xl font-black transition-all disabled:opacity-50"><Zap size={20} /></button>
              </form>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_TOPICS.map(t => (
                  <button key={t} onClick={() => setTopic(t)} className="text-xs text-slate-400 hover:text-white bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-all">{t}</button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative"><Loader2 size={80} className="text-emerald-400 animate-spin" /><Sparkles size={32} className="absolute inset-0 m-auto text-emerald-300 opacity-50" /></div>
              <div className="max-w-md">
                <h3 className="text-2xl font-black text-white mb-2">جاري المعالجة الذكية</h3>
                <p className="text-slate-400 italic">"تقوم نماذج Gemini ببناء تقرير استراتيجي مفصل حول {topic}..."</p>
              </div>
            </div>
          ) : briefing && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400"><BarChart3 size={32} /></div>
                  <div><h2 className="text-3xl font-black text-white font-amiri leading-tight">{briefing.title}</h2><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">تحليل استراتيجي حصري • Gemini AI</p></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsShareOpen(true)} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all"><Share2 size={20} /></button>
                  <button onClick={() => setBriefing(null)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all"><RefreshCw size={18} /> تحليل جديد</button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                    <div className="flex items-center gap-3 mb-6"><FileText size={20} className="text-emerald-400" /><h3 className="font-black text-white uppercase tracking-wider">الملخص التنفيذي</h3></div>
                    <p className="text-slate-200 text-xl font-amiri leading-relaxed">{briefing.summary}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2 px-2"><Target size={20} className="text-rose-500" /> الركائز الأساسية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {briefing.keyPoints.map((p, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex gap-4">
                          <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">{i+1}</span>
                          <p className="text-slate-300 text-sm leading-relaxed">{p}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-emerald-400"><Compass size={24} /><h3 className="font-black uppercase tracking-widest text-sm">النظرة المستقبلية</h3></div>
                    <p className="text-slate-200 font-amiri text-2xl leading-relaxed italic">"{briefing.outlook}"</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                    <ShieldCheck size={24} className="text-emerald-500" />
                    <div className="text-[10px] text-slate-500 font-bold leading-tight uppercase">تم التحقق من دقة التحليل بواسطة محرك NASHRA الذكي</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-center max-w-md mx-auto">{error}</div>}
        </div>
      </div>
      {briefing && <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title={briefing.title} url={window.location.href} />}
    </div>
  );
};

export default SmartAnalyst;
