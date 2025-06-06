package com.example.mobileapz

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.mobileapz.api.Product

class ProductAdapter(
    private val products: List<Product>,
    private val onDelete: (Product) -> Unit
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    inner class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvName: TextView = itemView.findViewById(R.id.tvProductName)
        val tvCategory: TextView = itemView.findViewById(R.id.tvProductCategory)
        val tvExpiry: TextView = itemView.findViewById(R.id.tvExpiry)
        val tvRfid: TextView = itemView.findViewById(R.id.tvRFID)
        val btnDelete: Button = itemView.findViewById(R.id.btnDeleteProduct)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_product, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = products[position]
        holder.tvName.text = product.Name
        holder.tvCategory.text = "(${product.Category})"
        holder.tvExpiry.text = "Expiration date: ${product.ExpirationDate}"
        holder.tvRfid.text = "RFID: ${product.RFIDTag}"
        holder.btnDelete.setOnClickListener { onDelete(product) }
    }

    override fun getItemCount() = products.size
}