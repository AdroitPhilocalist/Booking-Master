import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  itemCategory: {
    type: String,
    required: true
  },
  itemSegment: {
    type: String,
    required: true
  },
  itemCode: {
    type: String,
    required: true,
    unique: true
  },
  itemName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  showInProfile: {
    type: String,
    enum: ['Yes (Visible)', 'No (Hidden)'],
    default: 'Yes (Visible)'
  },
  isSpecialItem: {
    type: String,
    enum: ['Yes (Editable)', 'No (Not Editable)'],
    default: 'No (Not Editable)'
  },
  discountAllowed: {
    type: String,
    enum: ['Yes (Allowed)', 'No (Not Allowed)'],
    default: 'Yes (Allowed)'
  },
  storeItemCode: {
    type: String,
    required: false
  },
  ingredientCode: {
    type: String,
    required: false
  },
}, {
  timestamps: true
});

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;

