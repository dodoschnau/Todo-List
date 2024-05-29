const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

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

app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.get('/', (req, res) => {
  res.render('index')
})

// Get All Todos
app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: [`id`, `name`, `isComplete`],
    raw: true
  })
    .then((todos) => res.render('todos', { todos, message: req.flash('success') }))
    .catch((err) => res.status(422).json(err))
})

// Get Create Page
app.get('/todos/new', (req, res) => {
  res.render('new')
})

// Get Index Todo
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => { res.render('todo', { todo, message: req.flash('success') }) })
    .catch((err) => { console.log(err) })
})

// Get Edit Page
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => { res.render('edit', { todo }) })
    .catch((err) => { console.log(err) })
})

// Create
app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => {
      req.flash('success', '新增成功！')
      return res.redirect('/todos')
    })
    .catch((err) => { console.log(err) })
})

// Edit
app.put('/todos/:id', (req, res) => {
  const { name, isComplete } = req.body
  const id = req.params.id
  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('success', '編輯完成！')
      return res.redirect(`/todos/${id}`)
    })
})

//Delete
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功！')
      return res.redirect('/todos')
    })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})