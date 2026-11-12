import React from 'react';
import { Search, Moon, Sun, Bookmark, Globe } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  isDark,
  onToggleTheme,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'indices', label: 'Indices' },
    { id: 'commodities', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'news', label: 'News' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full flex items-center justify-between gap-8 px-5 py-3 border-b transition-colors ${
        isDark ? 'bg-[#131722]/95 border-[#2a2e39] text-[#d1d4dc]' : 'bg-white/95 border-slate-200 text-slate-800'
      } backdrop-blur-md`}
    >
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-hidden group"
        >
          {/* TradingView Icon Mark */}
          <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tighter">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M4 19h4v-7H4v7zm6 0h4V5h-4v14zm6 0h4v-11h-4v11z" />
            </svg>
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors whitespace-nowrap">
            TradingView <span className="font-semibold text-slate-400">Markets</span>
          </span>
        </button>
      </div>

      {/* Zone 2: Navigation Links (Single-Line Text Links) */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white py-1 relative ${
              currentTab === item.id
                ? 'text-slate-900 dark:text-white font-bold'
                : ''
            }`}
          >
            {item.label}
            {currentTab === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2962ff] rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Zone 3: Actions (Search, Watchlist, Theme Toggle) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search Command Trigger */}
        <button
          onClick={onOpenSearch}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs text-slate-400 hover:text-slate-200 transition-colors ${
            isDark
              ? 'bg-[#1e222d] border-[#2a2e39] hover:border-slate-600'
              : 'bg-slate-50 border-slate-200 hover:border-slate-400'
          }`}
          title="Search symbols (Press /)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search markets</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
            /
          </kbd>
        </button>

        {/* Watchlist Drawer Button */}
        <button
          onClick={onToggleWatchlist}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            watchlistCount > 0
              ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
              : isDark
              ? 'bg-[#1e222d] border border-[#2a2e39] text-slate-300 hover:text-white'
              : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title="Toggle Watchlist Drawer"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Watchlist</span>
          {watchlistCount > 0 && (
            <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono-numbers">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border text-slate-400 hover:text-white transition-colors ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
