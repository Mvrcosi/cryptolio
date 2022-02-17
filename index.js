const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const ejsMate = require('ejs-mate')
const { engine } = require('express/lib/application')
const e = require('express')

const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000;


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB')
    }).catch((err) => {
        console.log(err.messsage)
    })




app.get('/', (req, res) => {

    res.render('home')

})









app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})