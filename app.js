const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

const db = require('./models')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: [`id`, `name`],
    raw: true
  })
    .then((todos) => res.render('todos', { todos }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})

app.get('/todos/:id', (req, res) => {
  res.send(`get todo : ${req.params.id}`)
})

app.get('/todos/:id/edit', (req, res) => {
  res.send(`get todo edit : ${req.params.id}`)
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => { res.redirect('/todos') })
    .catch((err) => { console.log(err) })
})

app.put('/todos/:id', (req, res) => {
  res.send(`modify todo : ${req.params.id}`)
})

app.delete('/todos/:id', (req, res) => {
  res.send(`delete todo : ${req.params.id}`)
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})