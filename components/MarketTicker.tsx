
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Loader2 } from 'lucide-react';
import { fetchRealtimeMarketData, MarketItem } from '../services/marketService';
import { MARKET_DATA as MOCK_DATA } from '../constants';

const MarketTicker: React.FC = () => {
  const [marketItems, setMarketItems] = useState<MarketItem[]>(MOCK_DATA);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    // Only set loading to true on first load to prevent UI jumps during refreshes
    if (marketItems.length === 0) setLoading(true);
    
    try {
      const data = await fetchRealtimeMarketData();
      if (data && data.length > 0) {
        setMarketItems(data);
      }
    } catch (error) {
      console.error("Failed to refresh market data, keeping existing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh data every 2 minutes (120,000ms)
    const interval = setInterval(loadData, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 text-white flex items-center relative z-50 overflow-hidden border-b border-white/5 h-9">
      {/* Markets Badge */}
      <div className="bg-slate-800 px-4 h-full flex items-center gap-2 z-10 shadow-[5px_0_15px_rgba(0,0,0,0.3)] relative">
        <BarChart2 size={12} className="text-emerald-400" />
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-slate-300 font-tajawal">مؤشرات حية</span>
        {loading && <Loader2 size={10} className="animate-spin text-emerald-500 ml-1" />}
      </div>

      {/* Scrolling Ticker Content */}
      <div className="flex-grow relative overflow-hidden h-full">
        <div className="animate-ticker flex gap-12 items-center absolute top-0 left-0 h-full whitespace-nowrap px-10">
          {marketItems.map((item, idx) => (
            <div key={`market-${idx}-${item.symbol}`} className="flex items-center gap-3 text-[11px] font-bold">
              <span className="text-slate-500 font-mono uppercase tracking-tighter">{item.symbol}</span>
              <span className="font-mono text-slate-200">{item.price}</span>
              <span className={`flex items-center gap-1 font-mono ${item.change.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.change.includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change}
              </span>
              <span className="text-slate-800">|</span>
            </div>
          ))}
          
          {/* Duplicate for seamless loop */}
          {marketItems.map((item, idx) => (
            <div key={`market-dup-${idx}-${item.symbol}`} className="flex items-center gap-3 text-[11px] font-bold">
              <span className="text-slate-500 font-mono uppercase tracking-tighter">{item.symbol}</span>
              <span className="font-mono text-slate-200">{item.price}</span>
              <span className={`flex items-center gap-1 font-mono ${item.change.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.change.includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change}
              </span>
              <span className="text-slate-800">|</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Gradient Overlays */}
      <div className="absolute right-[115px] top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent