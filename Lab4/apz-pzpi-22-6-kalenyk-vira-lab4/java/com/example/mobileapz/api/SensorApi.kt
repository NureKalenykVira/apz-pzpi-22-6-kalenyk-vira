package com.example.mobileapz.api

import retrofit2.Call
import retrofit2.http.*


data class Sensor(
    val SensorID: Int,
    val RefrigeratorID: Int,
)

data class SensorDataPoint(
    val Temperature: Double,
    val Humidity: Double,
    val Timestamp: String
)

interface SensorApi {
    @GET("sensors/refrigerator/{fridgeId}")
    fun getSensorsByRefrigerator(
        @Path("fridgeId") fridgeId: Int,
        @Header("Authorization") token: String
    ): Call<List<Sensor>>

    @GET("sensor-data/sensor/{sensorId}")
    fun getSensorData(
        @Path("sensorId") sensorId: Int,
        @Header("Authorization") token: String
    ): Call<List<SensorDataPoint>>
}
