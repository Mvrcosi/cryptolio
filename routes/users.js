const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Coin = require('../models/coin')
const passport = require('passport')
const Localstrategy = require('passport-local')
const { isLoggedIn } = require('../middleware')

router.get('/register', async (req, res) => {
    res.render('users/register')

})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Welcome to cryptolio')
    res.redirect('/login')
})

router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/canvas')

})



router.get('/canvas', isLoggedIn, (req, res) => {
    res.render('coins/canvas')
})


router.post('/canvas/:id/coin', (req, res) => {
    const { coinName, quantityPurchased, purchasePrice, purchaseFee } = req.body
    const coin = new Coin({ coinName, quantityPurchased, purchasePrice, purchaseFee })
    coin.save()
    req.flash('success', 'Coin Added')
    res.redirect('/canvas')

})


module.exports = router; 