const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
const Todo = db.Todo

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/todos', (req, res) => {
  return Todo.findAll()
    .then((todos) => res.send({ todos }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  res.send('create a todo')
})

app.get('/todos/:id', (req, res) => {
  res.send(`get todo : ${req.params.id}`)
})

app.get('/todos/:id/edit', (req, res) => {
  res.send(`get todo edit : ${req.params.id}`)
})

app.post('/todos', (req, res) => {
  res.send('add todo')
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