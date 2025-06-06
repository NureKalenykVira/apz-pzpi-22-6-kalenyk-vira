package com.example.mobileapz

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobileapz.api.Refrigerator
import com.example.mobileapz.api.RefrigeratorService
import com.example.mobileapz.api.AuthService
import android.content.res.Configuration
import java.util.Locale

class FridgesActivity : AppCompatActivity() {
    private val fridges = mutableListOf<Refrigerator>()
    private lateinit var fridgeAdapter: FridgeAdapter
    private lateinit var refrigeratorService: RefrigeratorService
    private lateinit var authService: AuthService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_fridges)

        authService = AuthService(applicationContext)
        refrigeratorService = RefrigeratorService(applicationContext)

        fridgeAdapter = FridgeAdapter(
            fridges,
            onDelete = { fridge -> askDeleteFridge(fridge) },
            onEdit = { fridge -> showEditFridgeDialog(fridge) },
            onProducts = { fridge ->
                val intent = Intent(this, ProductListActivity::class.java)
                intent.putExtra("FRIDGE_ID", fridge.RefrigeratorID)
                intent.putExtra("FRIDGE_NAME", fridge.Name)
                startActivity(intent)
            },
            onAnalytics = { fridge ->
                val intent = Intent(this, AnalyticsActivity::class.java)
                intent.putExtra("FRIDGE_ID", fridge.RefrigeratorID)
                intent.putExtra("FRIDGE_NAME", fridge.Name)
                startActivity(intent)
            }
        )

        findViewById<RecyclerView>(R.id.recyclerFridges).apply {
            layoutManager = LinearLayoutManager(this@FridgesActivity)
            adapter = fridgeAdapter
        }

        findViewById<Button>(R.id.btnAddFridge).setOnClickListener {
            showAddFridgeDialog()
        }

        findViewById<Button>(R.id.btnLogout)?.setOnClickListener {
            authService.logout()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
        loadRefrigerators()
    }

    private fun setLocale(lang: String) {
        val prefs = getSharedPreferences("settings", MODE_PRIVATE)
        prefs.edit().putString("lang", lang).apply()
        val locale = Locale(lang)
        Locale.setDefault(locale)
        val config = Configuration(resources.configuration)
        config.setLocale(locale)
        resources.updateConfiguration(config, resources.displayMetrics)
        recreate()
    }

    private fun loadRefrigerators() {
        refrigeratorService.getRefrigerators(
            onSuccess = { list ->
                fridges.clear()
                fridges.addAll(list)
                fridgeAdapter.notifyDataSetChanged()
            },
            onError = { msg ->
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
            }
        )
    }

    private fun showAddFridgeDialog() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_fridge, null)
        val etName = dialogView.findViewById<EditText>(R.id.etFridgeName)
        val etLocation = dialogView.findViewById<EditText>(R.id.etFridgeLocation)
        val btnAdd = dialogView.findViewById<Button>(R.id.btnSave)
        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .setCancelable(false)
            .create()
        btnCancel.setOnClickListener { dialog.dismiss() }
        btnAdd.setOnClickListener {
            val name = etName.text.toString().trim()
            val location = etLocation.text.toString().trim()
            if (name.isEmpty() || location.isEmpty()) {
                etName.error = if (name.isEmpty()) "Обов'язково" else null
                etLocation.error = if (location.isEmpty()) "Обов'язково" else null
            } else {
                refrigeratorService.createRefrigerator(
                    name = name,
                    location = location,
                    onSuccess = {
                        Toast.makeText(this, "Додано!", Toast.LENGTH_SHORT).show()
                        loadRefrigerators()
                        dialog.dismiss()
                    },
                    onError = { msg ->
                        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }
        dialog.show()
    }

    private fun showEditFridgeDialog(fridge: Refrigerator) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_edit_fridge, null)
        val etName = dialogView.findViewById<EditText>(R.id.etFridgeName)
        val etLocation = dialogView.findViewById<EditText>(R.id.etFridgeLocation)
        etName.setText(fridge.Name)
        etLocation.setText(fridge.Location)
        val btnSave = dialogView.findViewById<Button>(R.id.btnSave)
        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .setCancelable(false)
            .create()
        btnCancel.setOnClickListener { dialog.dismiss() }
        btnSave.setOnClickListener {
            val newName = etName.text.toString().trim()
            val newLocation = etLocation.text.toString().trim()
            if (newName.isEmpty() || newLocation.isEmpty()) {
                etName.error = if (newName.isEmpty()) "Обов'язково" else null
                etLocation.error = if (newLocation.isEmpty()) "Обов'язково" else null
            } else if (fridge.RefrigeratorID != null) {
                refrigeratorService.updateRefrigerator(
                    id = fridge.RefrigeratorID,
                    name = newName,
                    location = newLocation,
                    onSuccess = {
                        Toast.makeText(this, "Оновлено!", Toast.LENGTH_SHORT).show()
                        loadRefrigerators()
                        dialog.dismiss()
                    },
                    onError = { msg ->
                        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }
        dialog.show()
    }

    private fun askDeleteFridge(fridge: Refrigerator) {
        AlertDialog.Builder(this)
            .setTitle("Підтвердити видалення")
            .setMessage("Ви впевнені, що хочете видалити холодильник \"${fridge.Name}\"?")
            .setNegativeButton("Скасувати") { dialog, _ -> dialog.dismiss() }
            .setPositiveButton("Видалити") { dialog, _ ->
                if (fridge.RefrigeratorID != null) {
                    refrigeratorService.deleteRefrigerator(
                        fridge.RefrigeratorID,
                        onSuccess = {
                            Toast.makeText(this, "Видалено", Toast.LENGTH_SHORT).show()
                            loadRefrigerators()
                        },
                        onError = { msg -> Toast.makeText(this, msg, Toast.LENGTH_SHORT).show() }
                    )
                }
                dialog.dismiss()
            }
            .show()
    }
}
