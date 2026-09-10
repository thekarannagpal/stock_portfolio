"use client";

import React from "react";
import { 
  TrendingUp, 
  RefreshCw, 
  PlusCircle, 
  Sun, 
  Moon, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Pause,
  Play
} from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  secondsToNextRefresh: number;
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: (val: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  lastUpdated: string;
  isMockFeed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  secondsToNextRefresh,
  autoRefreshEnabled,
  setAutoRefreshEnabled,
  onRefresh,
  isRefreshing,
  onOpenAddModal,
  onOpenExportModal,
  lastUpdated,
  isMockFeed,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Branding & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Apex<span className="text-emerald-500 dark:text-emerald-400">Portfolio</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                PRO LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Yahoo & Google Finance Live Feed</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              {isMockFeed ? (
                <span className="flex items-center text-amber-600 dark:text-amber-400 gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> Resilient Feed
                </span>
              ) : (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> API Connected
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls & Live Timer */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          
          {/* Auto Refresh Indicator Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              title={autoRefreshEnabled ? "Pause Auto Refresh" : "Enable Auto Refresh"}
              className="mr-2 hover:text-emerald-500 transition-colors"
            >
              {autoRefreshEnabled ? (
                <Pause className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Play className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            <span className="mr-1.5">Auto:</span>
            {autoRefreshEnabled ? (
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold min-w-[28px]">
                {secondsToNextRefresh}s
              </span>
            ) : (
              <span className="text-slate-400 font-medium">Paused</span>
            )}
            {lastUpdated && (
              <span className="ml-2 pl-2 border-l border-slate-300 dark:border-slate-700 text-[11px] text-slate-400 hidden sm:inline">
                Updated {lastUpdated}
              </span>
            )}
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-sm active:scale-95 disabled:opacity-60"
            title="Fetch Fresh Quotes Now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-500" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Add Holding Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Stock</span>
          </button>

          {/* Export / Import Button */}
          <button
            onClick={onOpenExportModal}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            title="Import / Export Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

        </div>
      </div>
    </header>
  );
};
