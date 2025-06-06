package com.example.mobileapz.api

import android.content.Context
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProductService(private val context: Context) {
    private val api = ApiClient.productApi
    private val authService = AuthService(context)
    private fun bearerToken(): String = "Bearer ${authService.getToken()}"

    fun getProductsByRefrigerator(
        fridgeId: Int,
        onSuccess: (List<Product>) -> Unit,
        onError: (String) -> Unit
    ) {
        api.getProductsByRefrigerator(fridgeId, bearerToken()).enqueue(object : Callback<List<Product>> {
            override fun onResponse(call: Call<List<Product>>, response: Response<List<Product>>) {
                if (response.isSuccessful && response.body() != null) {
                    onSuccess(response.body()!!)
                } else {
                    onError("Помилка: ${response.message()}")
                }
            }
            override fun onFailure(call: Call<List<Product>>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }

    fun addProduct(
        product: Product,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        api.addProduct(product, bearerToken()).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError("Помилка створення продукту: ${response.message()}")
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }

    fun deleteProduct(
        productId: Int,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        api.deleteProduct(productId, bearerToken()).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError("Помилка видалення продукту: ${response.message()}")
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }
}