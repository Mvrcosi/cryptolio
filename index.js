const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Coin = require('./models/coin')
const User = require('./models/user')
const passport = require('passport')
const Localstrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')

const sessionOptions = { secret: "secret", resave: false, saveUninitialized: false }

const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000;


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(flash())
app.use(session(sessionOptions))
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// app.use(passport.initialize())
// app.use(passport.session())
// passport.use(new Localstrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())



mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB')
    }).catch((err) => {
        console.log(err.messsage)
    })




app.get('/', (req, res) => {

    res.render('home')

})


// app.get('/coins', async (req, res) => {

//     const coins = await Coin.find({})
//     res.render('coins/index', { coins })

// })

// app.get('/coins/new', async (req, res) => {
//     res.render('coins/new')

// })

// app.post('/coins', async (req, res) => {

//     const coin = new Coin(req.body.coin)
//     await coin.save()
//     res.redirect(`/coins/${coin._id}`)

// })

// app.get('/coins/:id', async (req, res) => {
//     const coin = await Coin.findById(req.params.id)
//     res.render('coins/show', { coin })

// })

// app.get('/coins/:id/edit', async (req, res) => {
//     const coin = await Coin.findById(req.params.id)

//     res.render('coins/edit', { coin })

// })

// app.put('/coins/:id', async (req, res) => {
//     const { id } = req.params
//     const coin = await Coin.findByIdAndUpdate(id, { ...req.body.coin }, { new: true })
//     res.redirect(`/coins/${coin._id}`)
// })

// app.delete('/coins/:id', async (req, res) => {
//     const { id } = req.params
//     await Coin.findByIdAndDelete(id)
//     res.redirect(`/coins`)

// })










app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})