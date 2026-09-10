# 📈 ApexPortfolio — Dynamic Portfolio Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22c55e?style=for-the-badge)](https://recharts.org/)
[![Node.js](https://img.shields.io/badge/Node.js-API-68a063?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthekarannagpal%2Fstock_portfolio)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/thekarannagpal/stock_portfolio)

A modern, high-performance **Dynamic Portfolio Dashboard** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Node.js API routes**. The dashboard provides real-time financial tracking, auto-refreshing prices from **Yahoo Finance**, valuation metrics (P/E ratios & quarterly earnings) from **Google Finance**, sector grouping accordions, and interactive data visualizations.

---

## ✨ Features

- 📊 **Comprehensive Holdings Table**:
  - Particulars (Stock Name & Symbol)
  - Purchase Price & Quantity (Qty)
  - Cost Basis Investment (`Purchase Price × Qty`)
  - Portfolio Weighting % (`(Present Value / Total Value) × 100`)
  - Stock Exchange Code (`NSE`, `BSE`, `NASDAQ`)
  - Live Current Market Price (CMP) from Yahoo Finance
  - Present Value (`CMP × Qty`)
  - Net Gain/Loss (`Present Value - Investment`) with color indicators (Emerald Green / Rose Red)
  - P/E Ratio & Latest Quarterly Earnings from Google Finance
- ⏱️ **Dynamic Real-Time Auto-Refresh (15s Loop)**:
  - Automated 15-second polling loop with a live countdown timer pill.
  - Pause/resume toggle and manual refresh trigger.
  - Subtle price flash feedback (green highlight on price increase, red highlight on price drop).
- 🏢 **Sector Grouping & Accordion Aggregations**:
  - Group stocks by sector (e.g., Financial Services, Technology, Automobile, Energy, FMCG, Healthcare).
  - Collapsible sector accordions with aggregate summary rows showing Total Sector Investment, Sector Present Value, Sector Gain/Loss, and Weight %.
- 📈 **Interactive Visual Analytics (Recharts)**:
  - **Sector Allocation Donut Chart** with custom industry color tokens and hover tooltips.
  - **Unrealized Gain / Loss Distribution Bar Chart** visualizing net returns per holding.
- ⚡ **Resilient Backend & API Strategy**:
  - Node.js API endpoints (`/api/portfolio`, `/api/stock-search`) act as secure proxies.
  - **In-Memory Server Caching (25s TTL)** to handle public rate limits gracefully.
  - Built-in resilient fallback engine to guarantee 100% dashboard uptime.
- 🛠️ **Full Portfolio Management**:
  - Add & Edit stock holdings with ticker search autocompletion.
  - Delete positions with one click.
  - Export portfolio to **JSON** or **CSV (Excel-compatible)** formats.
  - Dark & Light theme switcher.

---

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling & Design**: Tailwind CSS, Lucide React Icons, Glassmorphism design system
- **Data Visualizations**: Recharts
- **Backend / API**: Node.js API Routes (`/api/portfolio`, `/api/stock-search`)
- **HTTP Client**: Axios & Fetch API
- **Data Persistence**: Browser LocalStorage & JSON/CSV Export

---

## 📁 Project Architecture

```
Stock_portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── portfolio/
│   │   │   │   └── route.ts          # Yahoo & Google Finance live quotes + caching
│   │   │   └── stock-search/
│   │   │       └── route.ts          # Ticker autocompletion API
│   │   ├── globals.css               # Financial theme CSS variables & animations
│   │   ├── layout.tsx                # Root layout & theme configuration
│   │   └── page.tsx                  # Main dashboard page
│   ├── components/
│   │   ├── Header.tsx                # Branding, refresh countdown timer, theme toggle
│   │   ├── MetricsOverview.tsx       # Executive portfolio summary cards
│   │   ├── PortfolioTable.tsx        # Table view with sector grouping accordions
│   │   ├── AnalyticsView.tsx         # Recharts sector donut & gain/loss bar charts
│   │   ├── AddHoldingModal.tsx       # Modal for adding/editing stock positions
│   │   └── ExportImportModal.tsx     # JSON & CSV import/export modal
│   ├── data/
│   │   └── defaultHoldings.ts        # Default Indian blue-chip stock portfolio
│   ├── types/
│   │   └── portfolio.ts              # TypeScript interfaces & types
│   └── utils/
│       └── portfolioCalculations.ts  # Business logic for present value, gain/loss & weights
├── public/                           # Static assets
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18.x or higher installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thekarannagpal/stock_portfolio.git
   cd stock_portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 API Strategy & Technical Decisions

- **Unofficial APIs & Public Sources**: Public endpoints (Yahoo & Google Finance web endpoints) do not offer official free keys. Our Node.js backend handles fetching server-side, preventing CORS issues and keeping client bundles light.
- **Rate Limit Resilience**: The server uses a **25-second TTL cache** to avoid hammering public endpoints during frequent 15-second frontend refreshes. If public servers throttle requests, an integrated fallback engine provides realistic market micro-ticks while marking the feed status as resilient.
- **Security**: No API keys or scraping tokens are exposed on the client side.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
