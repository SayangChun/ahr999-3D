"use client";

import { useEffect, useRef, useState } from "react";

const STREAM_URL = "wss://stream.binance.com:9443/ws/btcusdt@trade";
const REST_URL =
  "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
const FALLBACK_PRICE = 50000;

export type PriceStatus = "connecting" | "live" | "polling" | "offline";

export type PriceState = {
  price: number;
  status: PriceStatus;
  lastUpdated: Date | null;
};

export function useBtcPrice(): PriceState {
  const [state, setState] = useState<PriceState>({
    price: FALLBACK_PRICE,
    status: "connecting",
    lastUpdated: null,
  });
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    let sock: WebSocket | null = null;
    const ac = new AbortController();

    async function fetchRest() {
      try {
        const res = await fetch(REST_URL, {
          cache: "no-store",
          signal: ac.signal,
        });
        const data = (await res.json()) as { price?: string };
        const p = Number(data.price);
        if (mounted && Number.isFinite(p) && p > 0) {
          setState({ price: p, status: "polling", lastUpdated: new Date() });
        }
      } catch {
        if (mounted) setState((s) => ({ ...s, status: "offline" }));
      }
    }

    function connectWs() {
      if (!mounted) return;
      setState((s) => ({ ...s, status: s.lastUpdated ? "polling" : "connecting" }));
      sock = new WebSocket(STREAM_URL);
      sock.onopen = () => { attemptRef.current = 0; };
      sock.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data as string) as { p?: string };
          const p = Number(d.p);
          if (Number.isFinite(p) && p > 0) {
            setState({ price: p, status: "live", lastUpdated: new Date() });
          }
        } catch { /* ignore */ }
      };
      sock.onerror = () => sock?.close();
      sock.onclose = () => {
        if (!mounted) return;
        fetchRest();
        attemptRef.current += 1;
        const delay = Math.min(10000, 1000 * attemptRef.current);
        reconnectTimer.current = setTimeout(connectWs, delay);
      };
    }

    fetchRest();
    connectWs();
    const poll = setInterval(fetchRest, 30000);

    return () => {
      mounted = false;
      ac.abort();
      clearInterval(poll);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      sock?.close();
    };
  }, []);

  return state;
}
