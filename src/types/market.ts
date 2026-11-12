export type AssetClass = 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities' | 'bonds';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSymbol {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  divYield?: number;
  beta?: number;
  sector?: string;
  country?: string;
  currency: string;
  rating: TechnicalRating;
  sparkline: number[];
  candles: CandleData[];
  description: string;
  exchange: string;
  logoText?: string;
  logoBg?: string;
}

export interface SectorHeatmapItem {
  name: string;
  symbols: {
    symbol: string;
    name: string;
    marketCapNum: number; // in Billions
    changePercent: number;
    price: number;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: AssetClass | 'macro';
  relatedSymbols: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
  summary: string;
  url?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered?: boolean;
}

export interface PaperTradePosition {
  symbol: string;
  shares: number;
  avgPrice: number;
  type: 'buy' | 'short';
  timestamp: string;
}
