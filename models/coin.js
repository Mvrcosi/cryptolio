const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const CoinSchema = new Schema({
    coinName: String,
    quantityPurhcased: Number,
    purchasePrice: Number,
    purchaseFee: Number

})

module.exports = mongoose.model("Coin", CoinSchema) 