import { Card } from "@/components/ui/card";

export function Methodology() {
  return (
    <Card>
      <h2 className="mb-2 text-xs uppercase tracking-[0.08em] text-[#a0a0a0]">
        方法论
      </h2>
      <div className="space-y-2 text-sm leading-6 text-[#c0c0c0]">
        <p>
          <strong>ahr999-3D</strong>
          {" "}= (Price / 200DCA) × (Price / 拟合价格)
        </p>
        <p>
          200DCA = 过去200天收盘价均值（定投成本）
        </p>
        <p>
          拟合价格 = 10^(5.5189 × log₁₀(ageDays) − 15.8993)
        </p>
        <p>
          ageDays = 自 2009‑01‑03 起的天数。指标为 1 表示价格等于公允值，
          &lt;1 表示相对低估，&gt;1 表示相对高估。
        </p>
        <p className="text-xs text-[#808080]">
          数据来源：Binance（仅客户端计算）100% 客户端，无服务器，无需登录。
        </p>
      </div>
    </Card>
  );
}
