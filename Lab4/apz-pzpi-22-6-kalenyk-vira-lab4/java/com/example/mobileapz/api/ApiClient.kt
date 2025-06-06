package com.example.mobileapz.api

import com.example.mobileapz.Constants
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(Constants.BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val authApi: AuthApi = retrofit.create(AuthApi::class.java)
    val refrigeratorApi: RefrigeratorApi = retrofit.create(RefrigeratorApi::class.java)
    val productApi: ProductApi = retrofit.create(ProductApi::class.java)
    val sensorApi: SensorApi = retrofit.create(SensorApi::class.java)

}
