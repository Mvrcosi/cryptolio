const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const CoinSchema = new Schema({

    coinName: String,
    coinPurchasePrice: Number,
    purchaseAmount: Number

})

module.exports = mongoose.model("Coin", CoinSchema)