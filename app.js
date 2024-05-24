const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()

const port = 3000

const db = require('./models')
const { raw } = require('mysql2')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => { res.render('todo', { todo }) })
    .catch((err) => { console.log(err) })
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => { res.render('edit', { todo }) })
    .catch((err) => { console.log(err) })
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => { res.redirect('/todos') })
    .catch((err) => { console.log(err) })
})

app.put('/todos/:id', (req, res) => {
  const body = req.body
  const id = req.params.id
  return Todo.update({ name: body.name }, { where: { id } })
    .then(() => { res.redirect(`/todos/${id}`) })
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.destroy({ where: { id } })
    .then(() => { res.redirect('/todos') })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})