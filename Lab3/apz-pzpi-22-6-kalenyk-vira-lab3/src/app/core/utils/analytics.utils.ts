export interface SensorDataPoint {
  Temperature: number;
  Humidity: number;
  Timestamp: string;
}

export interface AnalyticsResult {
  avgTemp: number;
  avgHumidity: number;
  stabilityCoeff: number;
  trend: number;
  maxViolationDuration: number;
}

export function computeAnalytics(data: SensorDataPoint[]): AnalyticsResult {
  if (!data || data.length === 0) {
    return {
      avgTemp: 0,
      avgHumidity: 0,
      stabilityCoeff: 0,
      trend: 0,
      maxViolationDuration: 0
    };
  }

  const temps = data.map(d => d.Temperature);
  const humidities = data.map(d => d.Humidity);

  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;

  const variance = temps.reduce((sum, t) => sum + (t - avgTemp) ** 2, 0) / temps.length;
  const stddev = Math.sqrt(variance);
  const stabilityCoeff = 1 - stddev / avgTemp;

  const x = data.map((_, i) => i);
  const y = temps;
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const trend = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  let maxViolation = 0;
  let current = 0;
  for (const t of temps) {
    if (t < 2 || t > 8) {
      current++;
      maxViolation = Math.max(maxViolation, current);
    } else {
      current = 0;
    }
  }

  return {
    avgTemp,
    avgHumidity,
    stabilityCoeff: parseFloat(stabilityCoeff.toFixed(3)),
    trend: parseFloat(trend.toFixed(3)),
    maxViolationDuration: maxViolation
  };
}
