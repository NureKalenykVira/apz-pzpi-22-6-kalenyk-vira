package com.example.mobileapz.api

data class AnalyticsResult(
    val avgTemp: Double,
    val avgHumidity: Double,
    val stabilityCoeff: Double,
    val trend: Double,
    val maxViolationDuration: Int
)

fun computeAnalytics(data: List<SensorDataPoint>): AnalyticsResult {
    if (data.isEmpty()) {
        return AnalyticsResult(0.0, 0.0, 0.0, 0.0, 0)
    }
    val temps = data.map { it.Temperature }
    val humidities = data.map { it.Humidity }
    val avgTemp = temps.average()
    val avgHumidity = humidities.average()

    val variance = temps.sumOf { (it - avgTemp) * (it - avgTemp) } / temps.size
    val stddev = Math.sqrt(variance)
    val stabilityCoeff = if (avgTemp != 0.0) 1 - stddev / avgTemp else 0.0

    val x = temps.indices.map { it.toDouble() }
    val y = temps
    val n = x.size
    val sumX = x.sum()
    val sumY = y.sum()
    val sumXY = x.indices.sumOf { i -> x[i] * y[i] }
    val sumX2 = x.sumOf { it * it }
    val trend = if (n > 1 && n * sumX2 - sumX * sumX != 0.0) {
        (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    } else 0.0

    var maxViolation = 0
    var current = 0
    for (t in temps) {
        if (t < 2 || t > 8) {
            current++
            if (current > maxViolation) maxViolation = current
        } else {
            current = 0
        }
    }
    return AnalyticsResult(
        avgTemp = avgTemp,
        avgHumidity = avgHumidity,
        stabilityCoeff = String.format("%.3f", stabilityCoeff).toDouble(),
        trend = String.format("%.3f", trend).toDouble(),
        maxViolationDuration = maxViolation
    )
}