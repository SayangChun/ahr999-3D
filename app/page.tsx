"use client";

import { useBtcPrice } from "@/hooks/use-btc-price";
import { useIndicatorHistory } from "@/hooks/use-indicator-history";
import { CurrentValue } from "@/components/current-value";
import { IndicatorChart } from "@/components/indicator-chart";
import { DistributionPanel } from "@/components/distribution-panel";
import { Methodology } from "@/components/methodology";
import { formatIndicator, formatPercent } from "@/lib/calculations";

export default function Home() {
  const { price, status, lastUpdated } = useBtcPrice();
  const {
    series,
    loading,
    stats,
    currentIndicator,
    currentDca200,
    currentModelPrice,
  } = useIndicatorHistory(price);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 bg-[#0b0b0b] px-4 py-6 text-[#f0f0f0]">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">
          ahr999-3D
        </h1>
        {lastUpdated && (
          <span className="text-xs text-[#808080]">
            {lastUpdated.toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        )}
      </header>

      <CurrentValue
        currentPrice={price}
        currentIndicator={currentIndicator}
        currentDca200={currentDca200}
        currentModelPrice={currentModelPrice}
        status={status}
      />

      <IndicatorChart series={series} loading={loading} />

      {stats && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <DistributionPanel
              series={series}
              stats={stats}
              currentIndicator={currentIndicator}
            />
            <div className="rounded-lg border border-[#2a2a2a] bg-[#151515] p-5">
              <h2 className="mb-3 text-xs uppercase tracking-[0.08em] text-[#a0a0a0]">
                统计
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <StatRow label="样本天数" value={String(stats.sampleDays)} />
                <StatRow label="开始日期" value={stats.startDate} />
                <StatRow label="截至日期" value={stats.endDate} />
                <StatRow label="历史最小" value={formatIndicator(stats.min)} />
                <StatRow label="历史最大" value={formatIndicator(stats.max)} />
                <StatRow label="均值" value={formatIndicator(stats.mean)} />
                <StatRow label="中位数" value={formatIndicator(stats.median)} />
                <StatRow
                  label="当前分位"
                  value={formatPercent(stats.currentPercentile / 100)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <Methodology />

      <footer className="mt-6 border-t border-[#2a2a2a] pt-4 text-center text-xs text-[#606060]">
        <p>
          作者{" "}
          <a
            href="https://github.com/SayangChun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3b82f6] hover:underline"
          >
            @SayangChun
          </a>
          ，          思路来源 ahr999 和{" "}
          <a
            href="https://crypto3d.pro/ahr999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3b82f6] hover:underline"
          >
            crypto3d.pro/ahr999
          </a>
        </p>
      </footer>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#a0a0a0]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
