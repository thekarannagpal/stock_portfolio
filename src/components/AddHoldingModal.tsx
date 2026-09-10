"use client";

import React, { useState, useEffect } from "react";
import { StockHolding, RawStockData } from "@/types/portfolio";
import { X, Search, Check, PlusCircle, Save } from "lucide-react";
import axios from "axios";

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holdingData: RawStockData) => void;
  editingHolding?: StockHolding | null;
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHolding,
}) => {
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState<'NSE' | 'BSE' | 'NASDAQ' | 'NYSE'>("NSE");
  const [sector, setSector] = useState("Financial Services");
  const [purchasePrice, setPurchasePrice] = useState<number | "">(1000);
  const [qty, setQty] = useState<number | "">(10);
  const [peRatio, setPeRatio] = useState<number | "">(25.0);
  const [latestEarnings, setLatestEarnings] = useState("Q1 FY25");

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (editingHolding) {
      setTicker(editingHolding.ticker);
      setName(editingHolding.name);
      setExchange(editingHolding.exchange);
      setSector(editingHolding.sector);
      setPurchasePrice(editingHolding.purchasePrice);
      setQty(editingHolding.qty);
      setPeRatio(editingHolding.peRatio);
      setLatestEarnings(editingHolding.latestEarnings);
    } else {
      // Defaults
      setTicker("RELIANCE.NS");
      setName("Reliance Industries Ltd");
      setExchange("NSE");
      setSector("Energy & Petrochemicals");
      setPurchasePrice(2850.0);
      setQty(50);
      setPeRatio(26.8);
      setLatestEarnings("Q1 FY25 ₹17,448 Cr");
    }
  }, [editingHolding, isOpen]);

  const handleTickerSearch = async (query: string) => {
    setTicker(query);
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(`/api/stock-search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.results || []);
    } catch (err) {
      // Fallback search empty
    } finally {
      setIsSearching(false);
    }
  };

  const selectStockResult = (item: any) => {
    setTicker(item.ticker);
    setName(item.name);
    setExchange(item.exchange);
    setSector(item.sector);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !name || !purchasePrice || !qty) return;

    onSave({
      ticker: ticker.toUpperCase(),
      name,
      exchange,
      sector,
      purchasePrice: Number(purchasePrice),
      qty: Number(qty),
      peRatio: Number(peRatio) || 25.0,
      latestEarnings: latestEarnings || "Q1 FY25"
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              {editingHolding ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingHolding ? "Edit Stock Holding" : "Add New Stock Holding"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enter purchase price & quantity details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Ticker Search Field */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Stock Ticker / Search Symbol
            </label>
            <div className="relative">
              <input
                type="text"
                value={ticker}
                onChange={(e) => handleTickerSearch(e.target.value)}
                placeholder="e.g. RELIANCE.NS, TCS.NS, HDFCBANK.NS"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {searchResults.map((item) => (
                  <div
                    key={item.ticker}
                    onClick={() => selectStockResult(item)}
                    className="p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.ticker} • {item.sector}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                      {item.exchange}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Stock Particulars (Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Company Name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
          </div>

          {/* Exchange & Sector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exchange Code
              </label>
              <select
                value={exchange}
                onChange={(e: any) => setExchange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="NSE">NSE (India)</option>
                <option value="BSE">BSE (India)</option>
                <option value="NASDAQ">NASDAQ (US)</option>
                <option value="NYSE">NYSE (US)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sector Category
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Financial Services">Financial Services</option>
                <option value="Technology & IT Services">Technology & IT Services</option>
                <option value="Energy & Petrochemicals">Energy & Petrochemicals</option>
                <option value="Automobile">Automobile</option>
                <option value="Consumer Goods & FMCG">Consumer Goods & FMCG</option>
                <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                <option value="Infrastructure & Engineering">Infrastructure & Engineering</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Metals & Mining">Metals & Mining</option>
              </select>
            </div>
          </div>

          {/* Purchase Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Price (INR)
              </label>
              <input
                type="number"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantity (Qty)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
          </div>

          {/* P/E Ratio & Latest Earnings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                P/E Ratio (Google Finance)
              </label>
              <input
                type="number"
                step="0.1"
                value={peRatio}
                onChange={(e) => setPeRatio(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="25.0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Latest Earnings Info
              </label>
              <input
                type="text"
                value={latestEarnings}
                onChange={(e) => setLatestEarnings(e.target.value)}
                placeholder="Q1 FY25 ₹10,000 Cr"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{editingHolding ? "Update Holding" : "Add to Portfolio"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
