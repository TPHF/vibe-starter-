import React, { useState } from 'react';
import { MarketSymbol, NewsItem } from '../../types/market';
import { TradingViewChart } from '../TradingViewChart';
import { HeatmapWidget } from '../HeatmapWidget';
import { MarketScreener } from '../MarketScreener';
import { TrendingUp, TrendingDown, Activity, Globe, Zap, Compass, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  newsItems: NewsItem[];
  isDark?: boolean;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  newsItems,
  isDark = true,
}) => {
  // Primary featured chart ticker
  const [featuredTicker, setFeaturedTicker] = useState('SPX');
  const featuredSymbol = symbols.find(s => s.symbol === featuredTicker) || symbols[0];

  // Market Movers
  const gainers = [...symbols].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const losers = [...symbols].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  const mostActive = [...symbols].filter(s => s.assetClass === 'stocks').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Global Market Pulse Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">Global Equity Cap</span>
          <div className="font-mono-numbers mt-1">
            <span className="text-base font-bold">$114.2T</span>
            <span className="text-[11px] text-[#089981] font-semibold block">+0.84%</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">24h Market Volume</span>
          <div className="font-mono-numbers mt-1">
            <span className="text-base font-bold">$286.4B</span>
            <span className="text-[11px] text-[#089981] font-semibold block">+12.4%</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">BTC Dominance</span>
          <div className="font-mono-numbers mt-1">
            <span className="text-base font-bold">58.4%</span>
            <span className="text-[11px] text-slate-400 font-semibold block">+0.4% 24h</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">Fear & Greed</span>
          <div className="font-mono-numbers mt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[#089981]">68</span>
              <span className="text-xs text-[#089981] font-semibold">Greed</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Prev Close: 64</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">VIX Volatility</span>
          <div className="font-mono-numbers mt-1">
            <span className="text-base font-bold">14.82</span>
            <span className="text-[11px] text-[#089981] font-semibold block">-4.20% (Calm)</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">US 10Y Yield</span>
          <div className="font-mono-numbers mt-1">
            <span className="text-base font-bold">4.452%</span>
            <span className="text-[11px] text-[#f23645] font-semibold block">+4.8 bps</span>
          </div>
        </div>
      </div>

      {/* Featured Big Chart Studio with Benchmark Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Market Benchmarks Studio
            </h2>
          </div>

          {/* Quick Benchmark buttons */}
          <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 rounded-lg p-0.5 text-xs">
            {['SPX', 'NDX', 'BTCUSD', 'XAUUSD', 'NVDA'].map((ticker) => (
              <button
                key={ticker}
                onClick={() => setFeaturedTicker(ticker)}
                className={`px-2.5 py-1 rounded-md font-semibold font-mono-numbers transition-colors ${
                  featuredTicker === ticker
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>

        <TradingViewChart
          symbol={featuredSymbol.symbol}
          name={featuredSymbol.name}
          candles={featuredSymbol.candles}
          price={featuredSymbol.price}
          change={featuredSymbol.change}
          changePercent={featuredSymbol.changePercent}
          currency={featuredSymbol.currency}
          isDark={isDark}
        />
      </div>

      {/* Market Movers 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Gainers */}
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#089981]/10 text-[#089981]">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Top Gainers</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-numbers">24h %</span>
          </div>

          <div className="space-y-2">
            {gainers.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: item.logoBg || '#2563eb' }}
                  >
                    {item.logoText || item.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{item.symbol}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{item.name}</div>
                  </div>
                </div>

                <div className="text-right font-mono-numbers">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    ${item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-bold text-[#089981]">
                    +{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#f23645]/10 text-[#f23645]">
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Top Losers</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-numbers">24h %</span>
          </div>

          <div className="space-y-2">
            {losers.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: item.logoBg || '#2563eb' }}
                  >
                    {item.logoText || item.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{item.symbol}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{item.name}</div>
                  </div>
                </div>

                <div className="text-right font-mono-numbers">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    ${item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-bold text-[#f23645]">
                    {item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active */}
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-blue-500/10 text-blue-500">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Most Active Volume</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-numbers">Volume</span>
          </div>

          <div className="space-y-2">
            {mostActive.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: item.logoBg || '#2563eb' }}
                  >
                    {item.logoText || item.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{item.symbol}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{item.name}</div>
                  </div>
                </div>

                <div className="text-right font-mono-numbers">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.volume}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* S&P 500 & Crypto Treemap Heatmap */}
      <HeatmapWidget onSelectSymbol={onSelectSymbol} isDark={isDark} />

      {/* Full Market Screener */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Global Market Screener
        </h2>
        <MarketScreener
          symbols={symbols}
          onSelectSymbol={onSelectSymbol}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          initialCategory="all"
          isDark={isDark}
        />
      </div>
    </div>
  );
};
