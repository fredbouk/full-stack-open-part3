require('dotenv').config()

const express = require('express')
const app = express()

const Person = require('./models/person')

const cors = require('cors')
const morgan = require('morgan')

// middleware
app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('newPerson', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :newPerson'))

app.get('/info', (request, response) => {
  const numPersons = persons.length
  const date = new Date()
  response.send(`
  <p>Phonebook has info for ${numPersons} people</p>
  <p>${date}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {  
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Content missing - please supply a name and a number' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
