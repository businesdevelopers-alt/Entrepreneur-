
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import MarketTicker from './components/MarketTicker';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import AuthorProfile from './components/AuthorProfile';
import AuthorsView from './components/AuthorsView';
import SmartAnalyst from './components/SmartAnalyst';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { MOCK_ARTICLES, NAV_LINKS, MOCK_AUTHORS } from './constants';
import { Article, Category } from './types';
import { RefreshCcw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [masterArticles, setMasterArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('nashra_theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.replace('#', '') || 'home';
    
    if (hash.startsWith('article/')) {
      const id = hash.split('/')[1];
      const article = masterArticles.find(a => a.id === id);
      if (article) {
        setSelectedArticle(article);
        setSelectedAuthor(null);
        setCurrentView('article');
      } else {
        window.location.hash = 'home';
      }
    } else if (hash.startsWith('author/')) {
      const authorName = decodeURIComponent(hash.split('/')[1]);
      const author = MOCK_AUTHORS[authorName] || {
        name: authorName,
        role: 'كاتب مساهم',
        bio: 'كاتب مساهم في Entrepreneur NASHRA.',
        avatar: '',
        socials: {}
      };
      setSelectedAuthor(author);
      setSelectedArticle(null);
      setCurrentView('author');
    } else {
      setCurrentView(hash);
      setSelectedArticle(null);
      setSelectedAuthor(null);
    }
  }, [masterArticles]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nashra_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const filteredArticles = useMemo(() => {
    const categoryMap: Record<string, Category> = {
      'tech': Category.TECH,
      'business': Category.BUSINESS,
      'startups': Category.STARTUPS,
      'ai': Category.AI,
      'crypto': Category.CRYPTO
    };
    const category = categoryMap[currentView];
    return category ? masterArticles.filter(a => a.category === category) : masterArticles;
  }, [currentView, masterArticles]);

  const mainFeatured = useMemo(() => 
    filteredArticles.find(a => a.isFeatured) || filteredArticles[0]
  , [filteredArticles]);

  const renderContent = () => {
    try {
      if (currentView === 'analyst') return <SmartAnalyst />;
      if (currentView === 'authors') return <AuthorsView />;
      if (currentView === 'article' && selectedArticle) {
        return (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => window.location.hash = 'home'} 
            onNavigateToArticle={(a) => window.location.hash = `article/${a.id}`}
          />
        );
      }
      if (currentView === 'author' && selectedAuthor) {
        return (
          <AuthorProfile 
            author={selectedAuthor}
            onBack={() => window.location.hash = 'home'}
            onArticleClick={(a) => window.location.hash = `article/${a.id}`}
          />
        );
      }

      const featuredStories = masterArticles.filter(a => a.isFeatured).slice(0, 3);
      const feedArticles = filteredArticles.filter(a => a.id !== mainFeatured?.id).slice(0, 10);

      return (
        <main className="container mx-auto px-4 py-8">
          {mainFeatured && (
            <section className="mb-20 animate-fade-in">
              <ArticleCard 
                article={mainFeatured} 
                onClick={(a) => window.location.hash = `article/${a.id}`} 
                variant="large"
              />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-10">
                {feedArticles.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={(a) => window.location.hash = `article/${a.id}`} variant="horizontal" />
                ))}
              </div>
            </div>
            <Sidebar articles={masterArticles} onArticleClick={(a) => window.location.hash = `article/${a.id}`} />
          </div>
        </main>
      );
    } catch (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle size={48} className="text-rose-500 mb-4" />
          <h2 className="text-2xl font-black mb-2">عذراً، حدث خطأ أثناء عرض المحتوى</h2>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl">
            <RefreshCcw size={18} /> تحديث الصفحة
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-amiri transition-colors duration-300">
      <MarketTicker />
      <BreakingNewsTicker onArticleClick={(a) => window.location.hash = `article/${a.id}`} />
      <Header 
        currentView={currentView} 
        onNavigate={(v) => window.location.hash = v} 
        onArticleSelect={(a) => window.location.hash = `article/${a.id}`} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default App;
