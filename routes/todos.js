const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

// Get All Todos
router.get('/', (req, res) => {
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
router.get('/new', (req, res) => {
  try {
    res.render('new', { error: req.flash('error') })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

// Get Index Todo
router.get('/:id', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router