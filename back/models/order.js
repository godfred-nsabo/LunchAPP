const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      productId: { type: Object, required: true },
      product: { type: String, required: true},
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      ref: 'User'
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  // payment: {
  //   type: String,
  //   required: true
  // }
});

module.exports = mongoose.model('Order', orderSchema);
