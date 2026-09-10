"use client";

import React from "react";
import { StockHolding, SectorSummary } from "@/types/portfolio";
import { formatCurrency, formatPercent, calculateSectorSummaries } from "@/utils/portfolioCalculations";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { PieChart as PieIcon, BarChart2, TrendingUp } from "lucide-react";

interface AnalyticsViewProps {
  holdings: StockHolding[];
}

const SECTOR_COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ holdings }) => {
  const sectorSummaries = calculateSectorSummaries(holdings);

  // Data for Sector Allocation Pie Chart
  const pieData = sectorSummaries.map((sec, idx) => ({
    name: sec.sector,
    value: sec.totalPresentValue,
    weight: sec.portfolioWeight,
    color: SECTOR_COLORS[idx % SECTOR_COLORS.length]
  }));

  // Data for Stock Gain/Loss Bar Chart
  const stockBarData = holdings.map(h => ({
    name: h.name.length > 14 ? h.name.slice(0, 14) + "..." : h.name,
    gainLoss: h.gainLoss,
    gainLossPercent: h.gainLossPercent,
    investment: h.investment,
    presentValue: h.presentValue,
    isPositive: h.gainLoss >= 0
  })).sort((a, b) => b.gainLoss - a.gainLoss);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* 1. Sector Allocation Donut Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Sector Allocation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Portfolio Weight Distribution by Industry</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
                        <div className="font-bold text-sm mb-1">{data.name}</div>
                        <div>Present Value: <span className="font-semibold text-emerald-400">{formatCurrency(data.value)}</span></div>
                        <div>Portfolio Weight: <span className="font-semibold text-indigo-300">{data.weight.toFixed(2)}%</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {pieData.map((sec) => (
            <div key={sec.name} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: sec.color }} />
              <span className="text-slate-600 dark:text-slate-300 truncate font-medium">{sec.name}:</span>
              <span className="font-bold text-slate-900 dark:text-white ml-auto">{sec.weight.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Stock Gain / Loss Distribution Bar Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Unrealized Gain / Loss</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Net Return per Holding (INR)</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockBarData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
                        <div className="font-bold text-sm mb-1">{data.name}</div>
                        <div>Investment: {formatCurrency(data.investment)}</div>
                        <div>Present Value: {formatCurrency(data.presentValue)}</div>
                        <div className={`mt-1 font-bold ${data.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                          Gain/Loss: {formatCurrency(data.gainLoss)} ({formatPercent(data.gainLossPercent)})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="gainLoss" radius={[4, 4, 0, 0]}>
                {stockBarData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isPositive ? "#10b981" : "#f43f5e"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Profitable Position</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Loss Position</span>
          </div>
        </div>

      </div>

    </div>
  );
};
