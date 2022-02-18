const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')






router.get('/register', async (req,res) => {
    res.render('users/register')
 
})

router.post('/register', async (req,res) => {
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user,password);
    req.flash('success', 'Welcome to cryptolio')
    res.redirect('/login')
})

router.get('/login', async (req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req,res) => {
    res.redirect('/')
})



module.exports = router;