
import React from 'react';
import { TrendingUp, Headphones, PlayCircle } from 'lucide-react';
import { Article } from '../types';

interface SidebarProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ articles, onArticleClick }) => {
  const popularArticles = articles.slice(0, 5);

  return (
    <div className="lg:col-span-4 space-y-14">
      {/* Podcast Section */}
      <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <Headphones className="mb-6" size={40} />
          <h3 className="text-2xl font-black mb-3">بودكاست NASHRA</h3>
          <p className="text-emerald-50/80 mb-6 leading-relaxed">استمع إلى أعمق التحليلات في عالم ريادة الأعمال خلال تنقلك.</p>
          <button className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-all">
            <PlayCircle size={18} /> استمع الآن
          </button>
        </div>
      </div>

      {/* Most Popular Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-32">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">الأكثر رواجاً</h3>
        </div>
        
        <div className="space-y-8">
          {popularArticles.map((article, idx) => (
            <div 
              key={article.id} 
              className="flex gap-5 group cursor-pointer items-start border-b border-slate-50 dark:border-slate-800 pb-6 last:border-0"
              onClick={() => onArticleClick(article)}
            >
              <span className="text-5xl font-black text-slate-100 dark:text-slate-800 group-hover:text-emerald-200 transition-all duration-300 leading-none">
                0{idx + 1}
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 block uppercase tracking-widest">{article.category}</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-[1.4] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 font-amiri">
                  {article.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
