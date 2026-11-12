import React from 'react';
import { MarketSymbol } from '../../types/market';
import { MarketScreener } from '../MarketScreener';
import { HeatmapWidget } from '../HeatmapWidget';
import { Coins, Flame, Cpu, ShieldCheck } from 'lucide-react';

interface CryptoScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDark?: boolean;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark = true,
}) => {
  const cryptoSymbols = symbols.filter(s => s.assetClass === 'crypto');

  return (
    <div className="space-y-6">
      {/* Crypto Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">Total Crypto Market Cap</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold">$3.18T</span>
            <span className="text-xs text-[#089981] font-semibold block">+3.42% 24h</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">24h Spot & Perp Volume</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold">$142.8B</span>
            <span className="text-xs text-[#089981] font-semibold block">+18.5%</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">Ethereum Gas</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold text-amber-400">18 Gwei</span>
            <span className="text-xs text-slate-400 block">~$0.42 per transfer</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <span className="text-xs text-slate-400">BTC Network Hashrate</span>
          <div className="mt-1 font-mono-numbers">
            <span className="text-lg font-bold text-blue-500">720 EH/s</span>
            <span className="text-xs text-slate-400 block">Difficulty ATH</span>
          </div>
        </div>
      </div>

      {/* Crypto Treemap Heatmap */}
      <HeatmapWidget onSelectSymbol={onSelectSymbol} isDark={isDark} />

      {/* Screener */}
      <MarketScreener
        symbols={cryptoSymbols}
        onSelectSymbol={onSelectSymbol}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        initialCategory="crypto"
        isDark={isDark}
      />
    </div>
  );
};
