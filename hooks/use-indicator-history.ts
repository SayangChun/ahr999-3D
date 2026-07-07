"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateModelPrice, calculateAhr999 } from "@/lib/power-law";
import type { IndicatorPoint, IndicatorStats } from "@/lib/types";
import { computeStats } from "@/lib/calculations";

const KLINES_URL = "https://api.binance.com/api/v3/klines";
const START_MS = new Date("2010-01-01T00:00:00Z").getTime();
const CACHE_KEY = "ahr999:history:v1";
const CACHE_TTL = 1000 * 60 * 60 * 12;

type Kline = [number, string, string, string, string, string, number, string, number, string, string, string];

type PriceRecord = {
  timestamp: number;
  dateStr: string;
  close: number;
};

function parsePrice(k: Kline): PriceRecord | null {
  const close = Number(k[4]);
  if (!Number.isFinite(close) || close <= 0) return null;
  const date = new Date(k[0]);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const dateStr = `${date.getUTCFullYear()}-${mm}-${dd}`;
  return { timestamp: k[0], dateStr, close: Math.round(close * 100) / 100 };
}

function buildIndicatorSeries(prices: PriceRecord[]): IndicatorPoint[] {
  const result: IndicatorPoint[] = [];
  const closes = prices.map((p) => p.close);

  for (let i = 0; i < prices.length; i++) {
    const price = closes[i];
    if (price <= 0) continue;

    const windowStart = Math.max(0, i - 199);
    let sum = 0;
    for (let j = windowStart; j <= i; j++) {
      sum += closes[j];
    }
    const dca200 = sum / (i - windowStart + 1);

    const model = calculateModelPrice(new Date(prices[i].timestamp));
    const indicator = calculateAhr999(price, dca200, model);

    result.push({
      date: prices[i].dateStr,
      price,
      dca200: Math.round(dca200 * 100) / 100,
      model: Math.round(model * 100) / 100,
      indicator,
    });
  }

  return result;
}

type CacheData = { ts: number; data: IndicatorPoint[] };

function restoreFromCache(): IndicatorPoint[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CacheData;
      if (
        parsed &&
        Array.isArray(parsed.data) &&
        parsed.data.length > 0 &&
        Date.now() - parsed.ts < CACHE_TTL * 2
      ) {
        return parsed.data;
      }
    }
  } catch { /* ignore */ }
  return [];
}

type HistoryState = {
  series: IndicatorPoint[];
  loading: boolean;
  error: boolean;
};

export function useIndicatorHistory(currentPrice: number): HistoryState & {
  stats: IndicatorStats | null;
  currentIndicator: number;
  currentDca200: number;
  currentModelPrice: number;
} {
  const [state, setState] = useState<HistoryState>({
    series: [],
    loading: true,
    error: false,
  });

  const series = state.series;

  const currentDca200 = useMemo(() => {
    if (series.length < 200) return 0;
    return series.slice(-200).reduce((a, b) => a + b.price, 0) / 200;
  }, [series]);

  const currentModelPrice = useMemo(() => {
    return calculateModelPrice(new Date());
  }, []);

  const currentIndicator = useMemo(() => {
    if (currentPrice <= 0 || currentDca200 <= 0) return 0;
    return calculateAhr999(currentPrice, currentDca200, currentModelPrice);
  }, [currentPrice, currentDca200, currentModelPrice]);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;
      const cached = restoreFromCache();
      if (cached.length > 0) {
        setState({ series: cached, loading: true, error: false });
      }
    });

    async function fetchAll() {
      try {
        const rawPrices: PriceRecord[] = [];
        let startTime = START_MS;

        while (true) {
          if (cancelled) return;
          const url = `${KLINES_URL}?symbol=BTCUSDT&interval=1d&startTime=${startTime}&limit=1000`;
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) break;
          const raw: Kline[] = await res.json();
          if (raw.length === 0) break;

          const parsed = raw.map(parsePrice).filter((p): p is PriceRecord => p !== null);
          rawPrices.push(...parsed);

          if (raw.length < 1000) break;

          const lastTs = raw[raw.length - 1][0];
          startTime = lastTs + 86400000;
          await new Promise((r) => setTimeout(r, 60));
        }

        if (!cancelled && rawPrices.length > 0) {
          const all = buildIndicatorSeries(rawPrices);
          setState({ series: all, loading: false, error: false });
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ ts: Date.now(), data: all }),
            );
          } catch { /* ignore */ }
        } else if (!cancelled) {
          setState((s) => ({ ...s, loading: false }));
        }
      } catch {
        if (!cancelled)
          setState((s) => ({ ...s, loading: false, error: s.series.length === 0 }));
      }
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (series.length === 0) return null;
    return computeStats(series, currentIndicator);
  }, [series, currentIndicator]);

  return {
    series,
    loading: state.loading,
    error: state.error,
    stats,
    currentIndicator,
    currentDca200,
    currentModelPrice,
  };
}
