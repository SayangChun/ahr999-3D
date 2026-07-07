# ahr999-3D

ahr999-3D 鍥ゅ竵鎸囨爣锛屽叕寮忎负 `(Price / 200DCA) 脳 (Price / 鎷熷悎浠锋牸)`銆?
**鎷熷悎浠锋牸鍙傛暟**
- a: 5.5189
- b: -15.8993
- 璧峰鏃ユ湡: 2009-01-03

**鐗圭偣**
- 100% 瀹㈡埛绔紝鏃犻渶鍚庣鏈嶅姟鍣?- 瀹炴椂 BTC/USDT 浠锋牸锛圔inance WebSocket + REST 鍥為€€锛?- 鍘嗗彶鏁版嵁鑷姩缂撳瓨锛坙ocalStorage锛?2h 鏈夋晥锛?- 闈欐€佸鍑猴紝鍙儴缃茶嚦 GitHub Pages / Vercel 绛?
## 蹇€熷紑濮?
```bash
npm install
npm run dev
```

鎵撳紑 http://localhost:3000

## 鏋勫缓

```bash
npm run build     # 杈撳嚭鍒?out/
npm run start     # 鏈湴棰勮鏋勫缓浜х墿
npm run lint
```

## 鎶€鏈爤

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS 閰嶇疆)
- Recharts 鍥捐〃搴?- Binance 鍏紑 API锛堝鎴风鐩磋繛锛?
## 閮ㄧ讲

闈欐€佸鍑?`out/` 鐩綍鍙洿鎺ユ墭绠¤嚦浠讳綍闈欐€佹枃浠舵湇鍔″櫒銆?
GitHub Pages 閰嶇疆宸插湪 `next.config.ts` 涓鐣欙細
- 璁剧疆 `GITHUB_REPOSITORY` 鐜鍙橀噺鏃惰嚜鍔ㄦ坊鍔?`basePath`

## 鏁版嵁鏉ユ簮

- 褰撳墠浠锋牸锛欱inance WebSocket (`wss://stream.binance.com:9443/ws/btcusdt@trade`) + REST 鍥為€€
- 鍘嗗彶浠锋牸锛欱inance REST (`GET /api/v3/klines`)锛屾棩绾挎暟鎹?
