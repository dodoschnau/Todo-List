const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
  res.render('index')
})


router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

// login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

// logout
router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }
    req.flash('success', '登出成功！')
    return res.redirect('/login')
  })
})

module.exports = router