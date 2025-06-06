package com.example.mobileapz

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.graphics.Color
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.example.mobileapz.api.SensorService
import com.example.mobileapz.api.SensorDataPoint

class AnalyticsActivity : AppCompatActivity() {
    private lateinit var sensorService: SensorService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_analytics)

        val fridgeId = intent.getIntExtra("FRIDGE_ID", -1)
        val fridgeName = intent.getStringExtra("FRIDGE_NAME") ?: ""
        findViewById<TextView>(R.id.tvTitle).text = "Analytics for \"$fridgeName\""
        findViewById<ImageButton>(R.id.btnBack).setOnClickListener { finish() }

        sensorService = SensorService(applicationContext)

        if (fridgeId != -1) {
            sensorService.getAnalyticsForFridge(
                fridgeId,
                onSuccess = { sensorData -> showAnalytics(sensorData) },
                onError = { msg -> findViewById<TextView>(R.id.tvAvgTemp).text = "Помилка: $msg" }
            )
        } else {
            findViewById<TextView>(R.id.tvAvgTemp).text = "Fridge ID not found"
        }
    }

    private fun showAnalytics(sensorData: List<SensorDataPoint>) {
        val TAG = "ANALYTICS"

        if (sensorData.isEmpty()) {
            findViewById<TextView>(R.id.tvAvgTemp).text = "No data"
            Log.d(TAG, "Отримано порожній список даних.")
            return
        }

        // Сортуємо за часом (припускаємо, що Timestamp — ISO 8601)
        val sortedData = sensorData.sortedBy { it.Timestamp }
        Log.d(TAG, "Всього точок даних: ${sortedData.size}")
        sortedData.forEachIndexed { i, d ->
            Log.d(TAG, "[$i] T: ${d.Temperature} H: ${d.Humidity} @ ${d.Timestamp}")
        }

        // Окремі списки для температури та вологості (тільки ті, де не null)
        val tempPoints = sortedData.filter { it.Temperature != null }
            .takeLast(10)
        val humidityPoints = sortedData.filter { it.Humidity != null }
            .takeLast(10)

        Log.d(TAG, "Після фільтрації:")
        Log.d(TAG, "Температура: ${tempPoints.size} точок")
        tempPoints.forEachIndexed { i, d ->
            Log.d(TAG, "[Temp $i] ${d.Temperature} @ ${d.Timestamp}")
        }
        Log.d(TAG, "Вологість: ${humidityPoints.size} точок")
        humidityPoints.forEachIndexed { i, d ->
            Log.d(TAG, "[Hum $i] ${d.Humidity} @ ${d.Timestamp}")
        }

        val tempHistory = tempPoints.map { it.Temperature!!.toFloat() }
        val tempTimestamps = tempPoints.map { it.Timestamp.take(16).replace("T", " ") }

        val humidityHistory = humidityPoints.map { it.Humidity!!.toFloat() }
        val humidityTimestamps = humidityPoints.map { it.Timestamp.take(16).replace("T", " ") }

        // --- Температура ---
        val tempLimit = 5.0f
        val avgTemp = if (tempHistory.isNotEmpty()) tempHistory.average() else 0.0
        val tempTrend = if (tempHistory.size > 1) tempHistory.last() - tempHistory.first() else 0.0f
        val tempStable = if (tempHistory.isNotEmpty())
            tempHistory.count { it <= tempLimit }.toFloat() / tempHistory.size
        else 0f

        var maxViolation = 0
        var cur = 0
        for (v in tempHistory) {
            if (v > tempLimit) {
                cur++
                if (cur > maxViolation) maxViolation = cur
            } else {
                cur = 0
            }
        }

        // --- Вологість ---
        val avgHumidity = if (humidityHistory.isNotEmpty()) humidityHistory.average() else 0.0
        // (Для вологості тренд і стабільність не розраховуємо — але можна додати за аналогією)

        Log.d(TAG, "Метрики температури: avg=$avgTemp trend=$tempTrend stable=$tempStable maxViolation=$maxViolation")
        Log.d(TAG, "Метрики вологості: avg=$avgHumidity")

        // --- Відображення на UI ---
        findViewById<TextView>(R.id.tvAvgTemp).text = "Середня температура: %.2f°C".format(avgTemp)
        findViewById<TextView>(R.id.tvAvgHumidity).text = "Середня вологість: %.2f%%".format(avgHumidity)
        findViewById<TextView>(R.id.tvTrend).text = "Тренд температури: %.2f".format(tempTrend)
        findViewById<TextView>(R.id.tvStability).text = "Коефіцієнт стабільності: %.2f".format(tempStable)
        findViewById<TextView>(R.id.tvMaxViolation).text = "Макс. час порушення: $maxViolation год"

        // --- Графік температури ---
        val tempEntries = tempHistory.mapIndexed { i, value -> Entry(i.toFloat(), value) }
        val tempDataSet = LineDataSet(tempEntries, "Temp (°C)").apply {
            color = Color.parseColor("#4056F4")
            setCircleColor(Color.parseColor("#4056F4"))
            valueTextColor = Color.BLACK
            lineWidth = 2.5f
            circleRadius = 4f
            setDrawValues(false)
            setDrawFilled(false)
        }
        val tempChart = findViewById<LineChart>(R.id.tempChart)
        tempChart.data = LineData(tempDataSet)
        tempChart.axisRight.isEnabled = false
        tempChart.xAxis.position = XAxis.XAxisPosition.BOTTOM
        tempChart.xAxis.valueFormatter = XAxisValueFormatter(tempTimestamps)
        tempChart.description.isEnabled = false
        tempChart.legend.isEnabled = false
        tempChart.xAxis.textColor = Color.GRAY
        tempChart.axisLeft.textColor = Color.GRAY
        tempChart.invalidate()

        // --- Графік вологості ---
        val humidityEntries = humidityHistory.mapIndexed { i, value -> Entry(i.toFloat(), value) }
        val humidityDataSet = LineDataSet(humidityEntries, "Humidity (%)").apply {
            color = Color.parseColor("#20b551")
            setCircleColor(Color.parseColor("#20b551"))
            valueTextColor = Color.BLACK
            lineWidth = 2.5f
            circleRadius = 4f
            setDrawValues(false)
            setDrawFilled(false)
        }
        val humidityChart = findViewById<LineChart>(R.id.humidityChart)
        humidityChart.data = LineData(humidityDataSet)
        humidityChart.axisRight.isEnabled = false
        humidityChart.xAxis.position = XAxis.XAxisPosition.BOTTOM
        humidityChart.xAxis.valueFormatter = XAxisValueFormatter(humidityTimestamps)
        humidityChart.description.isEnabled = false
        humidityChart.legend.isEnabled = false
        humidityChart.xAxis.textColor = Color.GRAY
        humidityChart.axisLeft.textColor = Color.GRAY
        humidityChart.invalidate()
    }

    // Клас для підписів по осі X (час)
    class XAxisValueFormatter(private val labels: List<String>) : com.github.mikephil.charting.formatter.ValueFormatter() {
        override fun getFormattedValue(value: Float): String {
            val i = value.toInt()
            return labels.getOrNull(i) ?: ""
        }
    }
}