// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  services: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  }],
  date: {
    type: Date,
    required: [true, 'Buyurtma sanasi kiritilishi shart'],
    default: Date.now,
  },
}, {
  timestamps: true, // createdAt va updatedAt maydonlarini avtomatik qo‘shadi
});

module.exports = mongoose.model('Order', orderSchema);