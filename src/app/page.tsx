"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RawStockData, StockHolding } from "@/types/portfolio";
import { INITIAL_HOLDINGS } from "@/data/defaultHoldings";
import { calculateHoldings, calculatePortfolioMetrics } from "@/utils/portfolioCalculations";
import { Header } from "@/components/Header";
import { MetricsOverview } from "@/components/MetricsOverview";
import { PortfolioTable } from "@/components/PortfolioTable";
import { AnalyticsView } from "@/components/AnalyticsView";
import { AddHoldingModal } from "@/components/AddHoldingModal";
import { ExportImportModal } from "@/components/ExportImportModal";
import { Table, BarChart2, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import axios from "axios";

const REFRESH_INTERVAL_SECONDS = 15;

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [rawHoldings, setRawHoldings] = useState<RawStockData[]>(INITIAL_HOLDINGS);
  const [livePrices, setLivePrices] = useState<Record<string, any>>({});
  const [calculatedHoldings, setCalculatedHoldings] = useState<StockHolding[]>([]);

  // Timer & Feed Status
  const [secondsRemaining, setSecondsRemaining] = useState(REFRESH_INTERVAL_SECONDS);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isMockFeed, setIsMockFeed] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // View & Modal Controls
  const [activeTab, setActiveTab] = useState<'table' | 'analytics'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<StockHolding | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load saved holdings from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("apex_portfolio_holdings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRawHoldings(parsed);
        }
      }
    } catch (e) {
      // Use defaults
    }
  }, []);

  // Save holdings to LocalStorage
  const saveHoldings = (newHoldings: RawStockData[]) => {
    setRawHoldings(newHoldings);
    try {
      localStorage.setItem("apex_portfolio_holdings", JSON.stringify(newHoldings));
    } catch (e) {}
  };

  // Fetch Live Quotes from Yahoo & Google Finance Node API Route
  const fetchLiveQuotes = useCallback(async (force = false) => {
    if (rawHoldings.length === 0) return;

    setIsRefreshing(true);
    setApiError(null);

    try {
      const tickers = rawHoldings.map(h => h.ticker).join(",");
      const res = await axios.get(`/api/portfolio?tickers=${encodeURIComponent(tickers)}&force=${force}&_t=${Date.now()}`);
      
      if (res.data?.success && res.data?.data) {
        setLivePrices(res.data.data);
        setIsMockFeed(Boolean(res.data.isMock));
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      setApiError("Unable to fetch external live quotes. Resilient fallback engine active.");
    } finally {
      setIsRefreshing(false);
      setSecondsRemaining(REFRESH_INTERVAL_SECONDS);
    }
  }, [rawHoldings]);

  // Initial Fetch
  useEffect(() => {
    fetchLiveQuotes(true);
  }, [fetchLiveQuotes]);

  // Re-calculate holdings when rawHoldings or livePrices update
  useEffect(() => {
    setCalculatedHoldings(prev => calculateHoldings(rawHoldings, livePrices, prev));
  }, [rawHoldings, livePrices]);

  // 15-Second Dynamic Auto-Refresh Countdown Timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          fetchLiveQuotes(false);
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, fetchLiveQuotes]);

  // Portfolio Metrics Summary
  const metrics = useMemo(() => calculatePortfolioMetrics(calculatedHoldings), [calculatedHoldings]);

  // Holding Actions
  const handleSaveHolding = (newHolding: RawStockData) => {
    if (editingHolding) {
      const updated = rawHoldings.map(h => h.ticker === editingHolding.ticker ? newHolding : h);
      saveHoldings(updated);
    } else {
      // Check if ticker already exists
      const exists = rawHoldings.some(h => h.ticker === newHolding.ticker);
      if (exists) {
        const updated = rawHoldings.map(h => h.ticker === newHolding.ticker ? newHolding : h);
        saveHoldings(updated);
      } else {
        saveHoldings([...rawHoldings, newHolding]);
      }
    }
    setEditingHolding(null);
  };

  const handleDeleteHolding = (id: string) => {
    const updated = rawHoldings.filter(h => h.ticker !== id);
    saveHoldings(updated);
  };

  const handleEditHolding = (holding: StockHolding) => {
    setEditingHolding(holding);
    setIsAddModalOpen(true);
  };

  const handleResetDefault = () => {
    saveHoldings(INITIAL_HOLDINGS);
    fetchLiveQuotes(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        secondsToNextRefresh={secondsRemaining}
        autoRefreshEnabled={autoRefreshEnabled}
        setAutoRefreshEnabled={setAutoRefreshEnabled}
        onRefresh={() => fetchLiveQuotes(true)}
        isRefreshing={isRefreshing}
        onOpenAddModal={() => {
          setEditingHolding(null);
          setIsAddModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        lastUpdated={lastUpdated}
        isMockFeed={isMockFeed}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* API Error / Resilience Notification Banner */}
        {apiError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{apiError}</span>
            </div>
            <button onClick={() => fetchLiveQuotes(true)} className="font-bold underline hover:opacity-80">
              Retry API
            </button>
          </div>
        )}

        {/* Executive Summary Cards */}
        <MetricsOverview metrics={metrics} />

        {/* Navigation Tabs (Table vs Analytics View) */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'table'
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Holdings Table</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics & Recharts</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Yahoo CMP & Google P/E Data Engine</span>
          </div>
        </div>

        {/* View Component */}
        {activeTab === 'table' ? (
          <PortfolioTable
            holdings={calculatedHoldings}
            onEditHolding={handleEditHolding}
            onDeleteHolding={handleDeleteHolding}
          />
        ) : (
          <AnalyticsView holdings={calculatedHoldings} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 ApexPortfolio Dashboard. Built with Next.js 14, React, TypeScript, Tailwind & Node.js
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Yahoo Finance CMP</span>
            <span>•</span>
            <span>Google Finance P/E & Earnings</span>
            <span>•</span>
            <span>Auto Refresh 15s</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddHoldingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveHolding}
        editingHolding={editingHolding}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        rawHoldings={rawHoldings}
        onImportHoldings={saveHoldings}
        onResetDefault={handleResetDefault}
      />

    </div>
  );
}
