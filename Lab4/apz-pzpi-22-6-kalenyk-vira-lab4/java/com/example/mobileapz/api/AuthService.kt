package com.example.mobileapz.api

import android.content.Context
import android.content.SharedPreferences
import android.util.Base64
import org.json.JSONObject

class AuthService(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        prefs.edit().putString("token", token).apply()
    }

    fun getToken(): String? = prefs.getString("token", null)

    fun isAuthenticated(): Boolean = getToken() != null

    fun logout() {
        prefs.edit().clear().apply()
    }

    fun getRoleFromToken(): String? {
        val token = getToken() ?: return null
        return try {
            val parts = token.split(".")
            if (parts.size < 2) return null
            val payload = String(Base64.decode(parts[1], Base64.DEFAULT))
            JSONObject(payload).optString("role", null)
        } catch (e: Exception) {
            null
        }
    }

    fun getUserIdFromToken(): Int? {
        val token = getToken() ?: return null
        return try {
            val parts = token.split(".")
            if (parts.size < 2) return null
            val payload = String(Base64.decode(parts[1], Base64.DEFAULT))
            JSONObject(payload).optInt("userId", -1).takeIf { it != -1 }
        } catch (e: Exception) {
            null
        }
    }
}