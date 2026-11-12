import React from 'react';
import { TechnicalRating } from '../types/market';

interface TechnicalGaugeProps {
  rating: TechnicalRating;
  symbol: string;
  isDark?: boolean;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({
  rating,
  symbol,
  isDark = true,
}) => {
  // Map rating to gauge needle rotation angle (-90deg to +90deg)
  const angleMap: Record<TechnicalRating, number> = {
    'Strong Sell': -75,
    'Sell': -35,
    'Neutral': 0,
    'Buy': 35,
    'Strong Buy': 75,
  };

  const needleAngle = angleMap[rating] ?? 0;

  // Mock oscillator and moving average summary based on rating
  const stats = React.useMemo(() => {
    switch (rating) {
      case 'Strong Buy':
        return { sell: 1, neutral: 6, buy: 19, oscRating: 'Buy', maRating: 'Strong Buy' };
      case 'Buy':
        return { sell: 3, neutral: 8, buy: 15, oscRating: 'Neutral', maRating: 'Buy' };
      case 'Neutral':
        return { sell: 9, neutral: 9, buy: 8, oscRating: 'Neutral', maRating: 'Neutral' };
      case 'Sell':
        return { sell: 14, neutral: 7, buy: 5, oscRating: 'Sell', maRating: 'Sell' };
      case 'Strong Sell':
        return { sell: 19, neutral: 5, buy: 2, oscRating: 'Strong Sell', maRating: 'Strong Sell' };
    }
  }, [rating]);

  return (
    <div
      className={`p-5 rounded-xl border flex flex-col items-center justify-between transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Rating</h3>
        <span className="text-[11px] font-mono-numbers text-slate-400">1D Timeframe</span>
      </div>

      {/* Speedometer Arc SVG */}
      <div className="relative w-[220px] h-[120px] flex items-center justify-center overflow-hidden my-2">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            {/* Color segments */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f23645" />
              <stop offset="25%" stopColor="#ff7043" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="75%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#089981" />
            </linearGradient>
          </defs>

          {/* Background arc track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={isDark ? '#2a2e39' : '#e2e8f0'}
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored arc track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Center Pivot */}
          <circle cx="100" cy="100" r="7" fill={isDark ? '#ffffff' : '#0f172a'} />

          {/* Needle */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <polygon
              points="97,100 103,100 101,25 99,25"
              fill={isDark ? '#ffffff' : '#0f172a'}
            />
          </g>
        </svg>

        {/* Labels under arc */}
        <div className="absolute bottom-1 w-full flex justify-between px-3 text-[10px] font-mono-numbers text-slate-400">
          <span>Sell</span>
          <span>Neutral</span>
          <span>Buy</span>
        </div>
      </div>

      {/* Main Rating Headline */}
      <div className="text-center my-1">
        <span
          className={`text-base font-bold tracking-tight px-3 py-1 rounded-full ${
            rating.includes('Buy')
              ? 'text-[#089981] bg-[#089981]/10'
              : rating.includes('Sell')
              ? 'text-[#f23645] bg-[#f23645]/10'
              : 'text-slate-400 bg-slate-500/10'
          }`}
        >
          {rating}
        </span>
      </div>

      {/* Breakdown Strip */}
      <div className="w-full flex items-center justify-between text-xs font-mono-numbers mt-3 pt-3 border-t border-slate-200 dark:border-[#2a2e39]">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400">Sell</span>
          <span className="font-bold text-[#f23645]">{stats.sell}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400">Neutral</span>
          <span className="font-bold text-slate-400">{stats.neutral}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400">Buy</span>
          <span className="font-bold text-[#089981]">{stats.buy}</span>
        </div>
      </div>

      {/* Oscillators vs Moving Averages Summary */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-[#2a2e39] text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">Oscillators</span>
          <span className={`font-semibold ${stats.oscRating.includes('Buy') ? 'text-[#089981]' : stats.oscRating.includes('Sell') ? 'text-[#f23645]' : 'text-slate-400'}`}>
            {stats.oscRating}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-slate-400">Moving Averages</span>
          <span className={`font-semibold ${stats.maRating.includes('Buy') ? 'text-[#089981]' : stats.maRating.includes('Sell') ? 'text-[#f23645]' : 'text-slate-400'}`}>
            {stats.maRating}
          </span>
        </div>
      </div>
    </div>
  );
};
