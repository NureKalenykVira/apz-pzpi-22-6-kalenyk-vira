package com.example.mobileapz.api

import android.content.Context
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SensorService(private val context: Context) {
    private val api = ApiClient.sensorApi
    private val authService = AuthService(context)
    private fun bearerToken(): String = "Bearer ${authService.getToken()}"

    fun getAnalyticsForFridge(
        fridgeId: Int,
        onSuccess: (List<SensorDataPoint>) -> Unit,
        onError: (String) -> Unit
    ) {
        api.getSensorsByRefrigerator(fridgeId, bearerToken())
            .enqueue(object : Callback<List<Sensor>> {
                override fun onResponse(
                    call: Call<List<Sensor>>,
                    response: Response<List<Sensor>>
                ) {
                    if (response.isSuccessful && response.body() != null) {
                        val sensors = response.body()!!
                        if (sensors.isEmpty()) {
                            onSuccess(emptyList())
                            return
                        }

                        val allData = mutableListOf<SensorDataPoint>()
                        var loaded = 0
                        var errorCalled = false

                        for (sensor in sensors) {
                            api.getSensorData(sensor.SensorID, bearerToken())
                                .enqueue(object : Callback<List<SensorDataPoint>> {
                                    override fun onResponse(
                                        call: Call<List<SensorDataPoint>>,
                                        response: Response<List<SensorDataPoint>>
                                    ) {
                                        loaded++
                                        if (response.isSuccessful && response.body() != null) {
                                            allData.addAll(response.body()!!)
                                        }
                                        // коли всі сенсори відпрацювали – віддаємо результат
                                        if (loaded == sensors.size && !errorCalled) {
                                            onSuccess(allData)
                                        }
                                    }

                                    override fun onFailure(
                                        call: Call<List<SensorDataPoint>>,
                                        t: Throwable
                                    ) {
                                        loaded++
                                        // якщо хоч один запит впав, віддаємо те, що є
                                        if (!errorCalled && loaded == sensors.size) {
                                            onSuccess(allData)
                                        }
                                    }
                                })
                        }
                    } else {
                        onError("Помилка отримання сенсорів: ${response.message()}")
                    }
                }

                override fun onFailure(call: Call<List<Sensor>>, t: Throwable) {
                    onError("Мережева помилка: ${t.message}")
                }
            })
    }
}
