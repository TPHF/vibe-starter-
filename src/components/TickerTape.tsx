import React from 'react';
import { MarketSymbol } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  isDark?: boolean;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  symbols,
  onSelectSymbol,
  isDark = true,
}) => {
  // Key market benchmarks
  const tapeSymbols = [
    'SPX', 'NDX', 'DJI', 'BTCUSD', 'ETHUSD', 'US10Y', 'XAUUSD', 'USOIL', 'EURUSD', 'NVDA', 'AAPL', 'TSLA'
  ];

  const items = tapeSymbols
    .map(sym => symbols.find(s => s.symbol === sym))
    .filter((s): s is MarketSymbol => Boolean(s));

  // Render mini sparkline
  const renderMiniSpark = (sparkline: number[], isBull: boolean) => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const w = 36;
    const h = 14;

    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * w;
        const y = h - ((val - min) / range) * (h - 2) - 1;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={w} height={h} className="shrink-0 overflow-visible opacity-80">
        <polyline
          fill="none"
          stroke={isBull ? '#089981' : '#f23645'}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      className={`w-full overflow-hidden border-b transition-colors select-none ${
        isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="flex items-center gap-6 py-2 px-4 overflow-x-auto no-scrollbar">
        {items.map((item) => {
          const isBull = item.change >= 0;

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {item.symbol}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.currency === '$' || item.currency === 'USD' ? '$' : ''}
                  {item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                  {item.currency === '%' ? '%' : ''}
                </span>
              </div>

              <div className={`flex items-center text-[10px] font-bold font-mono-numbers ${isBull ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isBull ? '+' : ''}{item.changePercent.toFixed(2)}%
              </div>

              {renderMiniSpark(item.sparkline, isBull)}

              <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700 ml-1.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
