const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Coin = require('../models/coin')
const passport = require('passport')
const Localstrategy = require('passport-local')
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync.js')




router.get('/register', async (req, res) => {

    res.render('users/register')

})

router.post('/register', async (req, res, next) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome to cryptolio')
        res.redirect('/canvas')
    })
    
})

router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/canvas')

})

router.get("/logout", (req,res) => {
    req.logOut();
    res.redirect('/')

})


router.get('/canvas', isLoggedIn, async(req, res) => {
    const coins = await Coin.find({})
    res.render('coins/canvas', {coins})
})



router.post('/canvas', catchAsync(async(req, res) => {
        const { coinName, quantityPurchased, purchasePrice, purchaseFee } = req.body
        const coin = new Coin({ coinName, quantityPurchased, purchasePrice, purchaseFee })
        coin.save()
        res.redirect('/canvas')
}))



module.exports = router; 