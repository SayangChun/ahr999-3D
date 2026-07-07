"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { IndicatorPoint, IndicatorStats } from "@/lib/types";
import { formatIndicator, formatPercent } from "@/lib/calculations";

type Props = {
  series: IndicatorPoint[];
  stats: IndicatorStats | null;
  currentIndicator: number;
};

const ZONES = [
  { key: "bottom", label: "抄底区", range: "< 0.45", min: -Infinity, max: 0.45, color: "#22c55e" },
  { key: "normal", label: "定投区", range: "0.45 ~ 1.2", min: 0.45, max: 1.2, color: "#3b82f6" },
  { key: "danger", label: "危险区", range: "> 1.2", min: 1.2, max: Infinity, color: "#ef4444" },
] as const;

type ZoneKey = (typeof ZONES)[number]["key"];

export function DistributionPanel({
  series,
  stats,
  currentIndicator,
}: Props) {
  const zones = useMemo(() => {
    const total = series.length;
    const counts: Record<ZoneKey, number> = { bottom: 0, normal: 0, danger: 0 };

    for (const p of series) {
      const v = p.indicator;
      if (v < 0.45) counts.bottom++;
      else if (v <= 1.2) counts.normal++;
      else counts.danger++;
    }

    return ZONES.map((z) => ({
      ...z,
      count: counts[z.key],
      percentage: total > 0 ? counts[z.key] / total : 0,
    }));
  }, [series]);

  const currentZone = useMemo(() => {
    if (currentIndicator < 0.45) return "bottom";
    if (currentIndicator <= 1.2) return "normal";
    return "danger";
  }, [currentIndicator]);

  const maxCount = Math.max(...zones.map((z) => z.count), 1);

  if (series.length === 0) {
    return (
      <Card>
        <div className="flex h-40 items-center justify-center text-sm text-[#a0a0a0]">
          暂无分布数据
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-3 text-xs uppercase tracking-[0.08em] text-[#a0a0a0]">
        历史分布
      </h2>
      <div className="flex flex-col gap-2">
        {zones.map((zone) => (
          <div key={zone.key} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-[#a0a0a0]">{zone.label}</span>
                <span className="text-[#606060]">{zone.range}</span>
              </div>
              <span className="text-[#f0f0f0]">
                {zone.count}天
                <span className="ml-1 text-[#a0a0a0]">
                  ({formatPercent(zone.percentage)})
                </span>
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(zone.count / maxCount) * 100}%`,
                  backgroundColor: zone.color,
                  opacity: currentZone === zone.key ? 1 : 0.4,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#a0a0a0]">
        <span>
          当前:{" "}
          <span className="font-semibold text-[#f0f0f0]">
            {formatIndicator(currentIndicator)}
          </span>
        </span>
        <span>→</span>
        <span
          className="font-semibold"
          style={{
            color: ZONES.find((z) => z.key === currentZone)?.color,
          }}
        >
          {ZONES.find((z) => z.key === currentZone)?.label}
        </span>
        {stats && (
          <>
            <span className="text-[#606060]">·</span>
            <span>
              分位{" "}
              <span className="font-semibold text-[#f0f0f0]">
                {formatPercent(stats.currentPercentile / 100)}
              </span>
            </span>
          </>
        )}
      </div>
    </Card>
  );
}
