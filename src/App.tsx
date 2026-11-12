/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MarketSymbol, PriceAlert, NewsItem } from './types/market';
import { INITIAL_SYMBOLS, NEWS_ITEMS } from './data/mockMarketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { SearchModal } from './components/SearchModal';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { CommoditiesScreen } from './components/screens/CommoditiesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { NewsScreen } from './components/screens/NewsScreen';
import { MarketScreener } from './components/MarketScreener';
import { Globe, Radio, Play, Pause, Bell, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [symbols, setSymbols] = useState<MarketSymbol[]>(INITIAL_SYMBOLS);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [alertNotification, setAlertNotification] = useState<string | null>(null);

  // Dark mode state: default true for TradingView aesthetic
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('tv_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Watchlist persistence
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_watchlist');
    return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'BTCUSD', 'SPX', 'TSLA', 'XAUUSD'];
  });

  // Alerts persistence
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('tv_alerts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'al-1',
            symbol: 'NVDA',
            targetPrice: 150.0,
            condition: 'above',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'al-2',
            symbol: 'BTCUSD',
            targetPrice: 90000.0,
            condition: 'above',
            createdAt: new Date().toISOString(),
          },
        ];
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tv_theme', 'light');
    }
  }, [isDark]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Persist alerts
  useEffect(() => {
    localStorage.setItem('tv_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Global Keyboard shortcut for search "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live price tick simulator
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setSymbols((prevSymbols) => {
        // Pick 3 random symbols to fluctuate
        const indicesToUpdate = new Set<number>();
        while (indicesToUpdate.size < 3) {
          indicesToUpdate.add(Math.floor(Math.random() * prevSymbols.length));
        }

        return prevSymbols.map((item, idx) => {
          if (!indicesToUpdate.has(idx)) return item;

          // Realistic micro change between -0.3% and +0.3%
          const pctChange = (Math.random() - 0.49) * 0.006;
          const oldPrice = item.price;
          const newPrice = Number(Math.max(0.001, oldPrice * (1 + pctChange)).toFixed(item.price < 1 ? 4 : 2));
          const netChange = Number((newPrice - (oldPrice - item.change)).toFixed(item.price < 1 ? 4 : 2));
          const changePercent = Number((((newPrice - (oldPrice - item.change)) / (oldPrice - item.change)) * 100).toFixed(2));

          // Check if this triggers any active alert
          alerts.forEach((al) => {
            if (al.symbol === item.symbol) {
              const triggered = al.condition === 'above' ? newPrice >= al.targetPrice : newPrice <= al.targetPrice;
              if (triggered && !al.triggered) {
                setAlertNotification(`ALERT TRIGGERED: ${item.symbol} reached target $${al.targetPrice}!`);
                setTimeout(() => setAlertNotification(null), 5000);
              }
            }
          });

          // Update candle last close
          const updatedCandles = [...item.candles];
          if (updatedCandles.length > 0) {
            const lastCandle = { ...updatedCandles[updatedCandles.length - 1] };
            lastCandle.close = newPrice;
            if (newPrice > lastCandle.high) lastCandle.high = newPrice;
            if (newPrice < lastCandle.low) lastCandle.low = newPrice;
            updatedCandles[updatedCandles.length - 1] = lastCandle;
          }

          return {
            ...item,
            price: newPrice,
            change: netChange,
            changePercent,
            candles: updatedCandles,
            sparkline: updatedCandles.map((c) => c.close),
          };
        });
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, alerts]);

  // Watchlist handlers
  const handleToggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  }, []);

  const handleAddToWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol]));
  }, []);

  const handleRemoveFromWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  }, []);

  // Alert handlers
  const handleAddAlert = useCallback((newAlert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const alertObj: PriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [alertObj, ...prev]);
  }, []);

  const handleDeleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Selected symbol modal data
  const selectedSymbolData = symbols.find((s) => s.symbol === selectedSymbolId) || null;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8fafc] text-slate-800'
      }`}
    >
      {/* 3-Zone Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlist.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Global Benchmarks Ticker Tape */}
      <TickerTape
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
        isDark={isDark}
      />

      {/* Alert Trigger Toast Notification */}
      {alertNotification && (
        <div className="fixed top-16 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xl animate-bounce">
          <Bell className="w-4 h-4 fill-current" />
          <span>{alertNotification}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* Sub-header Bar: Screen Title & Live Ticker Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2e39]">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize">
              {currentTab === 'overview'
                ? 'Global Financial Markets'
                : currentTab === 'indices'
                ? 'World Stock Indices'
                : currentTab === 'commodities'
                ? 'Commodities & Energy Futures'
                : `${currentTab} Market Overview`}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time quotes, technical analysis gauges, sector heatmaps, and economic indicators.
            </p>
          </div>

          {/* Controls: Live Stream Toggle & Time Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isLiveStreaming
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                  : 'border-slate-300 dark:border-slate-700 text-slate-400'
              }`}
              title={isLiveStreaming ? 'Pause live market updates' : 'Resume live market updates'}
            >
              {isLiveStreaming ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Streaming Live</span>
                  <Pause className="w-3 h-3 ml-1" />
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Paused</span>
                  <Play className="w-3 h-3 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Routing */}
        {currentTab === 'overview' && (
          <OverviewScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            newsItems={NEWS_ITEMS}
            isDark={isDark}
          />
        )}

        {currentTab === 'stocks' && (
          <StocksScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isDark={isDark}
          />
        )}

        {currentTab === 'crypto' && (
          <CryptoScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isDark={isDark}
          />
        )}

        {currentTab === 'forex' && (
          <ForexScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isDark={isDark}
          />
        )}

        {currentTab === 'indices' && (
          <div className="space-y-6">
            <MarketScreener
              symbols={symbols.filter((s) => s.assetClass === 'indices')}
              onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              initialCategory="indices"
              isDark={isDark}
            />
          </div>
        )}

        {currentTab === 'commodities' && (
          <CommoditiesScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isDark={isDark}
          />
        )}

        {currentTab === 'bonds' && (
          <BondsScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isDark={isDark}
          />
        )}

        {currentTab === 'news' && (
          <NewsScreen
            newsItems={NEWS_ITEMS}
            onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
            isDark={isDark}
          />
        )}
      </main>

      {/* Quiet Clean Footer */}
      <footer
        className={`w-full border-t py-6 px-6 text-xs transition-colors mt-12 ${
          isDark ? 'border-[#2a2e39] bg-[#131722] text-slate-500' : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">TradingView Markets</span>
            <span>·</span>
            <span>Global Financial Intelligence & Interactive Charting</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Simulated real-time financial market data</span>
            <span>·</span>
            <span>New York · London · Tokyo · Singapore</span>
          </div>
        </div>
      </footer>

      {/* Symbol Detail Modal / Drawer */}
      <SymbolDetailModal
        symbolData={selectedSymbolData}
        onClose={() => setSelectedSymbolId(null)}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
        newsItems={NEWS_ITEMS}
        isDark={isDark}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
        isDark={isDark}
      />

      {/* Watchlist & Alerts Side Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbolId(sym)}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onAddToWatchlist={handleAddToWatchlist}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onDeleteAlert={handleDeleteAlert}
        isDark={isDark}
      />
    </div>
  );
}
