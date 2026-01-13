
import React from 'react';
import { X, Sparkles, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summary: string | null;
  loading: boolean;
  error: string | null;
  onOpenArticle: () => void;
  showViewFullButton?: boolean;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  summary, 
  loading, 
  error,
  onOpenArticle,
  showViewFullButton = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <Sparkles size={28} className="fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none font-tajawal">الملخص الذكي</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 uppercase tracking-widest">مدعوم بذكاء Gemini AI</p>
            </div>
          </div>

          <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 font-amiri leading-tight border-r-4 border-emerald-500 pr-4">
            {title}
          </h4>

          <div className="min-h-[220px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative mb-6">
                  <Loader2 size={56} className="text-emerald-500 animate-spin" />
                  <Sparkles size={20} className="absolute inset-0 m-auto text-emerald-400 opacity-50" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-black animate-pulse font-tajawal">جاري استخلاص أهم الرؤى والأفكار...</p>
              </div>
            ) : error ? (
              <div className="p-8 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl text-center border border-red-100 dark:border-red-900/30">
                <p className="font-bold mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
                >
                  حاول مرة أخرى
                </button>
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                <div className="text-slate-700 dark:text-slate-300 font-amiri text-2xl leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner italic">
                  {summary}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {showViewFullButton && !loading && !error && (
              <button 
                onClick={onOpenArticle}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 group"
              >
                <span>إقرأ المقال كاملاً</span>
                <ArrowLeft size={20} className="group-hover:translate-x-[-4px] transition-transform" />
              </button>
            )}
            <button 
              onClick={onClose}
              className={`py-4 rounded-2xl font-black transition-all ${
                !showViewFullButton || loading || error 
                ? 'w-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800' 
                : 'px-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
