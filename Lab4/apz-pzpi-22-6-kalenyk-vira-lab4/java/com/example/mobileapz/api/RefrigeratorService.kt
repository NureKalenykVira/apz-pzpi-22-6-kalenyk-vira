package com.example.mobileapz.api

import android.content.Context
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RefrigeratorService(private val context: Context) {
    private val api = ApiClient.refrigeratorApi
    private val authService = AuthService(context)

    private fun bearerToken(): String = "Bearer ${authService.getToken()}"

    fun getRefrigerators(
        onSuccess: (List<Refrigerator>) -> Unit,
        onError: (String) -> Unit
    ) {
        val userId = authService.getUserIdFromToken()
        if (userId == null) {
            onError("Не знайдено користувача")
            return
        }
        api.getRefrigerators(userId, bearerToken()).enqueue(object : Callback<List<Refrigerator>> {
            override fun onResponse(
                call: Call<List<Refrigerator>>,
                response: Response<List<Refrigerator>>
            ) {
                if (response.isSuccessful && response.body() != null) {
                    onSuccess(response.body()!!)
                } else {
                    onError("Помилка: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<List<Refrigerator>>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }

    fun createRefrigerator(
        name: String,
        location: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val userId = authService.getUserIdFromToken()
        if (userId == null) {
            onError("Не знайдено користувача")
            return
        }
        // Поля повинні співпадати з бекендом (UserID, Name, Location)
        val data = Refrigerator(UserID = userId, Name = name, Location = location)
        api.createRefrigerator(data, bearerToken()).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError("Помилка створення: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }

    fun updateRefrigerator(
        id: Int,
        name: String,
        location: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val userId = authService.getUserIdFromToken()
        if (userId == null) {
            onError("Не знайдено користувача")
            return
        }
        val data = Refrigerator(UserID = userId, Name = name, Location = location)
        api.updateRefrigerator(id, data, bearerToken()).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError("Помилка оновлення: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }

    fun deleteRefrigerator(
        id: Int,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        api.deleteRefrigerator(id, bearerToken()).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError("Помилка видалення: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                onError("Мережева помилка: ${t.message}")
            }
        })
    }
}