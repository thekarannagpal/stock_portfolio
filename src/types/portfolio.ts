export interface RawStockData {
  ticker: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  sector: string;
  purchasePrice: number;
  qty: number;
  peRatio?: number;
  latestEarnings?: string;
}

export interface StockHolding extends RawStockData {
  id: string;
  cmp: number; // Current Market Price from Yahoo Finance
  dayChange?: number;
  dayChangePercent?: number;
  peRatio: number; // Google Finance / Fallback
  latestEarnings: string; // Google Finance / Fallback
  lastUpdated: string;
  // Calculated fields
  investment: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  portfolioWeight: number;
  priceStatus?: 'up' | 'down' | 'neutral';
}

export interface SectorSummary {
  sector: string;
  stockCount: number;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  portfolioWeight: number;
  holdings: StockHolding[];
}

export interface PortfolioMetrics {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  topSector: string;
  topGainer: StockHolding | null;
  topLoser: StockHolding | null;
  totalCount: number;
}

export interface DynamicUpdateResponse {
  success: boolean;
  timestamp: string;
  isMock: boolean;
  data: Record<string, {
    cmp: number;
    dayChange?: number;
    dayChangePercent?: number;
    peRatio?: number;
    latestEarnings?: string;
  }>;
}
