import React, { useState, useMemo } from 'react';
import { MarketSymbol, AssetClass, TechnicalRating } from '../types/market';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Star, ExternalLink, SlidersHorizontal } from 'lucide-react';

interface MarketScreenerProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  initialCategory?: AssetClass | 'all';
  isDark?: boolean;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'rating';

export const MarketScreener: React.FC<MarketScreenerProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  initialCategory = 'all',
  isDark = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<AssetClass | 'all'>(initialCategory);
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const filteredSymbols = useMemo(() => {
    return symbols
      .filter((s) => {
        if (category !== 'all' && s.assetClass !== category) return false;
        if (ratingFilter !== 'all' && s.rating !== ratingFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'rating') {
          const rankMap: Record<TechnicalRating, number> = {
            'Strong Buy': 5,
            'Buy': 4,
            'Neutral': 3,
            'Sell': 2,
            'Strong Sell': 1,
          };
          valA = rankMap[a.rating] || 0;
          valB = rankMap[b.rating] || 0;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [symbols, category, ratingFilter, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Mini sparkline SVG renderer
  const renderSparkline = (sparkline: number[], isBullish: boolean) => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const w = 80;
    const h = 24;

    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * w;
        const y = h - ((val - min) / range) * (h - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isBullish ? '#089981' : '#f23645';

    return (
      <svg width={w} height={h} className="overflow-visible block">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Screener Controls Bar */}
      <div
        className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-[#2a2e39]' : 'border-slate-200'
        }`}
      >
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'indices', label: 'Indices' },
            { id: 'commodities', label: 'Commodities' },
            { id: 'bonds', label: 'Bonds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Rating Filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border transition-colors outline-hidden ${
                isDark
                  ? 'bg-[#131722] border-[#2a2e39] text-white focus:border-[#2962ff]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Rating filter dropdown */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className={`px-2.5 py-1.5 rounded-lg text-xs border outline-hidden transition-colors ${
              isDark
                ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">Rating: All</option>
            <option value="Strong Buy">Strong Buy</option>
            <option value="Buy">Buy</option>
            <option value="Neutral">Neutral</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
      </div>

      {/* Screener Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              className={`border-b font-medium text-slate-400 text-[11px] ${
                isDark ? 'border-[#2a2e39] bg-[#131722]/80' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <th className="py-3 px-4 w-10 text-center"></th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol & Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>24h Change</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right hidden md:table-cell">24h High / Low</th>
              <th
                onClick={() => handleSort('volume')}
                className="py-3 px-4 text-right hidden lg:table-cell cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('rating')}
                className="py-3 px-4 text-center hidden sm:table-cell cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Technical Rating</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center hidden xl:table-cell">Last 30 Days</th>
              <th className="py-3 px-4 text-center w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#2a2e39]">
            {filteredSymbols.map((item) => {
              const isBull = item.change >= 0;
              const inWatchlist = watchlist.includes(item.symbol);

              return (
                <tr
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item.symbol)}
                  className={`cursor-pointer transition-colors group ${
                    isDark ? 'hover:bg-[#2a2e39]/50' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Watchlist Star Toggle */}
                  <td
                    className="py-3 px-4 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.symbol);
                    }}
                  >
                    <button
                      className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          inWatchlist ? 'fill-amber-400 text-amber-400' : 'stroke-current'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Symbol & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: item.logoBg || '#2563eb' }}
                      >
                        {item.logoText || item.symbol.slice(0, 3)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {item.exchange}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px] truncate max-w-[150px] sm:max-w-[200px]">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                    {item.currency === '$' || item.currency === 'USD' ? '$' : ''}
                    {item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                    {item.currency === '%' ? '%' : ''}
                  </td>

                  {/* Change & % */}
                  <td className="py-3 px-4 text-right font-mono-numbers">
                    <div className="flex flex-col items-end">
                      <span className={`font-bold ${isBull ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isBull ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isBull ? '+' : ''}
                        {item.change.toFixed(item.price < 1 ? 4 : 2)}
                      </span>
                    </div>
                  </td>

                  {/* 24h High / Low */}
                  <td className="py-3 px-4 text-right font-mono-numbers text-slate-400 text-[11px] hidden md:table-cell">
                    <div>H: {item.high24h.toFixed(2)}</div>
                    <div>L: {item.low24h.toFixed(2)}</div>
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 text-right font-mono-numbers text-slate-400 hidden lg:table-cell">
                    {item.volume}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.rating.includes('Buy')
                          ? 'text-[#089981] bg-[#089981]/10'
                          : item.rating.includes('Sell')
                          ? 'text-[#f23645] bg-[#f23645]/10'
                          : 'text-slate-400 bg-slate-500/10'
                      }`}
                    >
                      {item.rating}
                    </span>
                  </td>

                  {/* 30D Sparkline */}
                  <td className="py-3 px-4 text-center hidden xl:table-cell">
                    <div className="flex justify-center">
                      {renderSparkline(item.sparkline, isBull)}
                    </div>
                  </td>

                  {/* Open Link */}
                  <td className="py-3 px-4 text-center">
                    <button
                      className="p-1 text-slate-400 group-hover:text-blue-500 transition-colors"
                      title="Inspect symbol"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredSymbols.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No instruments match the selected filters or search query.
          </div>
        )}
      </div>

      {/* Screener Footer Counter */}
      <div
        className={`px-4 py-2.5 border-t flex items-center justify-between text-xs text-slate-400 font-mono-numbers ${
          isDark ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <span>Showing {filteredSymbols.length} of {symbols.length} instruments</span>
        <span>Real-time quotes updating</span>
      </div>
    </div>
  );
};
