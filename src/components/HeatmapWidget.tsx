import React, { useState } from 'react';
import { SP500_HEATMAP, CRYPTO_HEATMAP } from '../data/mockMarketData';
import { SectorHeatmapItem } from '../types/market';
import { Layers, Flame, Filter } from 'lucide-react';

interface HeatmapWidgetProps {
  onSelectSymbol: (symbol: string) => void;
  isDark?: boolean;
}

export const HeatmapWidget: React.FC<HeatmapWidgetProps> = ({
  onSelectSymbol,
  isDark = true,
}) => {
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [filterMode, setFilterMode] = useState<'all' | 'gainers' | 'losers'>('all');
  const [hoveredSymbol, setHoveredSymbol] = useState<{
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    marketCapNum: number;
  } | null>(null);

  const activeData: SectorHeatmapItem[] = heatmapType === 'stocks' ? SP500_HEATMAP : CRYPTO_HEATMAP;

  // Color generator based on percentage change
  const getColor = (pct: number) => {
    if (pct >= 4) return 'bg-[#089981] hover:brightness-110';
    if (pct >= 2) return 'bg-[#059669] hover:brightness-110';
    if (pct >= 0.5) return 'bg-[#047857] hover:brightness-110';
    if (pct > -0.5) return isDark ? 'bg-[#334155] hover:bg-[#475569]' : 'bg-[#64748b] hover:bg-[#475569]';
    if (pct > -2) return 'bg-[#b91c1c] hover:brightness-110';
    if (pct > -4) return 'bg-[#dc2626] hover:brightness-110';
    return 'bg-[#f23645] hover:brightness-110';
  };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Heatmap Header */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'border-[#2a2e39]' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">Market Heatmap</h3>
            <p className="text-xs text-slate-400">Tile size by market cap, colored by 24h performance</p>
          </div>
        </div>

        {/* Heatmap Controls */}
        <div className="flex items-center gap-2">
          {/* S&P 500 vs Crypto toggle */}
          <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setHeatmapType('stocks')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                heatmapType === 'stocks'
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              S&P 500
            </button>
            <button
              onClick={() => setHeatmapType('crypto')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                heatmapType === 'crypto'
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Crypto
            </button>
          </div>

          {/* Quick Filter */}
          <div className="hidden sm:flex items-center bg-black/10 dark:bg-white/5 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterMode === 'all' ? 'bg-white dark:bg-[#2a2e39] text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('gainers')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterMode === 'gainers' ? 'bg-[#089981] text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Gainers
            </button>
            <button
              onClick={() => setFilterMode('losers')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterMode === 'losers' ? 'bg-[#f23645] text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Losers
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeData.map((sector) => {
          // Filter symbols if filterMode is active
          const filteredSymbols = sector.symbols.filter(s => {
            if (filterMode === 'gainers') return s.changePercent > 0;
            if (filterMode === 'losers') return s.changePercent < 0;
            return true;
          });

          if (filteredSymbols.length === 0) return null;

          return (
            <div
              key={sector.name}
              className={`rounded-lg p-3 border flex flex-col gap-2 ${
                isDark ? 'border-[#2a2e39] bg-[#131722]/50' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              {/* Sector Name */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] truncate">
                  {sector.name}
                </span>
                <span className="text-[10px] font-mono-numbers text-slate-400">
                  {filteredSymbols.length} assets
                </span>
              </div>

              {/* Sector Tiles Container */}
              <div className="grid grid-cols-3 gap-1.5 flex-1 min-h-[160px]">
                {filteredSymbols.map((item, idx) => {
                  // Make top assets span 2 columns or rows for treemap weighting
                  const isTopItem = idx === 0 && item.marketCapNum > 1000;
                  const isSecondItem = idx === 1 && item.marketCapNum > 500;

                  return (
                    <button
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredSymbol(item)}
                      onMouseLeave={() => setHoveredSymbol(null)}
                      className={`relative flex flex-col justify-between p-2 rounded text-left transition-all duration-150 cursor-pointer text-white shadow-xs ${
                        getColor(item.changePercent)
                      } ${isTopItem ? 'col-span-2 row-span-2 p-3' : isSecondItem ? 'col-span-2' : ''}`}
                    >
                      <div className="flex items-baseline justify-between w-full">
                        <span className={`font-bold tracking-tight ${isTopItem ? 'text-base' : 'text-xs'}`}>
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-mono-numbers opacity-80">
                          ${item.marketCapNum >= 1000 ? `${(item.marketCapNum / 1000).toFixed(1)}T` : `${item.marketCapNum}B`}
                        </span>
                      </div>

                      <div className="mt-1 flex items-baseline justify-between w-full font-mono-numbers">
                        <span className={`font-medium ${isTopItem ? 'text-xs' : 'text-[10px]'}`}>
                          ${item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                        </span>
                        <span className={`font-bold ${isTopItem ? 'text-sm' : 'text-[11px]'}`}>
                          {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Footer Legend & Hover Inspector */}
      <div className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
        isDark ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-slate-200 bg-slate-50'
      }`}>
        {/* Active hovered item info */}
        {hoveredSymbol ? (
          <div className="flex items-center gap-3 font-mono-numbers">
            <span className="font-bold text-sm text-blue-500">{hoveredSymbol.symbol}</span>
            <span className="text-slate-400">{hoveredSymbol.name}</span>
            <span>${hoveredSymbol.price.toFixed(2)}</span>
            <span className={hoveredSymbol.changePercent >= 0 ? 'text-[#089981] font-bold' : 'text-[#f23645] font-bold'}>
              {hoveredSymbol.changePercent >= 0 ? '+' : ''}{hoveredSymbol.changePercent.toFixed(2)}%
            </span>
            <span className="text-slate-400 text-[11px]">
              Market Cap: ${hoveredSymbol.marketCapNum >= 1000 ? `${(hoveredSymbol.marketCapNum / 1000).toFixed(2)}T` : `${hoveredSymbol.marketCapNum}B`}
            </span>
          </div>
        ) : (
          <span className="text-slate-400">Click any block to open full interactive chart & financials</span>
        )}

        {/* Color scale legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono-numbers text-slate-400">
          <span>-3%</span>
          <div className="flex h-2.5 w-24 rounded-full overflow-hidden">
            <div className="bg-[#f23645] flex-1" />
            <div className="bg-[#dc2626] flex-1" />
            <div className="bg-[#b91c1c] flex-1" />
            <div className="bg-[#475569] flex-1" />
            <div className="bg-[#047857] flex-1" />
            <div className="bg-[#059669] flex-1" />
            <div className="bg-[#089981] flex-1" />
          </div>
          <span>+3%</span>
        </div>
      </div>
    </div>
  );
};
