const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

//mongoDB
const mongoose = require('mongoose')

const url = `mongodb+srv://fullstack:xxxxxx@cluster0.3d2dnz1.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//

const app = express()

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

  if (persons.some(person => person.name.toUpperCase() === body.name.toUpperCase())) {
    return response.status(400).json({ 
      error: `A person with name ${body.name} is already added to the phonebook. Please supply a unique name.` 
    })
  }

  const randomId = Math.floor(Math.random() * (1000 - 5) + 5)
  
  const person = request.body  
  person.id = randomId

  persons = persons.concat(person) 

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
