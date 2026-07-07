import type { IndicatorStats, IndicatorPoint } from "./types";

export function computeQuantile(sorted: number[], q: number): number {
  const index = q * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function computeStats(
  series: IndicatorPoint[],
  currentIndicator: number,
): IndicatorStats {
  const values = series.map((p) => p.indicator);
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);

  const p25 = computeQuantile(sorted, 0.25);
  const p75 = computeQuantile(sorted, 0.75);
  const median = computeQuantile(sorted, 0.5);

  const currentPos = sorted.findIndex((v) => v >= currentIndicator);
  const currentPercentile =
    currentPos >= 0 ? currentPos / n : currentIndicator <= sorted[0] ? 0 : 1;

  return {
    sampleDays: n,
    startDate: series[0].date,
    endDate: series[series.length - 1].date,
    min: sorted[0],
    max: sorted[n - 1],
    mean: sum / n,
    median,
    p25,
    p75,
    currentPercentile: Math.round(currentPercentile * 100),
  };
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatIndicator(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "--";
  return value.toFixed(4);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
