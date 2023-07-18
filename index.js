const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })


  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  
  app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has information for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
  })

  app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    if (!name || !number) {
      return response.status(400).json({ error: 'Name or number is missing' })
    }
  
    if (persons.some((person) => person.name === name)) {
      return response.status(409).json({ error: 'name must be unique' })
    }
    const newPerson = {
      name: name,
      number: number,
      id: Math.floor(Math.random() * 1000000)
    }

    persons = persons.concat(newPerson)
  
    console.log(newPerson)
    console.log(persons)
    response.json(newPerson)
  })
  

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })



  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  app.use(requestLogger)

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })