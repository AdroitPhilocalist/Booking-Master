import mongoose from "mongoose";

const restaurantInvoiceSchema = new mongoose.Schema({

    invoiceno:{
        type:Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required:true
    },
    custname:{
        type:String,
        required:true
    },
    totalamt:{
        type:Number,
        required: true        
    },
    gst:{
        type:Number,
        required: true
    },
    payableamt:{
        type:Number,
        required: true
        
    }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.roominvoice||mongoose.modelName('restaurantinvoice',restaurantInvoiceSchema);