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

// register
router.post('/', (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body

  if (!email || !password) {
    req.flash('error', 'email及password為必填！')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '密碼與驗證密碼不相符！')
    return res.redirect('back')
  }

  return User.count({ where: { email } })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash('error', '該email已被註冊！')
        return
      }
      return User.create({ userName, email, password })
    })
    .then((user) => {
      // when creating user failed
      if (!user) {
        return res.redirect('back')
      }
      req.flash('success', '註冊成功！')
      return res.redirect('/users/login')
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗:('
      next(error)
    })
})

// login
router.post('/login', (req, res) => {
  return res.send(req.body)
})

// logout
router.post('/logout', (req, res) => {
  return res.send('logout')
})


module.exports = router