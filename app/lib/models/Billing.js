import mongoose from 'mongoose';

const BillingSchema = new mongoose.Schema({
    roomNo: { type: String, ref: 'Room', required: true },
    itemList: { type: [String], required: true },
    priceList: { type: [Number], required: true },
    // New quantityList field
    quantityList: { 
        type: [Number], 
        required: true,
        validate: {
            validator: function(quantities) {
                return quantities.every(qty => qty > 0);
            },
            message: 'Quantity values must be positive numbers'
        }
    },
    taxList: { 
        type: [Number], 
        default: [], 
        validate: { 
            validator: function(taxes) {
                return taxes.every(tax => tax >= 0); 
            }, 
            message: 'Tax values must be non-negative numbers' 
        } 
    },
    billStartDate: { type: Date, ref: 'NewBooking', required: true },
    billEndDate: { type: Date, ref: 'NewBooking', required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    amountAdvanced: { type: Number, default: 0 },
    dueAmount: { 
        type: Number, 
        default: function() { 
            return this.totalAmount - this.amountAdvanced; 
        } 
    },
    Bill_Paid: { type: String, enum: ['yes', 'no'], default: 'no' },
    DateOfPayment: { type: [Date], default: [] },
    ModeOfPayment: { 
        type: [String], 
        default: [], 
        validate: { 
            validator: function(modes) { 
                const validModes = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Other']; 
                return modes.every((mode) => validModes.includes(mode)); 
            }, 
            message: 'Invalid mode of payment. Allowed values are UPI, Cash, Credit Card, Debit Card, Net Banking, or Other.' 
        } 
    },
    AmountOfPayment: { type: [Number], default: [] }
}, { timestamps: true });

const Billing = mongoose.models.Billing || mongoose.model('Billing', BillingSchema);
export default Billing;