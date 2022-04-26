const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json()) // para poder parsear las request

app.use(logger)

let notes = [
  {
    id: 1,
    content: ' asdasgfkj  ajshbvcajhsc asdas d :D',
    date: '2020-05-30T17:30:31.098z',
    important: true
  },
  {
    id: 2,
    content: ' zxcvzxc zxcvzxcvzx zxcvzxcvxz ',
    date: '2019-05-30T17:30:31.098z',
    important: false
  },
  {
    id: 3,
    content: ' yuiyu yuiyuiyui yuiyuiyuiy',
    date: '2022-05-30T17:30:31.098z',
    important: true
  }
]

// const server = http.createServer((request, response) => {
//   response.statusCode = 200;
//   response.setHeader('Content-Type', 'application/json');
//   response.end(JSON.stringify(notes));
// });

app.get('/', (request, response) => {
  response.send(`<h1>Hello World!</h1>
            <a href="/api/notes">Notes</a>
    `)
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'not found'
  })
})

const PORT = process.env.PORT || 3000
const hostname = '127.0.0.1'

app.listen(PORT, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`)
})
