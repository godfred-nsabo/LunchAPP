const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    redeemed: {
        type: Number
    },
    status: {
        type: String,
        default: 'Active'
    },
    created_at: String
});

module.exports = mongoose.model('Coupon', couponSchema);