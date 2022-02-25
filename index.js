const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const passport = require('passport')
const Localstrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const app = express()
const ExpressError = require('./utils/ExpressError')
const cookieParser = require('cookie-parser')
const Joi = require('joi')
const User = require('./models/user')
const { isLoggedIn } = require('./middleware')
const catchAsync = require('./utils/catchAsync.js')
const MongoStore = require('connect-mongo')(session)


const store = new MongoStore({
    url: process.env.CONNECTION_URL,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24*60*60,

})

const sessionOptions = { 
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

}

const PORT = process.env.PORT || 5000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(flash())
app.use(cookieParser())

app.use(session(sessionOptions))

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const users = require('./routes/users')

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB')
    }).catch((err) => {
        console.log(err.messsage)
    })


app.use("/", users)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode= 500} = err
    if(!err.message) err.message = "oh no something went wrog"
    res.status(statusCode).render('error', {err})
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})