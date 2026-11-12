import React from 'react';
import { MarketSymbol, EconomicEvent } from '../../types/market';
import { MarketScreener } from '../MarketScreener';
import { ECONOMIC_EVENTS } from '../../data/mockMarketData';
import { Landmark, CalendarDays, TrendingUp } from 'lucide-react';

interface BondsScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDark?: boolean;
}

export const BondsScreen: React.FC<BondsScreenProps> = ({
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark = true,
}) => {
  const bondSymbols = symbols.filter(s => s.assetClass === 'bonds');

  // US Treasury Yield Curve Points
  const yieldCurve = [
    { tenor: '3M', yield: 4.52 },
    { tenor: '6M', yield: 4.46 },
    { tenor: '1Y', yield: 4.38 },
    { tenor: '2Y', yield: 4.34 },
    { tenor: '5Y', yield: 4.31 },
    { tenor: '10Y', yield: 4.45 },
    { tenor: '30Y', yield: 4.63 },
  ];

  // Central Bank Rates
  const centralBanks = [
    { name: 'Federal Reserve (Fed)', rate: '4.50% - 4.75%', flag: '🇺🇸', nextMeeting: 'Dec 18' },
    { name: 'European Central Bank (ECB)', rate: '3.00%', flag: '🇪🇺', nextMeeting: 'Dec 12' },
    { name: 'Bank of England (BoE)', rate: '4.75%', flag: '🇬🇧', nextMeeting: 'Dec 19' },
    { name: 'Bank of Japan (BoJ)', rate: '0.25%', flag: '🇯🇵', nextMeeting: 'Dec 19' },
    { name: 'Swiss National Bank (SNB)', rate: '1.00%', flag: '🇨🇭', nextMeeting: 'Dec 12' },
    { name: 'Reserve Bank of Australia', rate: '4.35%', flag: '🇦🇺', nextMeeting: 'Dec 10' },
  ];

  return (
    <div className="space-y-6">
      {/* Yield Curve & Central Bank Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* US Yield Curve Visual */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">US Treasury Yield Curve</h4>
              <p className="text-[11px] text-slate-400">Normalizing curve with 10Y-2Y positive spread (+11 bps)</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono-numbers">
              10Y-2Y: +0.11%
            </span>
          </div>

          {/* SVG Yield Curve Graph */}
          <div className="h-44 w-full relative my-2">
            <svg viewBox="0 0 400 140" className="w-full h-full">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke={isDark ? '#2a2e39' : '#e2e8f0'} strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="400" y2="70" stroke={isDark ? '#2a2e39' : '#e2e8f0'} strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="400" y2="120" stroke={isDark ? '#2a2e39' : '#e2e8f0'} strokeDasharray="3 3" />

              {/* Curve path */}
              <polyline
                fill="none"
                stroke="#2962ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="25,40 80,55 140,75 200,85 260,92 320,60 380,25"
              />

              {/* Data points */}
              {yieldCurve.map((pt, i) => {
                const xs = [25, 80, 140, 200, 260, 320, 380];
                const ys = [40, 55, 75, 85, 92, 60, 25];
                return (
                  <g key={pt.tenor}>
                    <circle cx={xs[i]} cy={ys[i]} r="4.5" fill="#2962ff" stroke={isDark ? '#1e222d' : '#ffffff'} strokeWidth="2" />
                    <text x={xs[i]} y="136" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                      {pt.tenor}
                    </text>
                    <text x={xs[i]} y={ys[i] - 10} textAnchor="middle" fill={isDark ? '#ffffff' : '#0f172a'} fontSize="10" fontWeight="bold" fontFamily="monospace">
                      {pt.yield}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Global Central Bank Policy Rates */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Central Bank Policy Rates</h4>
            </div>
            <span className="text-[11px] text-slate-400">Current Key Rate</span>
          </div>

          <div className="space-y-2">
            {centralBanks.map((cb) => (
              <div
                key={cb.name}
                className="p-2 rounded-lg border border-slate-200 dark:border-[#2a2e39] bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-mono-numbers"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{cb.flag}</span>
                  <div>
                    <div className="font-semibold text-slate-200">{cb.name}</div>
                    <div className="text-[10px] text-slate-400">Next Decision: {cb.nextMeeting}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-blue-400">{cb.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Economic Calendar Spotlight */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Economic Events Calendar</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono-numbers">US Eastern Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-3">Event</th>
                <th className="py-2 px-3">Impact</th>
                <th className="py-2 px-3 text-right">Actual</th>
                <th className="py-2 px-3 text-right">Forecast</th>
                <th className="py-2 px-3 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono-numbers">
              {ECONOMIC_EVENTS.map((ev) => (
                <tr key={ev.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">{ev.time}</td>
                  <td className="py-2.5 px-3">
                    <span className="mr-1">{ev.flag}</span> {ev.country}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200 font-sans">{ev.event}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.importance === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ev.importance.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">{ev.actual}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{ev.forecast}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{ev.previous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screener */}
      <MarketScreener
        symbols={bondSymbols}
        onSelectSymbol={onSelectSymbol}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        initialCategory="bonds"
        isDark={isDark}
      />
    </div>
  );
};
