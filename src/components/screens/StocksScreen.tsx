import React from 'react';
import { MarketSymbol } from '../../types/market';
import { MarketScreener } from '../MarketScreener';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface StocksScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDark?: boolean;
}

export const StocksScreen: React.FC<StocksScreenProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark = true,
}) => {
  const stockSymbols = symbols.filter(s => s.assetClass === 'stocks');

  // Sector performance bars
  const sectors = [
    { name: 'Technology', change: 2.15, isBull: true },
    { name: 'Communication Services', change: 1.45, isBull: true },
    { name: 'Consumer Cyclical', change: 1.82, isBull: true },
    { name: 'Financial Services', change: 0.74, isBull: true },
    { name: 'Energy', change: 0.65, isBull: true },
    { name: 'Industrials', change: -0.22, isBull: false },
    { name: 'Consumer Defensive', change: -0.18, isBull: false },
    { name: 'Healthcare', change: -0.85, isBull: false },
  ];

  // Earnings calendar spotlight
  const upcomingEarnings = [
    { ticker: 'NVDA', name: 'NVIDIA Corp', date: 'Nov 20, AMC', estEPS: '$0.75', prevEPS: '$0.68' },
    { ticker: 'WMT', name: 'Walmart Inc', date: 'Nov 19, BMO', estEPS: '$0.53', prevEPS: '$0.51' },
    { ticker: 'TGT', name: 'Target Corp', date: 'Nov 20, BMO', estEPS: '$2.30', prevEPS: '$2.10' },
    { ticker: 'PANW', name: 'Palo Alto Networks', date: 'Nov 20, AMC', estEPS: '$1.48', prevEPS: '$1.38' },
  ];

  return (
    <div className="space-y-6">
      {/* Stocks KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">US Total Market Cap</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold">$58.4T</span>
            <span className="text-xs text-[#089981] font-semibold block">+1.14% Today</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">Advance / Decline</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold text-[#089981]">1.85 : 1</span>
            <span className="text-xs text-slate-400 block">320 Adv / 173 Dec</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">52-Week Highs</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold text-blue-500">42 Stocks</span>
            <span className="text-xs text-slate-400 block">8 New Lows</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">NYSE / NASDAQ Volume</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold">11.4B</span>
            <span className="text-xs text-[#089981] font-semibold block">Above 30-Day Avg</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Sector Performance & Earnings Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Performance */}
        <div
          className={`lg:col-span-2 p-4 rounded-xl border ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Sector Performance Today</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono-numbers">Weighted Performance</span>
          </div>

          <div className="space-y-2.5">
            {sectors.map((sec) => (
              <div key={sec.name} className="flex items-center gap-3 text-xs">
                <span className="w-40 font-medium truncate text-slate-300 dark:text-slate-300">
                  {sec.name}
                </span>
                <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex items-center">
                  <div
                    className={`h-full rounded-full ${sec.isBull ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                    style={{ width: `${Math.min(100, Math.abs(sec.change) * 35)}%` }}
                  />
                </div>
                <span className={`w-14 text-right font-mono-numbers font-bold ${sec.isBull ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {sec.isBull ? '+' : ''}{sec.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Calendar */}
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Earnings Spotlight</h3>
            </div>
            <span className="text-[11px] text-slate-400">This Week</span>
          </div>

          <div className="space-y-3">
            {upcomingEarnings.map((earn) => (
              <div
                key={earn.ticker}
                onClick={() => onSelectSymbol(earn.ticker)}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-[#2a2e39] bg-black/5 dark:bg-white/5 hover:border-blue-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{earn.ticker}</span>
                  <span className="text-[10px] text-slate-400 font-mono-numbers">{earn.date}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{earn.name}</div>
                <div className="flex items-center justify-between text-[10px] font-mono-numbers mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-slate-400">
                  <span>Est EPS: <strong className="text-white">{earn.estEPS}</strong></span>
                  <span>Prior EPS: {earn.prevEPS}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stocks Screener */}
      <MarketScreener
        symbols={stockSymbols}
        onSelectSymbol={onSelectSymbol}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        initialCategory="stocks"
        isDark={isDark}
      />
    </div>
  );
};
