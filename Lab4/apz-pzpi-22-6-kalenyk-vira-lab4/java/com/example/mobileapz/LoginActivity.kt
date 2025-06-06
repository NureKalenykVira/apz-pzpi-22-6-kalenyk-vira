package com.example.mobileapz

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.method.LinkMovementMethod
import android.text.style.ClickableSpan
import android.text.style.ForegroundColorSpan
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.mobileapz.api.ApiClient
import com.example.mobileapz.api.AuthService
import com.example.mobileapz.api.LoginRequest
import com.example.mobileapz.api.LoginResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnConfirm = findViewById<Button>(R.id.btnConfirm)
        val tvSignUp = findViewById<TextView>(R.id.tvSignUp)

        val authService = AuthService(applicationContext)

        btnConfirm.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            // Валідація
            if (email.isEmpty()) {
                etEmail.error = "Введіть email"
                return@setOnClickListener
            }
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                etEmail.error = "Некоректний email"
                return@setOnClickListener
            }
            if (password.isEmpty()) {
                etPassword.error = "Введіть пароль"
                return@setOnClickListener
            }

            btnConfirm.isEnabled = false

            val request = LoginRequest(email, password)
            ApiClient.authApi.login(request).enqueue(object : Callback<LoginResponse> {
                override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                    btnConfirm.isEnabled = true
                    if (response.isSuccessful && response.body() != null) {
                        val token = response.body()!!.token
                        authService.saveToken(token)
                        Toast.makeText(
                            this@LoginActivity,
                            "Вхід виконано успішно!",
                            Toast.LENGTH_SHORT
                        ).show()
                        // Перехід до FridgesActivity
                        startActivity(Intent(this@LoginActivity, FridgesActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(
                            this@LoginActivity,
                            "Помилка входу: невірний email або пароль",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                    btnConfirm.isEnabled = true
                    Toast.makeText(
                        this@LoginActivity,
                        "Помилка з'єднання: ${t.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
        }

        // "Sign up" синім і клікабельним
        val text = "Don't have an account? Sign up"
        val spannableString = SpannableString(text)
        val start = text.indexOf("Sign up")
        val end = start + "Sign up".length

        spannableString.setSpan(
            ForegroundColorSpan(Color.parseColor("#4056F4")),
            start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
        )

        spannableString.setSpan(object : ClickableSpan() {
            override fun onClick(widget: View) {
                val intent = Intent(this@LoginActivity, RegisterActivity::class.java)
                startActivity(intent)
            }
        }, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        tvSignUp.text = spannableString
        tvSignUp.movementMethod = LinkMovementMethod.getInstance()
        tvSignUp.highlightColor = Color.TRANSPARENT

        // Для коректної роботи з інсетами (можеш видалити, якщо не треба)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }
}