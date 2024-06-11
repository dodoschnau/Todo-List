const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
const passport = require('passport')

const app = express()

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.SESSION_SECRET)

const port = 3000

const { raw } = require('mysql2')
const router = require('./routes')

app.engine('.hbs', engine({ extname: '.hbs' }))

app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(passport.initialize())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)



app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})