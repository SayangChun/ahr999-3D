"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatIndicator } from "@/lib/calculations";

type Props = {
  currentPrice: number;
  currentIndicator: number;
  currentDca200: number;
  currentModelPrice: number;
  status: string;
};

export function CurrentValue({ currentPrice, currentIndicator, currentDca200, currentModelPrice, status }: Props) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.08em] text-[#a0a0a0]">
            当前指标值
          </h2>
          <span className="text-xs text-[#a0a0a0]">
            {status === "live"
              ? "实时"
              : status === "polling"
                ? "更新中"
                : status === "connecting"
                  ? "连接中"
                  : "离线"}
          </span>
        </div>
        <div className="text-4xl font-semibold tracking-tight text-[#f0f0f0]">
          {formatIndicator(currentIndicator)}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#a0a0a0]">
          <span>价格：{formatCurrency(currentPrice)}</span>
          <span>200DCA：{formatCurrency(currentDca200)}</span>
          <span>拟合：{formatCurrency(currentModelPrice)}</span>
        </div>
      </div>
    </Card>
  );
}
