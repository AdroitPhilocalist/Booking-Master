import mongoose from "mongoose";
const Stockreport = new mongoose.Schema(
    {
        purchaseorderno:
        {
            type:String,
            required: true,
            unique: true,
        },
        purchasedate:
        {
            type:Date,
            required:true,
        },
        Invoiceno:
        {
            type:String,
            required:true,
            unique:true,
        },
        quantity:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'InventoryList',
            required:true,
        },
        unit:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'InventoryList',
            required:true,            
        },
        rate:
        {
            type:Number,

            required:true,
        },
        taxpercent:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'InventoryList',
            required:true,
        },
        total:
        {
            type:Number,
            required:true,
        },
        purorsell:
        {
            type:String,
            enum: ['purchase', 'sell'],
            required:true,
        },
    },
    {
        timestamps: true,
    }
);   

const StockReport = mongoose.models.StockReport || mongoose.model("StockReport", Stockreport);

export default StockReport; 










