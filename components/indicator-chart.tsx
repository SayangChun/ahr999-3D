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

// log10 值对应的参考线定义
const REF_DOTE   = 0.079;   // log10(1.2)  定投线
const REF_CHAODI = -0.347;  // log10(0.45) 抄底线

interface TickProps {
  x?: number;
  y?: number;
  payload?: { value: number };
}

function CustomYTick({ x = 0, y = 0, payload }: TickProps) {
  const v = payload?.value ?? 0;

  if (Math.abs(v - REF_DOTE) < 0.0001) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fill="#eab308" fontSize={10}>
          定投 1.2
        </text>
      </g>
    );
  }
  if (Math.abs(v - REF_CHAODI) < 0.0001) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fill="#22c55e" fontSize={10}>
          抄底 0.45
        </text>
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#a0a0a0" fontSize={10}>
        {String(Math.pow(10, v))}
      </text>
    </g>
  );
}

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
    const intTicks: number[] = [];
    for (let t = firstTick; t <= lastTick; t++) intTicks.push(t);
    // 将参考线刻度插入（仅限在可见范围内）
    const refTicks = [REF_DOTE, REF_CHAODI].filter((r) => r > yMin && r < yMax);
    const allTicks = [...intTicks, ...refTicks].sort((a, b) => a - b);
    return { chartData: data, yDomain: [yMin, yMax] as [number, number], yTicks: allTicks };
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
            stroke="#2a2a2a"
            width={68}
            domain={yDomain}
            ticks={yTicks}
            tick={(props: TickProps) => <CustomYTick {...props} />}
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
          <ReferenceLine y={REF_DOTE}   stroke="#eab308" strokeOpacity={0.5} strokeDasharray="6 3" />
          <ReferenceLine y={REF_CHAODI} stroke="#22c55e" strokeOpacity={0.5} strokeDasharray="6 3" />
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
