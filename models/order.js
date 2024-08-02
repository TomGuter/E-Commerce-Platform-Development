const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    orderNo: {
        type: Number,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;