export const BITCOIN_GENESIS = new Date("2009-01-03T00:00:00Z");
const SLOPE = 5.5189;
const INTERCEPT = -15.8993;

export function getAgeDays(date: Date): number {
  return Math.max(
    1,
    Math.floor(
      (date.getTime() - BITCOIN_GENESIS.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
}

export function calculateModelPrice(date: Date): number {
  const ageDays = getAgeDays(date);
  return 10 ** (SLOPE * Math.log10(ageDays) + INTERCEPT);
}

export function calculateAhr999(price: number, dca200: number, modelPrice: number): number {
  if (price <= 0 || dca200 <= 0 || modelPrice <= 0) return 0;
  return (price / dca200) * (price / modelPrice);
}
