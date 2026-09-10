import { RawStockData, StockHolding, SectorSummary, PortfolioMetrics } from "@/types/portfolio";

/**
 * Transforms raw holdings and live pricing updates into fully calculated StockHoldings
 */
export function calculateHoldings(
  rawList: RawStockData[],
  livePrices: Record<string, { cmp: number; dayChange?: number; dayChangePercent?: number; peRatio?: number; latestEarnings?: string }>,
  previousHoldings: StockHolding[] = []
): StockHolding[] {
  // Step 1: Calculate preliminary values to find overall portfolio present value
  const prevMap = new Map(previousHoldings.map(h => [h.ticker, h]));

  const tempItems = rawList.map(raw => {
    const live = livePrices[raw.ticker] || livePrices[raw.ticker.toUpperCase()];
    
    // Default CMP fallback logic if API is loading or fails
    const defaultCmp = raw.purchasePrice * 1.05; // Default modest baseline if completely missing
    const cmp = live?.cmp || prevMap.get(raw.ticker)?.cmp || defaultCmp;
    
    const investment = raw.purchasePrice * raw.qty;
    const presentValue = cmp * raw.qty;
    const gainLoss = presentValue - investment;
    const gainLossPercent = investment > 0 ? (gainLoss / investment) * 100 : 0;
    
    const prevCmp = prevMap.get(raw.ticker)?.cmp;
    let priceStatus: 'up' | 'down' | 'neutral' = 'neutral';
    if (prevCmp !== undefined && prevCmp !== cmp) {
      priceStatus = cmp > prevCmp ? 'up' : 'down';
    }

    return {
      ...raw,
      id: raw.ticker,
      cmp,
      dayChange: live?.dayChange ?? prevMap.get(raw.ticker)?.dayChange ?? 0,
      dayChangePercent: live?.dayChangePercent ?? prevMap.get(raw.ticker)?.dayChangePercent ?? 0,
      peRatio: live?.peRatio ?? raw.peRatio ?? 25.0,
      latestEarnings: live?.latestEarnings ?? raw.latestEarnings ?? "Q1 FY25",
      lastUpdated: new Date().toLocaleTimeString(),
      investment,
      presentValue,
      gainLoss,
      gainLossPercent,
      portfolioWeight: 0, // Will be computed after total value sum
      priceStatus
    };
  });

  const grandTotalPresentValue = tempItems.reduce((acc, item) => acc + item.presentValue, 0);

  // Step 2: Compute exact portfolio weight %
  return tempItems.map(item => ({
    ...item,
    portfolioWeight: grandTotalPresentValue > 0 ? (item.presentValue / grandTotalPresentValue) * 100 : 0
  }));
}

/**
 * Group stock holdings by Sector and aggregate summary totals
 */
export function calculateSectorSummaries(holdings: StockHolding[]): SectorSummary[] {
  const sectorMap = new Map<string, StockHolding[]>();

  holdings.forEach(item => {
    const sector = item.sector || "Uncategorized";
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, []);
    }
    sectorMap.get(sector)!.push(item);
  });

  const totalPortfolioValue = holdings.reduce((acc, h) => acc + h.presentValue, 0);

  const summaries: SectorSummary[] = [];

  sectorMap.forEach((sectorHoldings, sectorName) => {
    const totalInvestment = sectorHoldings.reduce((acc, h) => acc + h.investment, 0);
    const totalPresentValue = sectorHoldings.reduce((acc, h) => acc + h.presentValue, 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
    const portfolioWeight = totalPortfolioValue > 0 ? (totalPresentValue / totalPortfolioValue) * 100 : 0;

    summaries.push({
      sector: sectorName,
      stockCount: sectorHoldings.length,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPercent,
      portfolioWeight,
      holdings: sectorHoldings
    });
  });

  // Sort sectors by highest Present Value weight
  return summaries.sort((a, b) => b.totalPresentValue - a.totalPresentValue);
}

/**
 * Calculate overall executive metrics
 */
export function calculatePortfolioMetrics(holdings: StockHolding[]): PortfolioMetrics {
  if (holdings.length === 0) {
    return {
      totalInvestment: 0,
      totalPresentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      topSector: "N/A",
      topGainer: null,
      topLoser: null,
      totalCount: 0
    };
  }

  const totalInvestment = holdings.reduce((acc, h) => acc + h.investment, 0);
  const totalPresentValue = holdings.reduce((acc, h) => acc + h.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  const sectors = calculateSectorSummaries(holdings);
  const topSector = sectors.length > 0 ? sectors[0].sector : "N/A";

  const sortedByGain = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
  const topGainer = sortedByGain[0] || null;
  const topLoser = sortedByGain[sortedByGain.length - 1] || null;

  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercent,
    topSector,
    topGainer,
    topLoser,
    totalCount: holdings.length
  };
}

/**
 * Currency formatter for Indian Rupee (INR) or standard financial numbers
 */
export function formatCurrency(amount: number, locale: string = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatPercent(val: number): string {
  const prefix = val > 0 ? "+" : "";
  return `${prefix}${val.toFixed(2)}%`;
}
