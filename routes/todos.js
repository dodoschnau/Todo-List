const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

// Get All Todos
router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10
  const userId = req.user.id

  return Todo.findAll({
    attributes: [`id`, `name`, `isComplete`],
    where: { userId },
    offset: (page - 1) * limit,
    limit,
    raw: true
  })
    .then((todos) => res.render('todos', {
      todos,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page
    }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

// Get Create Page
router.get('/new', (req, res) => {
  return res.render('new')
})

// Get Index Todo
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }
      if (todo.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/todos')
      }
      res.render('todo', { todo })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

// Get Edit Page
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料')
        res.redirect('/todos')
      }
      if (todo.userId !== userId) {
        req.flash('error', '權限不足😵')
        res.redirect('/todos')
      }
      res.render('edit', { todo })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// Create
router.post('/', (req, res, next) => {
  const name = req.body.name
  const userId = req.user.id

  return Todo.create({ name, userId })
    .then(() => {
      req.flash('success', '新增成功！')
      return res.redirect('/todos')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

// Edit
router.put('/:id', (req, res, next) => {
  const { name, isComplete } = req.body
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }
      if (todo.userId !== userId) {
        req.flash('error', '權限不足😵')
        return res.redirect('/todos')
      }
      return todo.update({ name, isComplete: isComplete === 'completed' })
        .then(() => {
          req.flash('success', '編輯完成！')
          return res.redirect(`/todos/${id}`)
        })
    })
    .catch((error) => {
      error.errorMessage = '編輯失敗:('
      next(error)
    })
})

// Delete
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId']
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }
      if (todo.userId !== userId) {
        req.flash('error', '權限不足😵')
        return res.redirect('/todos')
      }
      return todo.destroy()
        .then(() => {
          req.flash('success', '刪除成功！')
          return res.redirect('/todos')
        })
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router