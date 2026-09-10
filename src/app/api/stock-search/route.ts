import { NextRequest, NextResponse } from "next/server";

const COMMON_INDIAN_STOCKS = [
  { ticker: "RELIANCE.NS", name: "Reliance Industries Ltd", exchange: "NSE", sector: "Energy & Petrochemicals" },
  { ticker: "TCS.NS", name: "Tata Consultancy Services", exchange: "NSE", sector: "Technology & IT Services" },
  { ticker: "HDFCBANK.NS", name: "HDFC Bank Ltd", exchange: "NSE", sector: "Financial Services" },
  { ticker: "INFY.NS", name: "Infosys Limited", exchange: "NSE", sector: "Technology & IT Services" },
  { ticker: "ICICIBANK.NS", name: "ICICI Bank Ltd", exchange: "NSE", sector: "Financial Services" },
  { ticker: "TATAMOTORS.NS", name: "Tata Motors Ltd", exchange: "NSE", sector: "Automobile" },
  { ticker: "BHARTIARTL.NS", name: "Bharti Airtel Ltd", exchange: "NSE", sector: "Telecommunications" },
  { ticker: "ITC.NS", name: "ITC Limited", exchange: "NSE", sector: "Consumer Goods & FMCG" },
  { ticker: "SUNPHARMA.NS", name: "Sun Pharmaceutical Industries", exchange: "NSE", sector: "Healthcare & Pharma" },
  { ticker: "LT.NS", name: "Larsen & Toubro Ltd", exchange: "NSE", sector: "Infrastructure & Engineering" },
  { ticker: "SBIN.NS", name: "State Bank of India", exchange: "NSE", sector: "Financial Services" },
  { ticker: "AXISBANK.NS", name: "Axis Bank Ltd", exchange: "NSE", sector: "Financial Services" },
  { ticker: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", exchange: "NSE", sector: "Financial Services" },
  { ticker: "WIPRO.NS", name: "Wipro Limited", exchange: "NSE", sector: "Technology & IT Services" },
  { ticker: "HCLTECH.NS", name: "HCL Technologies", exchange: "NSE", sector: "Technology & IT Services" },
  { ticker: "MARUTI.NS", name: "Maruti Suzuki India", exchange: "NSE", sector: "Automobile" },
  { ticker: "BAJFINANCE.NS", name: "Bajaj Finance Ltd", exchange: "NSE", sector: "Financial Services" },
  { ticker: "ASIANPAINT.NS", name: "Asian Paints Ltd", exchange: "NSE", sector: "Consumer Goods & FMCG" },
  { ticker: "TITAN.NS", name: "Titan Company Ltd", exchange: "NSE", sector: "Consumer Goods & FMCG" },
  { ticker: "ULTRACEMCO.NS", name: "UltraTech Cement", exchange: "NSE", sector: "Infrastructure & Engineering" },
  { ticker: "TATASTEEL.NS", name: "Tata Steel Ltd", exchange: "NSE", sector: "Metals & Mining" },
  { ticker: "NTPC.NS", name: "NTPC Limited", exchange: "NSE", sector: "Energy & Utilities" },
  { ticker: "POWERGRID.NS", name: "Power Grid Corp of India", exchange: "NSE", sector: "Energy & Utilities" },
  { ticker: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology & IT Services" },
  { ticker: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Technology & IT Services" },
  { ticker: "GOOGL", name: "Alphabet Inc. (Google)", exchange: "NASDAQ", sector: "Technology & IT Services" },
  { ticker: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "Consumer Goods & FMCG" },
  { ticker: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology & IT Services" },
];

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  if (!query) {
    return NextResponse.json({ results: COMMON_INDIAN_STOCKS.slice(0, 10) });
  }

  const cleanQuery = query.toLowerCase();
  const filtered = COMMON_INDIAN_STOCKS.filter(
    s => s.ticker.toLowerCase().includes(cleanQuery) || s.name.toLowerCase().includes(cleanQuery) || s.sector.toLowerCase().includes(cleanQuery)
  );

  return NextResponse.json({ results: filtered });
}
