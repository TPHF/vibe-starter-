import React, { useRef, useEffect, useState, useMemo } from 'react';
import { CandleData } from '../types/market';
import { Maximize2, Minimize2, Eye, EyeOff, BarChart2, TrendingUp, Sliders } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  name: string;
  candles: CandleData[];
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  isDark?: boolean;
}

type ChartType = 'candles' | 'line' | 'area';
type Timeframe = '1D' | '5D' | '1M' | '3M' | '1Y' | 'ALL';

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  name,
  candles,
  price,
  change,
  changePercent,
  currency,
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [chartType, setChartType] = useState<ChartType>('candles');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Filter candles based on timeframe
  const displayCandles = useMemo(() => {
    if (!candles || candles.length === 0) return [];
    let count = candles.length;
    if (timeframe === '1D') count = Math.min(candles.length, 12);
    else if (timeframe === '5D') count = Math.min(candles.length, 16);
    else if (timeframe === '1M') count = Math.min(candles.length, 24);
    else if (timeframe === '3M') count = Math.min(candles.length, 30);
    return candles.slice(candles.length - count);
  }, [candles, timeframe]);

  // Compute Moving Averages
  const ma20 = useMemo(() => {
    return displayCandles.map((_, idx, arr) => {
      const windowSize = 5;
      if (idx < windowSize - 1) return null;
      const slice = arr.slice(idx - windowSize + 1, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / windowSize;
    });
  }, [displayCandles]);

  const ma50 = useMemo(() => {
    return displayCandles.map((_, idx, arr) => {
      const windowSize = 10;
      if (idx < windowSize - 1) return null;
      const slice = arr.slice(idx - windowSize + 1, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / windowSize;
    });
  }, [displayCandles]);

  // Compute RSI (simplified 14-period)
  const rsiValues = useMemo(() => {
    if (displayCandles.length < 5) return [];
    const rsi: (number | null)[] = [];
    let gains = 0;
    let losses = 0;
    const period = 7;

    for (let i = 0; i < displayCandles.length; i++) {
      if (i === 0) {
        rsi.push(null);
        continue;
      }
      const diff = displayCandles[i].close - displayCandles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses -= diff;

      if (i < period) {
        rsi.push(null);
      } else {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        if (avgLoss === 0) {
          rsi.push(100);
        } else {
          const rs = avgGain / avgLoss;
          rsi.push(100 - (100 / (1 + rs)));
        }
      }
    }
    return rsi;
  }, [displayCandles]);

  // Active hover candle or last candle
  const activeCandle = hoverIndex !== null && displayCandles[hoverIndex]
    ? displayCandles[hoverIndex]
    : displayCandles[displayCandles.length - 1];

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = isDark ? '#131722' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (displayCandles.length === 0) return;

    // Layout partitions
    const paddingRight = 65; // Price scale width
    const paddingBottom = showRSI ? 90 : 30; // Time scale + RSI pane
    const chartHeight = showRSI ? height - 90 : height - 30;
    const rsiPaneTop = height - 80;
    const rsiPaneHeight = 55;
    const chartWidth = width - paddingRight;

    // Price Bounds
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    displayCandles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const priceRange = maxPrice - minPrice || 1;
    const pricePadding = priceRange * 0.08;
    const paddedMin = minPrice - pricePadding;
    const paddedMax = maxPrice + pricePadding;
    const paddedRange = paddedMax - paddedMin;

    const getX = (idx: number) => {
      return (idx + 0.5) * (chartWidth / displayCandles.length);
    };

    const getY = (val: number) => {
      return chartHeight - ((val - paddedMin) / paddedRange) * chartHeight;
    };

    // Draw Grid Lines
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;

    // Horizontal grid & price labels
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const p = paddedMin + (paddedRange / steps) * i;
      const y = getY(p);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price text on right scale
      ctx.fillStyle = isDark ? '#787b86' : '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.toFixed(currency === '%' ? 3 : 2), chartWidth + 6, y);
    }

    // Vertical grid & time labels
    const colStep = Math.max(1, Math.floor(displayCandles.length / 6));
    for (let i = 0; i < displayCandles.length; i += colStep) {
      const x = getX(i);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#787b86' : '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const dateLabel = displayCandles[i].time.slice(5); // MM-DD
      ctx.fillText(dateLabel, x, chartHeight + 8);
    }

    // Draw Volume Bars
    if (showVolume && maxVol > 0) {
      const volMaxHeight = chartHeight * 0.22;
      const barWidth = Math.max(2, (chartWidth / displayCandles.length) * 0.7);

      displayCandles.forEach((c, i) => {
        const x = getX(i);
        const vHeight = (c.volume / maxVol) * volMaxHeight;
        const y = chartHeight - vHeight;
        const isBull = c.close >= c.open;

        ctx.fillStyle = isBull
          ? (isDark ? 'rgba(8, 153, 129, 0.25)' : 'rgba(8, 153, 129, 0.2)')
          : (isDark ? 'rgba(242, 54, 69, 0.25)' : 'rgba(242, 54, 69, 0.2)');

        ctx.fillRect(x - barWidth / 2, y, barWidth, vHeight);
      });
    }

    // Draw Price: Candles, Area, or Line
    const candleWidth = Math.max(3, (chartWidth / displayCandles.length) * 0.7);

    if (chartType === 'candles') {
      displayCandles.forEach((c, i) => {
        const x = getX(i);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        const isBull = c.close >= c.open;

        const color = isBull ? '#089981' : '#f23645';

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    } else if (chartType === 'area') {
      // Area gradient
      ctx.beginPath();
      displayCandles.forEach((c, i) => {
        const x = getX(i);
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Fill area down
      const lastX = getX(displayCandles.length - 1);
      const firstX = getX(0);
      ctx.lineTo(lastX, chartHeight);
      ctx.lineTo(firstX, chartHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
      gradient.addColorStop(0, 'rgba(41, 98, 255, 0.35)');
      gradient.addColorStop(1, 'rgba(41, 98, 255, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Top line
      ctx.beginPath();
      displayCandles.forEach((c, i) => {
        const x = getX(i);
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (chartType === 'line') {
      ctx.beginPath();
      displayCandles.forEach((c, i) => {
        const x = getX(i);
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = change >= 0 ? '#089981' : '#f23645';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw Moving Averages
    if (showMA20) {
      ctx.beginPath();
      let started = false;
      ma20.forEach((val, i) => {
        if (val === null) return;
        const x = getX(i);
        const y = getY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = '#f59e0b'; // Amber MA 20
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (showMA50) {
      ctx.beginPath();
      let started = false;
      ma50.forEach((val, i) => {
        if (val === null) return;
        const x = getX(i);
        const y = getY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = '#8b5cf6'; // Violet MA 50
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw RSI Sub-pane if toggled
    if (showRSI) {
      // Divider
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, rsiPaneTop);
      ctx.lineTo(width, rsiPaneTop);
      ctx.stroke();

      // RSI Label
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)', 8, rsiPaneTop + 14);

      // Overbought / Oversold lines (70 / 30)
      const y70 = rsiPaneTop + rsiPaneHeight * 0.3;
      const y30 = rsiPaneTop + rsiPaneHeight * 0.7;

      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, y70);
      ctx.lineTo(chartWidth, y70);
      ctx.moveTo(0, y30);
      ctx.lineTo(chartWidth, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      // RSI Curve
      ctx.beginPath();
      let rsiStarted = false;
      rsiValues.forEach((val, i) => {
        if (val === null) return;
        const x = getX(i);
        const y = rsiPaneTop + rsiPaneHeight - (val / 100) * rsiPaneHeight;
        if (!rsiStarted) {
          ctx.moveTo(x, y);
          rsiStarted = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Hover Crosshair & Pointer
    if (mousePos && hoverIndex !== null && hoverIndex >= 0 && hoverIndex < displayCandles.length) {
      const hoverX = getX(hoverIndex);
      const hoverY = mousePos.y;

      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, chartHeight);
      ctx.stroke();

      // Horizontal line
      if (hoverY >= 0 && hoverY <= chartHeight) {
        ctx.beginPath();
        ctx.moveTo(0, hoverY);
        ctx.lineTo(chartWidth, hoverY);
        ctx.stroke();

        // Right scale active badge
        const priceAtY = paddedMin + ((chartHeight - hoverY) / chartHeight) * paddedRange;
        ctx.setLineDash([]);
        ctx.fillStyle = '#2962ff';
        ctx.fillRect(chartWidth + 1, hoverY - 10, paddingRight - 2, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(priceAtY.toFixed(2), chartWidth + 6, hoverY);
      }

      ctx.setLineDash([]);
    }
  }, [
    displayCandles,
    chartType,
    timeframe,
    showMA20,
    showMA50,
    showVolume,
    showRSI,
    hoverIndex,
    mousePos,
    isDark,
    ma20,
    ma50,
    rsiValues,
    currency,
    change,
  ]);

  // Handle Mouse Events for Crosshair
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartWidth = rect.width - 65;
    if (x >= 0 && x <= chartWidth && displayCandles.length > 0) {
      const idx = Math.floor((x / chartWidth) * displayCandles.length);
      const clampedIdx = Math.max(0, Math.min(displayCandles.length - 1, idx));
      setHoverIndex(clampedIdx);
      setMousePos({ x, y });
    } else {
      setHoverIndex(null);
      setMousePos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full rounded-xl border overflow-hidden transition-colors ${
        isDark
          ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
          : 'bg-white border-slate-200 text-slate-800'
      } ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
    >
      {/* Chart Top Control Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b text-xs ${
          isDark ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-slate-200 bg-slate-50'
        }`}
      >
        {/* Left: Symbol & OHLC info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">{symbol}</span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">·</span>
            <span className="hidden sm:inline text-xs text-slate-400 truncate max-w-[120px]">{name}</span>
          </div>

          {/* OHLC Bar */}
          {activeCandle && (
            <div className="hidden lg:flex items-center gap-2 font-mono-numbers text-[11px] text-slate-400">
              <span>O: <span className={isDark ? 'text-white' : 'text-slate-900'}>{activeCandle.open.toFixed(2)}</span></span>
              <span>H: <span className={isDark ? 'text-white' : 'text-slate-900'}>{activeCandle.high.toFixed(2)}</span></span>
              <span>L: <span className={isDark ? 'text-white' : 'text-slate-900'}>{activeCandle.low.toFixed(2)}</span></span>
              <span>C: <span className={activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle.close.toFixed(2)}</span></span>
              <span>Vol: <span className={isDark ? 'text-white' : 'text-slate-900'}>{(activeCandle.volume / 1000000).toFixed(2)}M</span></span>
            </div>
          )}
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2">
          {/* Timeframe buttons */}
          <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-md p-0.5">
            {(['1D', '5D', '1M', '3M', '1Y', 'ALL'] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  timeframe === tf
                    ? isDark
                      ? 'bg-[#2962ff] text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Chart Style Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setChartType('candles')}
              title="Candlestick Chart"
              className={`p-1.5 rounded transition-colors ${
                chartType === 'candles'
                  ? 'bg-blue-600/20 text-[#2962ff]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              title="Area Chart"
              className={`p-1.5 rounded transition-colors ${
                chartType === 'area'
                  ? 'bg-blue-600/20 text-[#2962ff]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Indicator toggles */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setShowMA20(!showMA20)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono-numbers font-medium transition-colors ${
                showMA20 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 line-through'
              }`}
            >
              MA20
            </button>
            <button
              onClick={() => setShowMA50(!showMA50)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono-numbers font-medium transition-colors ${
                showMA50 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-500 line-through'
              }`}
            >
              MA50
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono-numbers font-medium transition-colors ${
                showRSI ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-slate-500 line-through'
              }`}
            >
              RSI
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chart'}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1' : 'h-[360px] sm:h-[420px]'}`}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Legend Overlay */}
        <div className="absolute top-3 left-4 pointer-events-none flex flex-col gap-1 text-[11px] font-mono-numbers">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{price.toFixed(currency === '%' ? 3 : 2)}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                change >= 0 ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
              }`}
            >
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[10px] mt-0.5">
            {showMA20 && <span className="text-amber-400">MA 20: {ma20[ma20.length - 1]?.toFixed(2) ?? '--'}</span>}
            {showMA50 && <span className="text-purple-400">MA 50: {ma50[ma50.length - 1]?.toFixed(2) ?? '--'}</span>}
            {showRSI && <span className="text-pink-400">RSI 14: {rsiValues[rsiValues.length - 1]?.toFixed(1) ?? '--'}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
