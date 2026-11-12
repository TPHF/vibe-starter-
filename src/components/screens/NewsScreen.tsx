import React, { useState } from 'react';
import { NewsItem, AssetClass } from '../../types/market';
import { Newspaper, TrendingUp, TrendingDown, Clock, Search, Tag } from 'lucide-react';

interface NewsScreenProps {
  newsItems: NewsItem[];
  onSelectSymbol: (symbol: string) => void;
  isDark?: boolean;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({
  newsItems,
  onSelectSymbol,
  isDark = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = newsItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.relatedSymbols.some(s => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* News Controls */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs font-semibold">
          {[
            { id: 'all', label: 'All Breaking' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'macro', label: 'Central Banks & Macro' },
            { id: 'commodities', label: 'Commodities' },
            { id: 'forex', label: 'Currencies' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search news by ticker or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-hidden ${
              isDark ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              {/* Meta bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-400">{news.source}</span>
                  <span>·</span>
                  <span>{news.timeAgo}</span>
                  <span>·</span>
                  <span>{news.readTime}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    news.sentiment === 'bullish'
                      ? 'bg-[#089981]/15 text-[#089981]'
                      : news.sentiment === 'bearish'
                      ? 'bg-[#f23645]/15 text-[#f23645]'
                      : 'bg-slate-500/15 text-slate-400'
                  }`}
                >
                  {news.sentiment.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm sm:text-base leading-snug text-slate-900 dark:text-white mb-2">
                {news.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {news.summary}
              </p>
            </div>

            {/* Related Symbols */}
            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-200 dark:border-[#2a2e39]">
              <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Mentioned:
              </span>
              {news.relatedSymbols.map((sym) => (
                <button
                  key={sym}
                  onClick={() => onSelectSymbol(sym)}
                  className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white font-mono-numbers text-[11px] font-bold transition-colors"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
