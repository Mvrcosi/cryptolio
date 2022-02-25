const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const Localstrategy = require('passport-local')
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync.js')


router.get('/register', async (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res, next) => {
    try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome to cryptolio')
        res.redirect('/canvas')
    })
        } catch (err) {
            next(err)
        }
})


router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/canvas')

})

router.get("/logout", isLoggedIn, (req,res) => {
    req.logOut();
    res.redirect('/')

})


router.get('/canvas', isLoggedIn, async(req, res) => {
    const getUser = await User.findById(req.user._id)
    res.render('coins/canvas', {getUser})
})


router.post('/canvas', isLoggedIn, catchAsync(async(req, res) => {
        try {
        const { coinName, quantityPurchased, purchasePrice, purchaseFee } = req.body
        const newCoin = {coinName, quantityPurchased, purchasePrice, purchaseFee}
        const user = await User.findById(req.user._id)
        user.transactions.push(newCoin)
        user.save()
       res.redirect('/canvas')
        } catch (err) {
            next(err)
        }
}))

router.delete('/canvas/:id', isLoggedIn, async(req,res) => {
    try {
    const userFound = await User.findByIdAndUpdate(req.user._id, {
        $pull: {transactions: {_id: req.params.id}}
    })
    res.redirect('/canvas')
    } catch (err) {
        next(err)
    }
})



module.exports = router; 