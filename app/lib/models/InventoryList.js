
import mongoose from 'mongoose';
const InventoryList = new mongoose.Schema({

    Itemcode:{
        type: String,
        required: true,

    },
    Name:{
        type: String,
        required: true,
    },
    Group:{
        type:String,
        required:true,
    },
    Segment:{
        type:String,
        ref:"InventoryCategory",
        required:true,
    },
    Auditable:{
        type:String,
        enum:['Y','N'],
        required:true,
    },
    Tax:{
        type:Number,
        required:true,
    },
});
const Inventorylist= mongoose.models.InventoryList||mongoose.model("InventoryList",InventoryList);
export default Inventorylist;





}

)