const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    payment: {
        type: Number,
        required: false,
        default: 0
    },
    productID: {
        type: String,
        required: false,

    }
});

const Cart = mongoose.model('Cart', productSchema);

module.exports = Cart;
