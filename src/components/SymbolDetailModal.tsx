import React, { useState } from 'react';
import { MarketSymbol, NewsItem } from '../types/market';
import { TradingViewChart } from './TradingViewChart';
import { TechnicalGauge } from './TechnicalGauge';
import { X, Star, ArrowUpRight, ArrowDownRight, DollarSign, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface SymbolDetailModalProps {
  symbolData: MarketSymbol | null;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  newsItems: NewsItem[];
  isDark?: boolean;
}

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  symbolData,
  onClose,
  watchlist,
  onToggleWatchlist,
  newsItems,
  isDark = true,
}) => {
  if (!symbolData) return null;

  const inWatchlist = watchlist.includes(symbolData.symbol);
  const isBull = symbolData.change >= 0;

  // Paper Trade simulation state
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);

  const totalOrderValue = tradeShares * symbolData.price;

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeSuccess(
      `Simulated ${tradeAction.toUpperCase()} order executed for ${tradeShares} shares of ${symbolData.symbol} at $${symbolData.price.toFixed(2)} ($${totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
    );
    setTimeout(() => setTradeSuccess(null), 4000);
  };

  const relatedNews = newsItems.filter(n => n.relatedSymbols.includes(symbolData.symbol));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-6xl max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all my-auto ${
          isDark ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md shrink-0"
              style={{ backgroundColor: symbolData.logoBg || '#2563eb' }}
            >
              {symbolData.logoText || symbolData.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {symbolData.symbol}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-semibold">
                  {symbolData.exchange}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 uppercase font-semibold">
                  {symbolData.assetClass}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{symbolData.name}</p>
            </div>
          </div>

          {/* Right Header: Price & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end font-mono-numbers">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {symbolData.currency === '$' || symbolData.currency === 'USD' ? '$' : ''}
                {symbolData.price < 1 ? symbolData.price.toFixed(4) : symbolData.price.toFixed(2)}
                {symbolData.currency === '%' ? '%' : ''}
              </span>
              <div className={`flex items-center gap-1 text-xs font-bold ${isBull ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isBull ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isBull ? '+' : ''}{symbolData.change.toFixed(2)}</span>
                <span>({isBull ? '+' : ''}{symbolData.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            <button
              onClick={() => onToggleWatchlist(symbolData.symbol)}
              className={`p-2 rounded-lg border transition-colors ${
                inWatchlist
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                  : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-5 h-5 ${inWatchlist ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Main Grid: Chart + Analysis Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Interactive Chart Studio */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <TradingViewChart
                symbol={symbolData.symbol}
                name={symbolData.name}
                candles={symbolData.candles}
                price={symbolData.price}
                change={symbolData.change}
                changePercent={symbolData.changePercent}
                currency={symbolData.currency}
                isDark={isDark}
              />

              {/* Symbol Profile Description */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About {symbolData.name}</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 dark:text-slate-300">
                  {symbolData.description}
                </p>
              </div>
            </div>

            {/* Right Col: Technical Gauge, Financial Metrics, Paper Trade */}
            <div className="flex flex-col gap-4">
              {/* Technical Gauge */}
              <TechnicalGauge
                rating={symbolData.rating}
                symbol={symbolData.symbol}
                isDark={isDark}
              />

              {/* Key Fundamentals Card */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Statistics</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-mono-numbers">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Market Cap</span>
                    <span className="font-semibold">{symbolData.marketCap || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">24h Volume</span>
                    <span className="font-semibold">{symbolData.volume}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">24h High</span>
                    <span className="font-semibold text-[#089981]">{symbolData.high24h.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">24h Low</span>
                    <span className="font-semibold text-[#f23645]">{symbolData.low24h.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">P/E Ratio</span>
                    <span className="font-semibold">{symbolData.peRatio ? symbolData.peRatio.toFixed(1) : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Div Yield</span>
                    <span className="font-semibold">{symbolData.divYield !== undefined ? `${symbolData.divYield}%` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Beta</span>
                    <span className="font-semibold">{symbolData.beta ? symbolData.beta.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sector</span>
                    <span className="font-semibold truncate block">{symbolData.sector || symbolData.assetClass}</span>
                  </div>
                </div>

                {/* 52W Range Bar */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#2a2e39]">
                  <div className="flex justify-between text-[11px] font-mono-numbers text-slate-400 mb-1">
                    <span>52W Low: ${(symbolData.price * 0.72).toFixed(2)}</span>
                    <span>52W High: ${(symbolData.price * 1.25).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[64%]" />
                  </div>
                </div>
              </div>

              {/* Paper Trading Panel */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                    Paper Trade Simulation
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono-numbers">Virtual Demo</span>
                </div>

                <form onSubmit={handleExecuteTrade} className="space-y-3">
                  {/* Buy / Sell selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTradeAction('buy')}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                        tradeAction === 'buy'
                          ? 'bg-[#089981] text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeAction('sell')}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                        tradeAction === 'sell'
                          ? 'bg-[#f23645] text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      SELL
                    </button>
                  </div>

                  {/* Quantity input */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Quantity / Units</span>
                      <span className="font-mono-numbers">Total: ${totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={tradeShares}
                      onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono-numbers border outline-hidden ${
                        isDark ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition-colors ${
                      tradeAction === 'buy' ? 'bg-[#089981] hover:bg-[#078570]' : 'bg-[#f23645] hover:bg-[#d92c3a]'
                    }`}
                  >
                    Place {tradeAction.toUpperCase()} Order (${symbolData.price.toFixed(2)})
                  </button>

                  {tradeSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{tradeSuccess}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Related News Section */}
          {relatedNews.length > 0 && (
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Latest News & Analysis on {symbolData.symbol}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedNews.map((news) => (
                  <div
                    key={news.id}
                    className={`p-3 rounded-lg border flex flex-col justify-between ${
                      isDark ? 'bg-[#131722]/60 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-blue-400">{news.source}</span>
                        <span>·</span>
                        <span>{news.timeAgo}</span>
                      </div>
                      <h5 className="font-semibold text-xs leading-snug hover:text-blue-500 transition-colors">
                        {news.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {news.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
