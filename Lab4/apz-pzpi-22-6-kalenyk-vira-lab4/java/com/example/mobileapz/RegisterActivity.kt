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
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.mobileapz.api.ApiClient
import com.example.mobileapz.api.RegisterRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val etName = findViewById<EditText>(R.id.etName)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvLogin = findViewById<TextView>(R.id.tvLogin)

        btnRegister.setOnClickListener {
            val name = etName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            // Валідація
            if (name.isEmpty()) {
                etName.error = "Введіть ім'я"
                return@setOnClickListener
            }
            if (email.isEmpty()) {
                etEmail.error = "Введіть email"
                return@setOnClickListener
            }
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                etEmail.error = "Некоректний email"
                return@setOnClickListener
            }
            if (password.length < 6) {
                etPassword.error = "Пароль має містити мінімум 6 символів"
                return@setOnClickListener
            }

            btnRegister.isEnabled = false

            val request = RegisterRequest(name, email, password)
            ApiClient.authApi.register(request).enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    btnRegister.isEnabled = true
                    if (response.isSuccessful) {
                        Toast.makeText(
                            this@RegisterActivity,
                            "Реєстрація успішна! Увійдіть у свій акаунт.",
                            Toast.LENGTH_SHORT
                        ).show()
                        startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(
                            this@RegisterActivity,
                            "Помилка реєстрації: ${response.message()}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    btnRegister.isEnabled = true
                    Toast.makeText(
                        this@RegisterActivity,
                        "Помилка з'єднання: ${t.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
        }

        // "Log in" синім і клікабельним
        val text = "Already have an account? Log in"
        val spannableString = SpannableString(text)
        val start = text.indexOf("Log in")
        val end = start + "Log in".length
        spannableString.setSpan(
            ForegroundColorSpan(Color.parseColor("#4056F4")),
            start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        spannableString.setSpan(object : ClickableSpan() {
            override fun onClick(widget: View) {
                startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                finish()
            }
        }, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        tvLogin.text = spannableString
        tvLogin.movementMethod = LinkMovementMethod.getInstance()
        tvLogin.highlightColor = Color.TRANSPARENT
    }
}