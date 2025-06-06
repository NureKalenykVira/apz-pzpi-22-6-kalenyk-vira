// com/example/mobileapz/api/ProductApi.kt
package com.example.mobileapz.api

import retrofit2.Call
import retrofit2.http.*

data class Product(
    val ProductID: Int? = null,
    val RefrigeratorID: Int,
    val Name: String,
    val Category: String,
    val ExpirationDate: String,
    val RFIDTag: String
)

interface ProductApi {
    @GET("products/refrigerator/{fridgeId}")
    fun getProductsByRefrigerator(
        @Path("fridgeId") fridgeId: Int,
        @Header("Authorization") token: String
    ): Call<List<Product>>

    @POST("products")
    fun addProduct(
        @Body product: Product,
        @Header("Authorization") token: String
    ): Call<Void>

    @DELETE("products/{productId}")
    fun deleteProduct(
        @Path("productId") productId: Int,
        @Header("Authorization") token: String
    ): Call<Void>
}
