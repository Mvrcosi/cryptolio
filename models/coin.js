const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const CoinSchema = new Schema({
    coinName: {
        type: String,
        required: true
    },
    quantityPurchased: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    purchaseFee: {
        type:'Number',
    }

})

module.exports = mongoose.model("Coin", CoinSchema) 