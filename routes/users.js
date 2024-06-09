const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User


router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/', (req, res) => {
  res.send(req.body)
})

router.post('/login', (req, res) => {
  res.send(req.body)
})

router.post('/logout', (req, res) => {
  res.send('logout')
})


module.exports = router