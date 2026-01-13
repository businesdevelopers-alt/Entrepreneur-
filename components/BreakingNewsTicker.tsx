
import React, { useMemo } from 'react';
import { MOCK_ARTICLES } from '../constants';
import { Zap, ChevronLeft } from 'lucide-react';
import { Article } from '../types';

interface BreakingNewsTickerProps {
  onArticleClick: (article: Article) => void;
}

const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ onArticleClick }) => {
  const breakingNews = useMemo(() => 
    MOCK_ARTICLES.filter(article => article.isBreaking),
    []
  );

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-rose-600 dark:bg-rose-900 text-white flex items-center relative z-[45] overflow-hidden h-9 shadow-md">
      {/* Fixed Badge */}
      <div className="bg-white text-rose-600 px-4 h-full flex items-center gap-2 z-20 shadow-[5px_0_15px_rgba(0,0,0,0.1)] relative">
        <Zap size={14} className="fill-current animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap font-tajawal">عاجل الآن</span>
      </div>

      {/* Ticker Content */}
      <div className="flex-grow relative overflow-hidden h-full">
        <div className="animate-ticker flex gap-20 items-center absolute top-0 left-0 h-full whitespace-nowrap px-10 hover:[animation-play-state:paused] cursor-pointer">
          {breakingNews.map((news) => (
            <div 
              key={`breaking-${news.id}`} 
              onClick={() => onArticleClick(news)}
              className="flex items-center gap-4 text-xs font-black group transition-colors"
            >
              <span className="opacity-60 text-[10px] font-tajawal">{news.date}</span>
              <span className="text-white group-hover:underline font-tajawal flex items-center gap-2">
                {news.title}
                <ChevronLeft size={14} className="group-hover:translate-x-[-2px] transition-transform" />
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300/40"></div>
            </div>
          ))}
          
          {/* Seamless Loop Duplicates */}
          {breakingNews.map((news) => (
            <div 
              key={`breaking-dup-${news.id}`} 
              onClick={() => onArticleClick(news)}
              className="flex items-center gap-4 text-xs font-black group transition-colors"
            >
              <span className="opacity-60 text-[10px] font-tajawal">{news.date}</span>
              <span className="text-white group-hover:underline font-tajawal flex items-center gap-2">
                {news.title}
                <ChevronLeft size={14} className="group-hover:translate-x-[-2px] transition-transform" />
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300/40"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Gradients */}
      <div className="absolute right-[110px] top-0 bottom-0 w-16 bg-gradient-to-l from-rose-600 dark:from-rose-900 to-transparent pointer-events-none z-[15]"></div>
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-rose-600 dark:from-rose-900 to-transparent pointer-events-none z-[15]"></div>
    </div>
  );
};

export default BreakingNewsTicker;
