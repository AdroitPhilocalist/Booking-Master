// models/stockreport.js
import mongoose from "mongoose";

const stockReportSchema = new mongoose.Schema({
  purchaseorderno: {
    type: String,
    required: true
  },
  purchasedate: {
    type: Date,
    required: true
  },
  Invoiceno: {
    type: String,
    required: true
  },
  quantity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryList',
    required: true
  },
  quantityAmount: {
    type: Number,
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryList',
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  taxpercent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryList',
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  purorsell: {
    type: String,
    enum: ['purchase', 'sell'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.StockReport || mongoose.model('StockReport', stockReportSchema);