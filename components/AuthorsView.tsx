
import React from 'react';
import { MOCK_AUTHORS } from '../constants';
import { Users, ArrowLeft, Twitter, Linkedin, ChevronLeft } from 'lucide-react';

const AuthorsView: React.FC = () => {
  const authorsList = Object.values(MOCK_AUTHORS);

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-6xl">
      <div className="text-center mb-16">
        <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-100 dark:border-emerald-900/50">
          <Users size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 font-tajawal">فريق التحرير والخبراء</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-amiri">
          نخبة من المتخصصين في التقنية، ريادة الأعمال، والأسواق المالية يشاركونكم خبراتهم وتحليلاتهم العميقة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authorsList.map((author) => (
          <div 
            key={author.name}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none group hover:border-emerald-500 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden mb-6 shadow-lg ring-4 ring-emerald-50 dark:ring-emerald-950/30 group-hover:scale-105 transition-transform">
                <img 
                  src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=059669&color=fff&size=128`} 
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">{author.role}</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 font-amiri group-hover:text-emerald-600 transition-colors">{author.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-amiri line-clamp-3 mb-6">
                {author.bio}
              </p>
              
              <div className="flex items-center gap-3 mb-8">
                {author.socials.twitter && (
                  <a href={author.socials.twitter} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#1DA1F2] rounded-xl transition-all">
                    <Twitter size={18} fill="currentColor" />
                  </a>
                )}
                {author.socials.linkedin && (
                  <a href={author.socials.linkedin} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#0077B5] rounded-xl transition-all">
                    <Linkedin size={18} fill="currentColor" />
                  </a>
                )}
              </div>

              <button 
                onClick={() => window.location.hash = `author/${encodeURIComponent(author.name)}`}
                className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>مشاهدة المقالات</span>
                <ChevronLeft size={16} className="group-hover/btn:translate-x-[-4px] transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorsView;
