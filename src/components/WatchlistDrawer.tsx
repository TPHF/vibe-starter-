import React, { useState } from 'react';
import { MarketSymbol, PriceAlert } from '../types/market';
import { X, Plus, Trash2, Bell, AlertTriangle, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onDeleteAlert: (id: string) => void;
  isDark?: boolean;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  symbols,
  onSelectSymbol,
  onRemoveFromWatchlist,
  onAddToWatchlist,
  alerts,
  onAddAlert,
  onDeleteAlert,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts'>('watchlist');
  const [addTickerInput, setAddTickerInput] = useState('');
  
  // New alert form state
  const [alertSymbol, setAlertSymbol] = useState(watchlist[0] || 'NVDA');
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(150);
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertCreatedToast, setAlertCreatedToast] = useState(false);

  if (!isOpen) return null;

  const watchedItems = watchlist
    .map(sym => symbols.find(s => s.symbol === sym))
    .filter((s): s is MarketSymbol => Boolean(s));

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTickerInput.trim()) return;
    const found = symbols.find(
      s => s.symbol.toUpperCase() === addTickerInput.trim().toUpperCase()
    );
    if (found) {
      onAddToWatchlist(found.symbol);
      setAddTickerInput('');
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTargetPrice) return;
    onAddAlert({
      symbol: alertSymbol,
      targetPrice: alertTargetPrice,
      condition: alertCondition,
    });
    setAlertCreatedToast(true);
    setTimeout(() => setAlertCreatedToast(false), 3000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl flex flex-col border-l transition-all bg-[#131722] border-[#2a2e39] text-[#d1d4dc] dark:bg-[#131722] dark:border-[#2a2e39] dark:text-[#d1d4dc]">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#2a2e39] bg-[#1e222d] flex items-center justify-between">
        <div className="flex items-center gap-1 bg-black/20 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-[#2962ff] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-[#2962ff] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3 h-3" />
            Alerts ({alerts.length})
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'watchlist' ? (
        <>
          {/* Quick Add Symbol Bar */}
          <form onSubmit={handleAddTicker} className="p-3 border-b border-[#2a2e39] bg-[#131722]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add symbol (e.g. TSLA, BTCUSD)..."
                value={addTickerInput}
                onChange={(e) => setAddTickerInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[#1e222d] border border-[#2a2e39] text-white outline-hidden uppercase placeholder-slate-500"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-[#2962ff] text-white hover:bg-blue-600 transition-colors"
                title="Add to watchlist"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Watchlist Table */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]">
            {watchedItems.map((item) => {
              const isBull = item.change >= 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item.symbol)}
                  className="p-3 flex items-center justify-between hover:bg-[#1e222d] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: item.logoBg || '#2563eb' }}
                    >
                      {item.logoText || item.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors">
                        {item.symbol}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end font-mono-numbers">
                      <span className="font-semibold text-xs text-white">
                        ${item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-bold ${isBull ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isBull ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(item.symbol);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {watchedItems.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                Your watchlist is empty. Click the star icon next to any symbol to pin it here.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Alerts Tab */
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          {/* Create Alert Form */}
          <form onSubmit={handleCreateAlert} className="p-4 rounded-xl border border-[#2a2e39] bg-[#1e222d] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Create Price Alert</h4>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Select Instrument</label>
              <select
                value={alertSymbol}
                onChange={(e) => {
                  setAlertSymbol(e.target.value);
                  const s = symbols.find(x => x.symbol === e.target.value);
                  if (s) setAlertTargetPrice(Number((s.price * 1.05).toFixed(2)));
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#131722] border border-[#2a2e39] text-white outline-hidden"
              >
                {symbols.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} - {s.name} (${s.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Condition</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#131722] border border-[#2a2e39] text-white outline-hidden"
                >
                  <option value="above">Crosses Above</option>
                  <option value="below">Crosses Below</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Target Price ($)</label>
                <input
                  type="number"
                  step="any"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono-numbers bg-[#131722] border border-[#2a2e39] text-white outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#2962ff] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              Set Price Alert
            </button>

            {alertCreatedToast && (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] text-center">
                Alert created! You'll be notified when {alertSymbol} crosses ${alertTargetPrice}.
              </div>
            )}
          </form>

          {/* Active Alerts List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Alerts</h4>
            <div className="space-y-2">
              {alerts.map(al => {
                const symObj = symbols.find(s => s.symbol === al.symbol);
                const curPrice = symObj ? symObj.price : 0;
                const isTriggered = al.condition === 'above' ? curPrice >= al.targetPrice : curPrice <= al.targetPrice;

                return (
                  <div
                    key={al.id}
                    className="p-3 rounded-lg border border-[#2a2e39] bg-[#1e222d] flex items-center justify-between text-xs font-mono-numbers"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{al.symbol}</span>
                        <span className="text-[10px] text-slate-400">
                          {al.condition === 'above' ? '≥' : '≤'} ${al.targetPrice}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Current: ${curPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isTriggered ? 'bg-[#089981]/20 text-[#089981]' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isTriggered ? 'Triggered' : 'Watching'}
                      </span>
                      <button
                        onClick={() => onDeleteAlert(al.id)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {alerts.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No active price alerts. Set one above to track price triggers.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
