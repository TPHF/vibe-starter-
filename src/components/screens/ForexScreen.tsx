import React from 'react';
import { MarketSymbol } from '../../types/market';
import { MarketScreener } from '../MarketScreener';
import { ArrowLeftRight, Gauge } from 'lucide-react';

interface ForexScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDark?: boolean;
}

export const ForexScreen: React.FC<ForexScreenProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark = true,
}) => {
  const forexSymbols = symbols.filter(s => s.assetClass === 'forex');

  // Currency Strength Meter
  const currencies = [
    { code: 'USD', strength: 8.4, delta: '+0.5', color: '#2563eb' },
    { code: 'CHF', strength: 7.2, delta: '+0.3', color: '#dc2626' },
    { code: 'JPY', strength: 6.8, delta: '+0.1', color: '#b91c1c' },
    { code: 'GBP', strength: 5.6, delta: '-0.2', color: '#1d4ed8' },
    { code: 'CAD', strength: 4.8, delta: '-0.1', color: '#ea580c' },
    { code: 'EUR', strength: 4.2, delta: '-0.4', color: '#0284c7' },
    { code: 'AUD', strength: 3.5, delta: '-0.6', color: '#059669' },
    { code: 'NZD', strength: 3.1, delta: '-0.5', color: '#0d9488' },
  ];

  // Cross Rate Matrix (simplified representative cross rates)
  const matrix = [
    { base: 'USD', EUR: '0.9412', JPY: '154.68', GBP: '0.7848', CHF: '0.8845', AUD: '1.5328' },
    { base: 'EUR', USD: '1.0624', JPY: '164.35', GBP: '0.8338', CHF: '0.9397', AUD: '1.6284' },
    { base: 'GBP', USD: '1.2742', EUR: '1.1993', JPY: '197.10', CHF: '1.1272', AUD: '1.9530' },
    { base: 'JPY', USD: '0.0064', EUR: '0.0060', GBP: '0.0050', CHF: '0.0057', AUD: '0.0099' },
  ];

  return (
    <div className="space-y-6">
      {/* Currency Strength Meter & Cross Rate Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Strength Meter */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Currency Strength Index</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono-numbers">Scale 0 - 10</span>
          </div>

          <div className="space-y-2.5">
            {currencies.map(c => (
              <div key={c.code} className="flex items-center gap-3 text-xs">
                <span className="w-10 font-bold font-mono-numbers text-slate-200">{c.code}</span>
                <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${c.strength * 10}%`, backgroundColor: c.color }}
                  />
                </div>
                <span className="w-8 text-right font-mono-numbers font-semibold text-slate-300">{c.strength.toFixed(1)}</span>
                <span className={`w-10 text-right font-mono-numbers text-[10px] ${c.delta.startsWith('+') ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {c.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Major Cross-Rate Matrix */}
        <div className={`p-4 rounded-xl border overflow-x-auto ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Cross Rates Matrix</h3>
            </div>
            <span className="text-[11px] text-slate-400">Live Quotes</span>
          </div>

          <table className="w-full text-xs font-mono-numbers text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 px-2.5">Base</th>
                <th className="py-2 px-2.5 text-right">USD</th>
                <th className="py-2 px-2.5 text-right">EUR</th>
                <th className="py-2 px-2.5 text-right">JPY</th>
                <th className="py-2 px-2.5 text-right">GBP</th>
                <th className="py-2 px-2.5 text-right">CHF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {matrix.map((row) => (
                <tr key={row.base} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-white">{row.base}</td>
                  <td className="py-2.5 px-2.5 text-right font-semibold">{row.USD || '--'}</td>
                  <td className="py-2.5 px-2.5 text-right font-semibold">{row.EUR || '--'}</td>
                  <td className="py-2.5 px-2.5 text-right font-semibold">{row.JPY || '--'}</td>
                  <td className="py-2.5 px-2.5 text-right font-semibold">{row.GBP || '--'}</td>
                  <td className="py-2.5 px-2.5 text-right font-semibold">{row.CHF || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forex Screener */}
      <MarketScreener
        symbols={forexSymbols}
        onSelectSymbol={onSelectSymbol}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        initialCategory="forex"
        isDark={isDark}
      />
    </div>
  );
};
