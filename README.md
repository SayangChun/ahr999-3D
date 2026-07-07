# ahr999-3D

ahr999-3D 囤币指标，公式为 `(Price / 200DCA) × (Price / 拟合价格)`。

**拟合价格参数**
- a: 5.5189
- b: -15.8993
- 起始日期: 2009-01-03

**特点**
- 100% 客户端，无需后端服务器
- 实时 BTC/USDT 价格（Binance WebSocket + REST 回退）
- 历史数据自动缓存（localStorage，12h 有效）
- 可直接部署到 Vercel

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 构建

```bash
npm run build     # 生成生产构建
npm run start     # 本地启动生产构建
npm run lint
```

## 技术栈

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS 配置)
- Recharts 图表库
- Binance 公开 API（客户端直连）

## 部署

直接把仓库导入 Vercel 即可部署。
项目会使用 Vercel 的默认 Next.js 构建流程，不需要额外的路径前缀配置。

## 数据来源

- 当前价格：Binance WebSocket (`wss://stream.binance.com:9443/ws/btcusdt@trade`) + REST 回退
- 历史价格：Binance REST (`GET /api/v3/klines`)，日线数据
