const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const passport = require('passport')
const Localstrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const sessionOptions = { secret: "secret", resave: false, saveUninitialized: false }
const bodyParser = require('body-parser')
const app = express()
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const User = require('./models/user')
const { isLoggedIn } = require('./middleware')
const catchAsync = require('./utils/catchAsync.js')


// ROUTES

// const userRoutes = require('./routes/users')




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

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB')
    }).catch((err) => {
        console.log(err.messsage)
    })



   



// app.use('/', userRoutes)


app.get('/register', async (req, res) => {

    res.render('users/register')

})

app.post('/register', async (req, res, next) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome to cryptolio')
        res.redirect('/canvas')
    })
    
})

app.get('/login', (req, res) => {
    res.render('users/login')
})


app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/canvas')

})

app.get("/logout", (req,res) => {
    req.logOut();
    res.redirect('/')

})


app.get('/canvas', isLoggedIn, async(req, res) => {

    const getUser = await User.findById(req.user._id)
    res.render('coins/canvas' , {getUser})
    
    

})



app.post('/canvas', isLoggedIn, catchAsync(async(req, res) => {
        const { coinName, quantityPurchased, purchasePrice, purchaseFee } = req.body
        const newCoin = {coinName, quantityPurchased, purchasePrice, purchaseFee}
        const user = await User.findById(req.user._id)
        user.transactions.push(newCoin)
        user.save()
       res.redirect('/canvas')
}))




app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})