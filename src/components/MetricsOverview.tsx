"use client";

import React from "react";
import { PortfolioMetrics } from "@/types/portfolio";
import { formatCurrency, formatPercent } from "@/utils/portfolioCalculations";
import { Wallet, TrendingUp, TrendingDown, Layers, Award, DollarSign } from "lucide-react";

interface MetricsOverviewProps {
  metrics: PortfolioMetrics;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  const isPositive = metrics.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Present Value */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Portfolio Value
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(metrics.totalPresentValue)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Holdings:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{metrics.totalCount} Stocks</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
      </div>

      {/* 2. Total Investment */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Investment
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(metrics.totalInvestment)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Cost Basis Capital Deployed</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
      </div>

      {/* 3. Total Gain / Loss */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Overall Returns
          </span>
          <div className={`p-2 rounded-xl border ${
            isPositive 
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" 
              : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
          }`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-bold tracking-tight ${
            isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}>
            {formatCurrency(metrics.totalGainLoss)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
              isPositive 
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" 
                : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
            }`}>
              {formatPercent(metrics.totalGainLossPercent)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Unrealized P&L</span>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isPositive ? "bg-emerald-500" : "bg-rose-500"}`} />
      </div>

      {/* 4. Top Sector & Best Performer */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Top Performing Stock
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          {metrics.topGainer ? (
            <>
              <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {metrics.topGainer.name}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(metrics.topGainer.gainLossPercent)}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 truncate">{metrics.topGainer.sector}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400">No holdings</div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
      </div>

    </div>
  );
};
