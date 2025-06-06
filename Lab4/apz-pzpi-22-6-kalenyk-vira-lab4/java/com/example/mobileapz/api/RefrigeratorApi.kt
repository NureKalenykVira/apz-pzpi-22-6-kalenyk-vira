package com.example.mobileapz.api

import retrofit2.Call
import retrofit2.http.*

data class Refrigerator(
    val RefrigeratorID: Int? = null,
    val UserID: Int,
    val Name: String,
    val Location: String
)

interface RefrigeratorApi {
    @GET("refrigerators/user/{userId}")
    fun getRefrigerators(
        @Path("userId") userId: Int,
        @Header("Authorization") token: String
    ): Call<List<Refrigerator>>

    @POST("refrigerators")
    fun createRefrigerator(
        @Body data: Refrigerator,
        @Header("Authorization") token: String
    ): Call<Void>

    @PUT("refrigerators/{id}")
    fun updateRefrigerator(
        @Path("id") id: Int,
        @Body data: Refrigerator,
        @Header("Authorization") token: String
    ): Call<Void>

    @DELETE("refrigerators/{id}")
    fun deleteRefrigerator(
        @Path("id") id: Int,
        @Header("Authorization") token: String
    ): Call<Void>
}