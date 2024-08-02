const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    totalSum: {
        type: Number,
        required: true,
    },
});

const Price = mongoose.model('Price', productSchema);

module.exports = Price;