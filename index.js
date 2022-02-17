const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')


const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000;



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname))



mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB')
    }).catch((err) => {
        console.log(err.messsage)
    })




app.get('/', (req, res) => {
    res.render('home.ejs')
})



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})