
import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';
import { Calendar, User, Clock, Sparkles, Heart, AlertTriangle, Share2, ArrowLeft, Play, ChevronUp, ChevronDown, BookOpen } from 'lucide-react';
import { summarizeArticle } from '../services/geminiService';
import SummaryModal from './SummaryModal';
import ShareModal from './ShareModal';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  variant?: 'vertical' | 'horizontal' | 'compact' | 'large';
  hideRelated?: boolean;
  isReorderMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onClick, 
  variant = 'vertical', 
  hideRelated = false,
  isReorderMode = false,
  onMoveUp,
  onMoveDown
}) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const [isLiked, setIsLiked] = useState(() => {
    try {
      const saved = localStorage.getItem('nashra_liked');
      return saved ? JSON.parse(saved).includes(article.id) : false;
    } catch { return false; }
  });

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const liked = !isLiked;
    setIsLiked(liked);
    try {
      const saved = JSON.parse(localStorage.getItem('nashra_liked') || '[]');
      const newSaved = liked ? [...saved, article.id] : saved.filter((id: string) => id !== article.id);
      localStorage.setItem('nashra_liked', JSON.stringify(newSaved));
    } catch (err) {}
  };

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSummaryOpen(true);
    if (summary) return;
    setLoading(true);
    setError(null);
    try {
      const result = await summarizeArticle(article.title, article.content);
      setSummary(result);
    } catch (err) {
      setError("عذراً، تعذر توليد الملخص.");
    } finally {
      setLoading(false);
    }
  };

  const ReorderControls = () => (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-30 animate-fade-in">
      <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} className="p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-500 transition-all"><ChevronUp size={16} /></button>
      <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} className="p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-500 transition-all"><ChevronDown size={16} /></button>
    </div>
  );

  const renderContent = () => {
    if (variant === 'large') {
      return (
        <div onClick={() => onClick(article)} className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl h-[450px] md:h-[650px] bg-slate-200 dark:bg-slate-900">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          {isReorderMode && <ReorderControls />}
          <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{article.category}</span>
              {article.videoUrl && <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-md"><Play size={12} fill="white" /></div>}
            </div>
            <h1 className="text-3xl md:text-6xl font-black font-amiri leading-tight mb-4 group-hover:text-emerald-400 transition-colors">{article.title}</h1>
            <p className="text-slate-200 text-base md:text-xl line-clamp-2 max-w-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">{article.excerpt}</p>
          </div>
        </div>
      );
    }

    if (variant === 'horizontal') {
      return (
        <div onClick={() => onClick(article)} className="group flex flex-col sm:flex-row gap-6 p-4 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all cursor-pointer relative">
          <div className="w-full sm:w-1/3 h-48 sm:h-auto rounded-2xl overflow-hidden relative">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            {isReorderMode && <ReorderControls />}
          </div>
          <div className="flex-grow space-y-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full uppercase tracking-wider">{article.category}</span>
              <button onClick={handleSummarize} className="text-emerald-500 hover:scale-110 transition-transform"><Sparkles size={16} /></button>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-amiri line-clamp-2 group-hover:text-emerald-600 transition-colors">{article.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><Calendar size={12} /> {article.date}</span>
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black group-hover:-translate-x-2 transition-transform"><span>قراءة المزيد</span><ArrowLeft size={14} /></div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div onClick={() => onClick(article)} className="group flex gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{article.category}</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-600">{article.title}</h4>
          </div>
        </div>
      );
    }

    return (
      <div onClick={() => onClick(article)} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col relative">
        <div className="h-48 overflow-hidden relative">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-[9px] font-black">{article.category}</div>
          {isReorderMode && <ReorderControls />}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-amiri mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">{article.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">{article.excerpt}</p>
          <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
            <button onClick={(e) => { e.stopPropagation(); toggleLike(e); }} className={`${isLiked ? 'text-rose-500' : 'hover:text-rose-500'} transition-colors`}><Heart size={16} fill={isLiked ? "currentColor" : "none"} /></button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <SummaryModal isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} title={article.title} summary={summary} loading={loading} error={error} onOpenArticle={() => onClick(article)} showViewFullButton />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title={article.title} url={`${window.location.origin}/#article/${article.id}`} />
    </>
  );
};

export default ArticleCard;
