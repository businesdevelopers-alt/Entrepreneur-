
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, X, Rocket, Search, ChevronLeft, Play, ArrowLeft, Twitter, Linkedin, Facebook, Sun, Moon, Calendar, Filter, XCircle, Sparkles, Zap, Clock, ChevronRight } from 'lucide-react';
import { NAV_LINKS, MOCK_ARTICLES } from '../constants';
import { Article, Category } from '../types';
import { summarizeArticle } from '../services/geminiService';
import SummaryModal from './SummaryModal';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onArticleSelect: (article: Article) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onArticleSelect, isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBreakingOpen, setIsBreakingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<Category | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<'any' | 'today' | 'week' | 'month'>('any');
  
  // Search Result Summary States
  const [activeSummaryArticle, setActiveSummaryArticle] = useState<Article | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const breakingArticles = useMemo(() => MOCK_ARTICLES.filter(a => a.isBreaking), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setFormattedDate(new Intl.DateTimeFormat('ar-SA', options).format(new Date()));
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    if (isSearchOpen || isBreakingOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen, isBreakingOpen]);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fix: Added missing clearFilters function
  const clearFilters = () => {
    setSearchQuery('');
    setSearchCategory('ALL');
    setDateFilter('any');
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    clearFilters();
  };

  const handleSummarizeResult = async (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    setActiveSummaryArticle(article);
    setSummaryText(null);
    setSummaryError(null);
    setIsSummaryOpen(true);
    setSummaryLoading(true);

    try {
      const result = await summarizeArticle(article.title, article.content);
      setSummaryText(result);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'فشل توليد الملخص');
    } finally {
      setSummaryLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return MOCK_ARTICLES.filter(article => {
      const query = searchQuery.toLowerCase().trim();
      const matchesText = query === '' || 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query));

      const matchesCategory = searchCategory === 'ALL' || article.category === searchCategory;

      let matchesDate = true;
      if (dateFilter !== 'any') {
        const todayStr = "15 أكتوبر"; 
        if (dateFilter === 'today') {
          matchesDate = article.date.includes(todayStr);
        } else if (dateFilter === 'week') {
          const days = ['10', '11', '12', '13', '14', '15'];
          matchesDate = days.some(d => article.date.startsWith(d));
        } else if (dateFilter === 'month') {
          matchesDate = article.date.includes('أكتوبر');
        }
      }

      return matchesText && matchesCategory && matchesDate;
    });
  }, [searchQuery, searchCategory, dateFilter]);

  const handleSearchResultClick = (article: Article) => {
    onArticleSelect(article);
    handleSearchClose();
    setIsBreakingOpen(false);
  };

  const SocialIcons = ({ className = "", iconSize = 18 }: { className?: string; iconSize?: number }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <a href="#" className="flex items-center justify-center text-slate-400 hover:text-[#1DA1F2] transition-colors duration-200" aria-label="Twitter">
        <Twitter size={iconSize} fill="currentColor" />
      </a>
      <a href="#" className="flex items-center justify-center text-slate-400 hover:text-[#0077B5] transition-colors duration-200" aria-label="LinkedIn">
        <Linkedin size={iconSize} fill="currentColor" />
      </a>
      <a href="#" className="flex items-center justify-center text-slate-400 hover:text-[#1877F2] transition-colors duration-200" aria-label="Facebook">
        <Facebook size={iconSize} fill="currentColor" />
      </a>
    </div>
  );

  return (
    <>
      <header className="z-40 w-full relative">
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-2 hidden md:block h-10">
          <div className="container mx-auto px-4 flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>بث مباشر للأسواق</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <SocialIcons className="border-l border-slate-200 dark:border-slate-700 pl-6" iconSize={14} />
              <button 
                onClick={toggleDarkMode}
                className="flex items-center gap-2 hover:text-emerald-500 transition-colors"
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span>{isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
              </button>
            </div>
          </div>
        </div>

        <div 
          className={`sticky top-0 z-50 transition-all duration-500 ${
            scrolled 
              ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg py-2' 
              : 'bg-white dark:bg-slate-950 border-b border-transparent py-5'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => handleNavClick('home')}
              >
                <div className={`bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-emerald-200 dark:shadow-emerald-900/40 shadow-lg group-hover:scale-105 transition-all duration-300 ${scrolled ? 'w-9 h-9' : 'w-10 h-10'}`}>
                  <Rocket size={scrolled ? 20 : 22} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold text-slate-900 dark:text-white leading-none tracking-tight font-tajawal transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>Entrepreneur</span>
                  <span className={`font-bold text-emerald-600 dark:text-emerald-400 tracking-[0.2em] transition-all duration-300 ${scrolled ? 'text-[10px] mt-0' : 'text-xs mt-0.5'}`}>NASHRA</span>
                </div>
              </div>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link.value)}
                    className={`relative px-4 py-2 text-sm font-black transition-all duration-300 rounded-full ${
                      currentView === link.value 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                {/* Breaking News Toggle */}
                <button 
                  onClick={() => setIsBreakingOpen(true)}
                  className={`relative flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full font-black text-xs transition-all hover:bg-rose-100 dark:hover:bg-rose-900/30 group ${scrolled ? 'h-9' : 'h-10'}`}
                >
                  <Zap size={16} className="fill-current animate-pulse" />
                  <span>عاجل</span>
                  {breakingArticles.length > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-950 shadow-sm">
                      {breakingArticles.length}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className={`flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900 rounded-full transition-all duration-300 group/search ${scrolled ? 'w-9 h-9' : 'w-10 h-10'}`}
                  aria-label="بحث"
                >
                  <Search size={scrolled ? 20 : 22} className="group-hover/search:scale-110 transition-transform" />
                </button>
                
                <button className={`bg-slate-900 dark:bg-emerald-600 text-white px-6 rounded-full text-sm font-black hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all hover:shadow-lg active:transform active:scale-95 ${scrolled ? 'py-2' : 'py-2.5'}`}>
                  اشترك الآن
                </button>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <button 
                  onClick={() => setIsBreakingOpen(true)}
                  className="p-2 text-rose-600 dark:text-rose-400 active:bg-rose-50 rounded-full relative"
                >
                  <Zap size={22} className="fill-current animate-pulse" />
                  {breakingArticles.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[8px] font-black border border-white">
                      {breakingArticles.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800 rounded-full transition-colors"
                >
                  <Search size={22} />
                </button>
                <button 
                  className="p-2 text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800 rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 absolute top-full left-0 w-full shadow-2xl animate-fade-in z-50 overflow-hidden">
                <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-4 px-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{formattedDate}</div>
                    <button 
                      onClick={toggleDarkMode}
                      className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 shadow-sm"
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  </div>
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.value}
                      onClick={() => handleNavClick(link.value)}
                      className={`text-right px-4 py-3 rounded-xl text-base font-black transition-all ${
                        currentView === link.value 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                  <hr className="border-slate-100 dark:border-slate-800 my-4" />
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">تابعنا على</span>
                    <SocialIcons iconSize={24} />
                  </div>
                  <button className="bg-emerald-600 text-white w-full py-4 rounded-xl font-black shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform">
                    اشترك في النشرة البريدية
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Breaking News Modal */}
      {isBreakingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-fade-in overflow-hidden">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] border border-rose-500/20">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-l from-rose-500/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-900/40 animate-pulse">
                  <Zap size={28} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-tajawal">مركز الأخبار العاجلة</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></div>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">تغطية حية ومباشرة</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsBreakingOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-8 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
              <div className="space-y-6">
                {breakingArticles.length > 0 ? (
                  breakingArticles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => handleSearchResultClick(article)}
                      className="group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-600 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full uppercase tracking-wider">عاجل</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                              <Clock size={12} className="text-rose-500" />
                              منذ قليل
                            </span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight font-amiri group-hover:text-rose-600 transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs font-black text-rose-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                            <span>عرض التفاصيل</span>
                            <ArrowLeft size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <p className="font-bold">لا توجد أخبار عاجلة في الوقت الحالي</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-[3rem]">
              <button 
                onClick={() => { handleNavClick('home'); setIsBreakingOpen(false); }}
                className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all"
              >
                <span>مشاهدة جميع الأخبار</span>
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsBreakingOpen(false)}></div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 md:pt-16 bg-slate-900/60 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200 dark:border-slate-800">
            <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-6 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-4">
                <Search className="text-emerald-500 shrink-0" size={32} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مقالات، أخبار، أو مواضيع..."
                  className="flex-grow text-2xl font-black placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none text-slate-800 dark:text-white bg-transparent placeholder:font-normal text-right font-tajawal"
                />
                <button 
                  onClick={handleSearchClose}
                  className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    <Filter size={12} />
                    التصنيف
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    <button 
                      onClick={() => setSearchCategory('ALL')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap ${searchCategory === 'ALL' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-200'}`}
                    >
                      الكل
                    </button>
                    {Object.values(Category).filter(c => c !== Category.ALL).map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setSearchCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap ${searchCategory === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    <Calendar size={12} />
                    تاريخ النشر
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'any', label: 'في أي وقت' },
                      { id: 'today', label: 'اليوم' },
                      { id: 'week', label: 'هذا الأسبوع' },
                      { id: 'month', label: 'هذا الشهر' }
                    ].map((btn) => (
                      <button 
                        key={btn.id}
                        onClick={() => setDateFilter(btn.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap ${dateFilter === btn.id ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-200'}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto p-5 md:p-8 bg-slate-50/50 dark:bg-slate-900/50 flex-grow no-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  نتائج البحث ({filteredArticles.length})
                </p>
                {(searchCategory !== 'ALL' || dateFilter !== 'any' || searchQuery !== '') && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    <XCircle size={14} />
                    مسح التصفية
                  </button>
                )}
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid gap-6">
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-2xl cursor-pointer transition-all flex flex-col sm:flex-row gap-5 group"
                      onClick={() => handleSearchResultClick(article)}
                    >
                      <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative shadow-sm">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {article.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                            <div className="bg-white/90 dark:bg-slate-900/90 rounded-full p-2 shadow-sm">
                              <Play size={16} className="text-emerald-600 fill-emerald-600" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
                              {article.category}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                              <Calendar size={12} className="text-emerald-500" />
                              {article.date}
                            </span>
                          </div>
                          {/* Summarize shortcut in search results */}
                          <button 
                            onClick={(e) => handleSummarizeResult(e, article)}
                            className="p-2 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                            title="ملخص ذكي"
                          >
                            <Sparkles size={18} />
                          </button>
                        </div>
                        <h4 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 font-amiri leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-[-6px] transition-transform">
                          <span>عرض المقال</span>
                          <ArrowLeft size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 dark:text-slate-600">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="opacity-30" />
                  </div>
                  <p className="font-black text-xl mb-2">عذراً، لم نجد نتائج مطابقة</p>
                  <p className="text-sm font-medium">جرب تغيير معايير البحث أو تصفية التاريخ والتصنيف</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-none"
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={handleSearchClose}></div>
        </div>
      )}

      {/* Summary Modal for Search results */}
      <SummaryModal 
        isOpen={isSummaryOpen} 
        onClose={() => setIsSummaryOpen(false)}
        title={activeSummaryArticle?.title || ''}
        summary={summaryText}
        loading={summaryLoading}
        error={summaryError}
        onOpenArticle={() => {
          if (activeSummaryArticle) handleSearchResultClick(activeSummaryArticle);
          setIsSummaryOpen(false);
        }}
        showViewFullButton={true}
      />
    </>
  );
};

export default Header;
