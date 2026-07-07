export type PricePoint = {
  date: string;
  price: number;
};

export type IndicatorPoint = {
  date: string;
  price: number;
  dca200: number;
  model: number;
  indicator: number;
};

export type IndicatorStats = {
  sampleDays: number;
  startDate: string;
  endDate: string;
  min: number;
  max: number;
  mean: number;
  median: number;
  p25: number;
  p75: number;
  currentPercentile: number;
};
