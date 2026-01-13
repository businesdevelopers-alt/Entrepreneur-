
import React, { useMemo } from 'react';
import { Rocket, Twitter, Linkedin, Facebook, Mail, Zap, ArrowLeft } from 'lucide-react';
import { MOCK_ARTICLES } from '../constants';

const Footer: React.FC = () => {
  const latestBreaking = useMemo(() => 
    MOCK_ARTICLES.find(a => a.isBreaking), 
    []
  );

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-20 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Breaking News Section - Visually Distinct Header */}
        {latestBreaking && (
          <div className="mb-16 bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/20 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex items-center gap-6 md:gap-8 relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-rose-900/50 animate-pulse shrink-0 ring-4 ring-rose-500/20">
                <Zap size={36} fill="currentColor" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-xs font-black text-rose-400 uppercase tracking-[0.3em]">خبر عاجل الآن</span>
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></div>
                   </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white font-amiri leading-tight group-hover:text-emerald-400 transition-colors">
                  {latestBreaking.title}
                </h3>
                <p className="text-slate-400 text-base md:text-lg mt-3 line-clamp-1 max-w-3xl font-tajawal opacity-80 group-hover:opacity-100 transition-opacity">
                  {latestBreaking.excerpt}
                </p>
              </div>
            </div>

            <button 
              onClick={() => window.location.hash = `article/${latestBreaking.id}`}
              className="bg-white/5 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all border border-white/10 group/btn relative z-10 shrink-0 shadow-xl active:scale-95"
            >
              <span>إقرأ التفاصيل</span>
              <ArrowLeft size={20} className="group-hover/btn:-translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Rocket size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none">Entrepreneur</span>
                <span className="text-sm font-semibold text-emerald-400 tracking-widest">NASHRA</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              منصتك الأولى للأخبار والتحليلات في عالم التقنية وريادة الأعمال في الشرق الأوسط وشمال أفريقيا.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-emerald-600 inline-block pb-1">أقسام الموقع</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">أخبار التقنية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">شركات ناشئة</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">ريادة أعمال</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">المحلل الذكي</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-emerald-600 inline-block pb-1">معلومات</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">عن نشـرة</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">فريق العمل</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">أعلن معنا</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">اتصل بنا</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-emerald-600 inline-block pb-1">النشرة البريدية</h3>
            <p className="text-slate-400 text-sm mb-4">اشترك ليصلك ملخص أسبوعي بأهم الأخبار.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-emerald-500 text-right placeholder:text-slate-500"
              />
              <button className="bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Mail size={18} />
                اشتراك
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>© 2024 Entrepreneur NASHRA. جميع الحقوق محفوظة.</p>
          <p>صنع بكل حب و ☕</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
