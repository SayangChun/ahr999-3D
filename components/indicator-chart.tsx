"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Brush,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { IndicatorPoint } from "@/lib/types";
import { formatIndicator } from "@/lib/calculations";

type Props = {
  series: IndicatorPoint[];
  loading: boolean;
};

export function IndicatorChart({ series, loading }: Props) {
  const { chartData, yDomain, yTicks } = useMemo(() => {
    const data = series.map((p) => {
      const val = Math.round(p.indicator * 10000) / 10000;
      return {
        date: p.date,
        value: val,
        logValue: Math.log10(Math.max(val, 1e-10)),
      };
    });
    const logs = data.map((d) => d.logValue).filter(Number.isFinite);
    if (logs.length === 0) {
      return { chartData: data, yDomain: [-1, 1] as [number, number], yTicks: [-1, 0, 1] };
    }
    const minLog = Math.min(...logs);
    const maxLog = Math.max(...logs);
    // 当所有值相同时 range 为 0，给一个最小边距避免 NaN
    const range = maxLog - minLog || 1;
    const padding = range * 0.05;
    const yMin = minLog - padding;
    const yMax = maxLog + padding;
    // 只生成落在 [yMin, yMax] 范围内的整数对数刻度
    const firstTick = Math.ceil(yMin);
    const lastTick = Math.floor(yMax);
    const yTicks: number[] = [];
    for (let t = firstTick; t <= lastTick; t++) yTicks.push(t);
    return { chartData: data, yDomain: [yMin, yMax] as [number, number], yTicks };
  }, [series]);

  if (loading && chartData.length === 0) {
    return (
      <Card>
        <div className="flex h-64 items-center justify-center text-sm text-[#a0a0a0]">
          加载历史数据...
        </div>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <div className="flex h-64 items-center justify-center text-sm text-[#a0a0a0]">
          暂无数据
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-3 text-xs uppercase tracking-[0.08em] text-[#a0a0a0]">
        指标历史走势
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#a0a0a0" }}
            tickFormatter={(v: string) => v.slice(2)}
            stroke="#2a2a2a"
            minTickGap={60}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#a0a0a0" }}
            stroke="#2a2a2a"
            width={55}
            domain={yDomain}
            ticks={yTicks}
            tickFormatter={(v: number) => String(Math.pow(10, v))}
          />
          <Tooltip
            contentStyle={{
              background: "#151515",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              fontSize: 12,
            }}
            labelFormatter={(label) => `日期: ${label}`}
            formatter={(value) => [formatIndicator(Math.pow(10, Number(value ?? 0))), "指标值"]}
          />
          <ReferenceLine y={0} stroke="#3b82f6" strokeOpacity={0.3} strokeDasharray="4 4" />
          <ReferenceLine y={0.079} stroke="#eab308" strokeOpacity={0.5} strokeDasharray="6 3" label={{ value: "定投线 1.2", position: "insideTopRight", fontSize: 10, fill: "#eab308" }} />
          <ReferenceLine y={-0.347} stroke="#22c55e" strokeOpacity={0.5} strokeDasharray="6 3" label={{ value: "抄底线 0.45", position: "insideTopRight", fontSize: 10, fill: "#22c55e" }} />
          <Area
            type="monotone"
            dataKey="logValue"
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="url(#colorValue)"
            dot={false}
            isAnimationActive={false}
          />
          <Brush
            dataKey="date"
            height={24}
            stroke="#3b82f6"
            fill="#0b0b0b"
            tickFormatter={(v: string) => v.slice(2)}
            startIndex={0}
            endIndex={chartData.length - 1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
