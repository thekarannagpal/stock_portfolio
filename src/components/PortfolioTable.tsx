"use client";

import React, { useState, useMemo } from "react";
import { StockHolding, SectorSummary } from "@/types/portfolio";
import { formatCurrency, formatPercent, calculateSectorSummaries } from "@/utils/portfolioCalculations";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Layers, 
  ListFilter, 
  ExternalLink,
  Sparkles
} from "lucide-react";

interface PortfolioTableProps {
  holdings: StockHolding[];
  onEditHolding: (holding: StockHolding) => void;
  onDeleteHolding: (id: string) => void;
}

type SortField = 'name' | 'purchasePrice' | 'qty' | 'investment' | 'portfolioWeight' | 'cmp' | 'presentValue' | 'gainLoss' | 'peRatio';
type SortOrder = 'asc' | 'desc';

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
  holdings,
  onEditHolding,
  onDeleteHolding
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBySector, setGroupBySector] = useState(true);
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<SortField>('portfolioWeight');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedExchange, setSelectedExchange] = useState<string>('ALL');

  // Filter holdings
  const filteredHoldings = useMemo(() => {
    return holdings.filter(h => {
      const matchesSearch = 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.sector.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesExchange = selectedExchange === 'ALL' || h.exchange === selectedExchange;

      return matchesSearch && matchesExchange;
    });
  }, [holdings, searchQuery, selectedExchange]);

  // Sort holdings
  const sortedHoldings = useMemo(() => {
    return [...filteredHoldings].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredHoldings, sortField, sortOrder]);

  // Calculate sector summaries for grouped view
  const sectorSummaries = useMemo(() => {
    return calculateSectorSummaries(sortedHoldings);
  }, [sortedHoldings]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSectorExpand = (sector: string) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sector]: prev[sector] === undefined ? false : !prev[sector]
    }));
  };

  return (
    <div className="glass-panel rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
      
      {/* Controls Bar: Search, Grouping Toggle, Exchange Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock name, ticker, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Filters & Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Exchange Filter Pill */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 text-xs font-medium">
            {['ALL', 'NSE', 'BSE', 'NASDAQ'].map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExchange(ex)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedExchange === ex
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Sector Grouping Toggle */}
          <button
            onClick={() => setGroupBySector(!groupBySector)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              groupBySector
                ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{groupBySector ? "Grouped by Sector" : "Flat Table"}</span>
          </button>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors min-w-[180px]" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Particulars (Stock)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('purchasePrice')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Buy Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('qty')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Qty</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('investment')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Investment</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('portfolioWeight')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Portfolio %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">Exchange</th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('cmp')}>
                <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold">
                  <span>CMP (Yahoo)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('presentValue')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Present Value</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('gainLoss')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Gain / Loss</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => toggleSort('peRatio')}>
                <div className="flex items-center justify-end gap-1">
                  <span>P/E (Google)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-left">Latest Earnings</th>
              <th className="py-3.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
            
            {groupBySector ? (
              /* Grouped by Sector Rows */
              sectorSummaries.map((sectorSum) => {
                const isCollapsed = expandedSectors[sectorSum.sector] === false;
                const isSectorPositive = sectorSum.totalGainLoss >= 0;

                return (
                  <React.Fragment key={sectorSum.sector}>
                    
                    {/* Sector Summary Accordion Header Row */}
                    <tr 
                      onClick={() => toggleSectorExpand(sectorSum.sector)}
                      className="bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 cursor-pointer font-semibold transition-colors border-t-2 border-slate-300 dark:border-slate-700"
                    >
                      <td colSpan={3} className="py-3 px-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                          {isCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-500" /> : <ChevronDown className="w-4 h-4 text-emerald-500" />}
                          <span className="font-bold text-sm">{sectorSum.sector}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                            {sectorSum.stockCount} {sectorSum.stockCount === 1 ? "Stock" : "Stocks"}
                          </span>
                        </div>
                      </td>
                      
                      {/* Sector Aggregate Investment */}
                      <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(sectorSum.totalInvestment)}
                      </td>
                      
                      {/* Sector Portfolio Weight % */}
                      <td className="py-3 px-3 text-right font-bold text-slate-700 dark:text-slate-300">
                        {sectorSum.portfolioWeight.toFixed(2)}%
                      </td>
                      
                      <td className="py-3 px-3 text-center text-slate-400">-</td>
                      <td className="py-3 px-3 text-right text-slate-400 font-normal">Sector Summary</td>
                      
                      {/* Sector Present Value */}
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(sectorSum.totalPresentValue)}
                      </td>
                      
                      {/* Sector Total Gain / Loss */}
                      <td className={`py-3 px-3 text-right font-bold ${
                        isSectorPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        <div>{formatCurrency(sectorSum.totalGainLoss)}</div>
                        <div className="text-[10px] font-normal">{formatPercent(sectorSum.totalGainLossPercent)}</div>
                      </td>
                      
                      <td colSpan={3} className="py-3 px-3 text-slate-400 text-right font-normal text-[11px] pr-6">
                        Summary Row
                      </td>
                    </tr>

                    {/* Stock Holdings under this Sector */}
                    {!isCollapsed && sectorSum.holdings.map((h) => renderStockRow(h, onEditHolding, onDeleteHolding))}
                  </React.Fragment>
                );
              })
            ) : (
              /* Flat Table View */
              sortedHoldings.map((h) => renderStockRow(h, onEditHolding, onDeleteHolding))
            )}

            {sortedHoldings.length === 0 && (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ListFilter className="w-8 h-8 text-slate-500 stroke-[1.5]" />
                    <p className="text-sm font-medium">No stock holdings match your filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

    </div>
  );
};

function renderStockRow(
  h: StockHolding, 
  onEditHolding: (h: StockHolding) => void, 
  onDeleteHolding: (id: string) => void
) {
  const isGain = h.gainLoss >= 0;

  const priceFlashClass = 
    h.priceStatus === 'up' 
      ? 'price-flash-up' 
      : h.priceStatus === 'down' 
      ? 'price-flash-down' 
      : '';

  return (
    <tr key={h.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
      
      {/* Particulars (Stock Name & Ticker) */}
      <td className="py-3 px-4 font-medium">
        <div className="flex items-center gap-2">
          <div>
            <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {h.name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-mono bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.2 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                {h.ticker}
              </span>
              <span>•</span>
              <span className="text-slate-400">{h.sector}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Purchase Price */}
      <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
        {formatCurrency(h.purchasePrice)}
      </td>

      {/* Quantity */}
      <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-white">
        {h.qty}
      </td>

      {/* Investment (Purchase Price × Qty) */}
      <td className="py-3 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
        {formatCurrency(h.investment)}
      </td>

      {/* Portfolio Weight % */}
      <td className="py-3 px-3 text-right">
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          {h.portfolioWeight.toFixed(2)}%
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full" 
            style={{ width: `${Math.min(h.portfolioWeight * 2.5, 100)}%` }} 
          />
        </div>
      </td>

      {/* Exchange Code */}
      <td className="py-3 px-3 text-center">
        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
          h.exchange === 'NSE' 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" 
            : h.exchange === 'BSE'
            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
        }`}>
          {h.exchange}
        </span>
      </td>

      {/* CMP (Yahoo Finance) */}
      <td className={`py-3 px-3 text-right font-bold text-slate-900 dark:text-white ${priceFlashClass}`}>
        <div>{formatCurrency(h.cmp)}</div>
        {h.dayChange !== undefined && (
          <div className={`text-[10px] ${h.dayChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {h.dayChange >= 0 ? "+" : ""}{h.dayChange.toFixed(2)} ({h.dayChangePercent?.toFixed(2)}%)
          </div>
        )}
      </td>

      {/* Present Value (CMP × Qty) */}
      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
        {formatCurrency(h.presentValue)}
      </td>

      {/* Gain / Loss (Present Value - Investment) */}
      <td className={`py-3 px-3 text-right font-bold ${
        isGain 
          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" 
          : "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
      }`}>
        <div>{formatCurrency(h.gainLoss)}</div>
        <div className="text-[10px] font-normal">{formatPercent(h.gainLossPercent)}</div>
      </td>

      {/* P/E Ratio (Google Finance) */}
      <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
          {h.peRatio ? h.peRatio.toFixed(1) : "N/A"}
        </span>
      </td>

      {/* Latest Earnings (Google Finance) */}
      <td className="py-3 px-3 text-left text-slate-600 dark:text-slate-400 text-[11px] max-w-[140px] truncate">
        {h.latestEarnings}
      </td>

      {/* Action Buttons */}
      <td className="py-3 px-3 text-center">
        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditHolding(h)}
            className="p-1 rounded text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            title="Edit Holding"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteHolding(h.id)}
            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Delete Stock"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

    </tr>
  );
}
