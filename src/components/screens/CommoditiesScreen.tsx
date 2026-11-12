import React from 'react';
import { MarketSymbol } from '../../types/market';
import { MarketScreener } from '../MarketScreener';
import { Fuel, CircleDot, Wheat } from 'lucide-react';

interface CommoditiesScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDark?: boolean;
}

export const CommoditiesScreen: React.FC<CommoditiesScreenProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark = true,
}) => {
  const commSymbols = symbols.filter(s => s.assetClass === 'commodities');

  const futuresCurve = [
    { month: 'Spot', price: 68.45 },
    { month: 'Dec 24', price: 68.90 },
    { month: 'Jan 25', price: 69.25 },
    { month: 'Feb 25', price: 69.60 },
    { month: 'Mar 25', price: 69.80 },
    { month: 'Jun 25', price: 70.15 },
  ];

  return (
    <div className="space-y-6">
      {/* Category Spotlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Energy Complex</h4>
          </div>
          <div className="mt-3 space-y-1 font-mono-numbers text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">WTI Crude Oil</span>
              <span className="font-semibold text-slate-200">$68.45 <span className="text-[#089981]">(+1.26%)</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Brent Crude</span>
              <span className="font-semibold text-slate-200">$72.15 <span className="text-[#089981]">(+0.92%)</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Natural Gas</span>
              <span className="font-semibold text-slate-200">$2.884 <span className="text-[#089981]">(+4.49%)</span></span>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-yellow-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Precious & Industrial Metals</h4>
          </div>
          <div className="mt-3 space-y-1 font-mono-numbers text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Gold (Spot)</span>
              <span className="font-semibold text-slate-200">$2,612.40 <span className="text-[#f23645]">(-0.56%)</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Silver (Spot)</span>
              <span className="font-semibold text-slate-200">$30.85 <span className="text-[#f23645]">(-1.34%)</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">High Grade Copper</span>
              <span className="font-semibold text-slate-200">$4.152 <span className="text-[#089981]">(+0.85%)</span></span>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Wheat className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agricultural Futures</h4>
          </div>
          <div className="mt-3 space-y-1 font-mono-numbers text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Corn (CBOT)</span>
              <span className="font-semibold text-slate-200">428.50 ¢/bu <span className="text-[#089981]">(+0.41%)</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Soybeans</span>
              <span className="font-semibold text-slate-200">998.25 ¢/bu <span className="text-[#f23645]">(-0.35%)</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wheat (CBOT)</span>
              <span className="font-semibold text-slate-200">552.00 ¢/bu <span className="text-[#089981]">(+0.18%)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Futures Term Structure / Contango */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">WTI Crude Oil Term Structure</h4>
            <p className="text-[11px] text-slate-400">Market in slight Contango (Forward curve priced above spot)</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
            Contango Curve
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center font-mono-numbers">
          {futuresCurve.map((fc) => (
            <div key={fc.month} className="p-2.5 rounded-lg border border-slate-200 dark:border-[#2a2e39] bg-black/5 dark:bg-white/5">
              <span className="text-[10px] text-slate-400 block">{fc.month}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200">${fc.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Screener */}
      <MarketScreener
        symbols={commSymbols}
        onSelectSymbol={onSelectSymbol}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        initialCategory="commodities"
        isDark={isDark}
      />
    </div>
  );
};
