package com.example.mobileapz

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Button
import androidx.recyclerview.widget.RecyclerView
import com.example.mobileapz.api.Refrigerator

class FridgeAdapter(
    private val fridges: List<Refrigerator>,
    private val onDelete: (Refrigerator) -> Unit,
    private val onEdit: (Refrigerator) -> Unit,
    private val onProducts: (Refrigerator) -> Unit,
    private val onAnalytics: (Refrigerator) -> Unit
) : RecyclerView.Adapter<FridgeAdapter.FridgeViewHolder>() {

    inner class FridgeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvName: TextView = itemView.findViewById(R.id.tvFridgeName)
        val tvLocation: TextView = itemView.findViewById(R.id.tvLocation)
        val btnDelete: ImageButton = itemView.findViewById(R.id.btnDelete)
        val btnEdit: ImageButton = itemView.findViewById(R.id.btnEdit)
        val btnProducts: Button = itemView.findViewById(R.id.btnProducts)
        val btnAnalytics: Button = itemView.findViewById(R.id.btnViewAnalytics)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FridgeViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_fridge, parent, false)
        return FridgeViewHolder(view)
    }

    override fun onBindViewHolder(holder: FridgeViewHolder, position: Int) {
        val fridge = fridges[position]
        holder.tvName.text = fridge.Name
        holder.tvLocation.text = fridge.Location

        holder.btnDelete.setOnClickListener { onDelete(fridge) }
        holder.btnEdit.setOnClickListener { onEdit(fridge) }
        holder.btnProducts.setOnClickListener { onProducts(fridge) }
        holder.btnAnalytics.setOnClickListener { onAnalytics(fridge) }
    }

    override fun getItemCount() = fridges.size
}