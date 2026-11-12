import React, { useState, useEffect, useRef } from 'react';
import { MarketSymbol, AssetClass } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDark?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark = true,
}) => {
  const [query, setQuery] = useState('');
  const [filterClass, setFilterClass] = useState<AssetClass | 'all'>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = symbols.filter((s) => {
    if (filterClass !== 'all' && s.assetClass !== filterClass) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Search Input Bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${isDark ? 'border-[#2a2e39]' : 'border-slate-200'}`}>
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search any symbol, company, crypto, forex..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-hidden text-sm sm:text-base font-medium placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-black/10 dark:bg-white/10 text-xs font-mono text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-xs ${
          isDark ? 'border-[#2a2e39] bg-[#131722]/50' : 'border-slate-200 bg-slate-50'
        }`}>
          {[
            { id: 'all', label: 'All' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'indices', label: 'Indices' },
            { id: 'commodities', label: 'Commodities' },
            { id: 'bonds', label: 'Bonds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterClass(cat.id as any)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterClass === cat.id
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-200 dark:divide-[#2a2e39]">
          {results.map((item) => {
            const isBull = item.change >= 0;
            const inWatchlist = watchlist.includes(item.symbol);

            return (
              <div
                key={item.symbol}
                onClick={() => {
                  onSelectSymbol(item.symbol);
                  onClose();
                }}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-[#2a2e39]/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: item.logoBg || '#2563eb' }}
                  >
                    {item.logoText || item.symbol.slice(0, 3)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.symbol}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase">
                        {item.exchange}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase">
                        {item.assetClass}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[280px]">
                      {item.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end font-mono-numbers">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      ${item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                    </span>
                    <span className={`text-[11px] font-bold ${isBull ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isBull ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.symbol);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${inWatchlist ? 'fill-amber-400 text-amber-400' : 'stroke-current'}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}

          {results.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No symbols found for "{query}". Try searching by ticker like NVDA, AAPL, or BTC.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
