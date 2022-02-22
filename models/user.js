const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    transactions: [
        {
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
        }
    ]
}) 

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema)