"use client";

import React, { useState } from "react";
import { RawStockData } from "@/types/portfolio";
import { X, Download, Upload, RotateCcw, Copy, Check } from "lucide-react";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawHoldings: RawStockData[];
  onImportHoldings: (data: RawStockData[]) => void;
  onResetDefault: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  rawHoldings,
  onImportHoldings,
  onResetDefault,
}) => {
  const [jsonText, setJsonText] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(rawHoldings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-holdings-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["Ticker", "Name", "Exchange", "Sector", "Purchase Price", "Quantity", "P/E Ratio", "Latest Earnings"];
    const rows = rawHoldings.map(h => [
      `"${h.ticker}"`,
      `"${h.name}"`,
      `"${h.exchange}"`,
      `"${h.sector}"`,
      h.purchasePrice,
      h.qty,
      h.peRatio || 0,
      `"${h.latestEarnings || ''}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-holdings-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(rawHoldings, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJSON = () => {
    try {
      setError("");
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of holding objects");
      }
      onImportHoldings(parsed);
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Import / Export Portfolio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Backup, restore, or reset holding records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Export Section */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Export Data</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Download className="w-4 h-4" /> Download JSON
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 transition-all"
              >
                <Download className="w-4 h-4" /> Download CSV (Excel)
              </button>

              <button
                onClick={handleCopyJSON}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Import Section */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Import Portfolio JSON</h4>
            <textarea
              rows={4}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste raw holdings JSON array here..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {error && <p className="text-rose-500 text-xs mt-1 font-semibold">{error}</p>}
            <button
              onClick={handleImportJSON}
              disabled={!jsonText.trim()}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Upload className="w-4 h-4" /> Load Holdings JSON
            </button>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Reset Section */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Reset to Default Sample Holdings</h4>
              <p className="text-[11px] text-slate-500">Restore the 10 Indian blue-chip stocks dataset</p>
            </div>
            <button
              onClick={() => {
                onResetDefault();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
