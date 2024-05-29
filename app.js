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
  try {
    return Todo.findAll({
      attributes: [`id`, `name`, `isComplete`],
      raw: true
    })
      .then((todos) => res.render('todos', { todos, message: req.flash('success'), error: req.flash('error') }))
      .catch((err) => {
        console.err(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

// Get Create Page
app.get('/todos/new', (req, res) => {
  try {
    res.render('new', { error: req.flash('error') })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

// Get Index Todo
app.get('/todos/:id', (req, res) => {
  try {
    const id = req.params.id
    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => { res.render('todo', { todo, message: req.flash('success') }) })
      .catch((err) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

// Get Edit Page
app.get('/todos/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => { res.render('edit', { todo, error: req.flash('error') }) })
      .catch((err) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

// Create
app.post('/todos', (req, res) => {
  try {
    const name = req.body.name
    return Todo.create({ name })
      .then(() => {
        req.flash('success', '新增成功！')
        return res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '新增失敗！')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

// Edit
app.put('/todos/:id', (req, res) => {
  try {
    const { name, isComplete } = req.body
    const id = req.params.id
    return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
      .then(() => {
        req.flash('success', '編輯完成！')
        return res.redirect(`/todos/${id}`)
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '編輯失敗！')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

//Delete
app.delete('/todos/:id', (req, res) => {
  try {
    const id = req.params.id
    return Todo.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '刪除成功！')
        return res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '刪除失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})