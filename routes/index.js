const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

const root = require('./root')
const oauth = require('./oauth')
const todos = require('./todos')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/', root)
router.use('/oauth', oauth)
router.use('/todos', authHandler, todos)
router.use('/users', users)


module.exports = router