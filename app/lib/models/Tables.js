// models/Table.js

import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  tableNo: {
    type: String,
    required: true,
  },
  pos: {
    type: String,
    required: true,
  },
  active: {
    type: String,
    enum: ['yes', 'no'],  // Restricts values to 'yes' or 'no'
    default: 'yes',       // Sets default value to 'yes'
  },
  username: {  // New field
    type: String,
    required: true,
  },
});

export default mongoose.models.Table || mongoose.model('Table', TableSchema);


