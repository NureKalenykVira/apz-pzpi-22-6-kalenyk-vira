package com.example.mobileapz

import android.app.AlertDialog
import android.view.LayoutInflater
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import com.example.mobileapz.api.Product
import com.example.mobileapz.api.ProductService
import java.text.SimpleDateFormat
import java.util.*
import android.app.NotificationManager
import android.app.NotificationChannel
import android.os.Build
import androidx.core.app.NotificationCompat
import android.util.Log

class ProductListActivity : AppCompatActivity() {
    private val products = mutableListOf<Product>()
    private lateinit var productAdapter: ProductAdapter
    private lateinit var productService: ProductService

    private var refrigeratorId: Int = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_list)

        refrigeratorId = intent.getIntExtra("FRIDGE_ID", -1)
        productService = ProductService(applicationContext)

        findViewById<ImageButton>(R.id.btnBack).setOnClickListener { finish() }

        // Підготовка адаптера
        productAdapter = ProductAdapter(products, onDelete = { product ->
            showDeleteDialog(product)
        })

        // Прив'язка RecyclerView
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerProducts)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = productAdapter

        // Кнопка додавання продукту
        findViewById<Button>(R.id.btnAddProduct).setOnClickListener {
            showAddProductDialog()
        }

        loadProducts()
    }

    private fun loadProducts() {
        if (refrigeratorId == -1) return
        productService.getProductsByRefrigerator(
            fridgeId = refrigeratorId,
            onSuccess = { list ->
                products.clear()
                products.addAll(list)
                productAdapter.notifyDataSetChanged()
                checkAndNotifyExpirations(list)
            },
            onError = { msg ->
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
            }
        )
    }

    private fun showDeleteDialog(product: Product) {
        AlertDialog.Builder(this)
            .setTitle("Confirm deleting")
            .setMessage("Are you sure you want to remove product \"${product.Name}\"?")
            .setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
            .setPositiveButton("Delete") { dialog, _ ->
                if (product.ProductID != null) {
                    productService.deleteProduct(product.ProductID,
                        onSuccess = { loadProducts() },
                        onError = { msg -> Toast.makeText(this, msg, Toast.LENGTH_SHORT).show() }
                    )
                }
                dialog.dismiss()
            }
            .show()
    }

    private fun showAddProductDialog() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_product, null)

        val etName = dialogView.findViewById<EditText>(R.id.etProductName)
        val etCategory = dialogView.findViewById<EditText>(R.id.etCategory)
        val etExpiry = dialogView.findViewById<EditText>(R.id.etExpiry)
        val etRfid = dialogView.findViewById<EditText>(R.id.etRfid)
        val btnAdd = dialogView.findViewById<Button>(R.id.btnAdd)
        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)

        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .setCancelable(false)
            .create()

        btnCancel.setOnClickListener { dialog.dismiss() }
        btnAdd.setOnClickListener {
            val name = etName.text.toString().trim()
            val category = etCategory.text.toString().trim()
            val expiry = etExpiry.text.toString().trim()
            val rfid = etRfid.text.toString().trim()

            if (name.isEmpty() || category.isEmpty()) {
                etName.error = if (name.isEmpty()) "Обов'язково" else null
                etCategory.error = if (category.isEmpty()) "Обов'язково" else null
            } else {
                val isoExpiry = try {
                    val parts = expiry.split(".")
                    if (parts.size == 3) {
                        "${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}"
                    } else {
                        expiry // fallback
                    }
                } catch (e: Exception) {
                    expiry // fallback
                }

                val product = Product(
                    ProductID = null,
                    RefrigeratorID = refrigeratorId,
                    Name = name,
                    Category = category,
                    ExpirationDate = isoExpiry,
                    RFIDTag = rfid
                )
                productService.addProduct(
                    product,
                    onSuccess = {
                        loadProducts()
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

    private fun checkAndNotifyExpirations(products: List<Product>) {
        val now = Calendar.getInstance().apply { set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0); set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0) }
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        products.forEach { product ->
            try {
                val expDate = Calendar.getInstance()
                expDate.time = sdf.parse(product.ExpirationDate) ?: return@forEach
                expDate.set(Calendar.HOUR_OF_DAY, 0)
                expDate.set(Calendar.MINUTE, 0)
                expDate.set(Calendar.SECOND, 0)
                expDate.set(Calendar.MILLISECOND, 0)

                val diffMillis = expDate.timeInMillis - now.timeInMillis
                val daysLeft = (diffMillis / (1000 * 60 * 60 * 24)).toInt()

                when (daysLeft) {
                    3 -> showNotification(
                        "Термін придатності спливає",
                        "Продукт \"${product.Name}\" спливає за 3 дні"
                    )
                    1 -> showNotification(
                        "Термін придатності спливає",
                        "Продукт \"${product.Name}\" спливає завтра"
                    )
                    0, -1, -2, -3, -4, -5 -> showNotification(
                        "Термін придатності сплив!",
                        "Продукт \"${product.Name}\" вже не придатний!"
                    )
                }
            } catch (e: Exception) {
                Log.d("EXPIRY_CHECK", "Parse error: ${product.ExpirationDate}")
            }
        }
    }

    private fun showNotification(title: String, message: String) {
        Toast.makeText(this, "$title\n$message", Toast.LENGTH_LONG).show()
    }
}