const express = require('express')
const app = express()
const cors = require('cors')
const { Client } = require('pg')
const bodyParser = require('body-parser')

// Connect to Postgresql Database
let databaseOptions = {}
if (process.env.PRODUCTION) { // heroku
  databaseOptions.connectionString = process.env.DATABASE_URL
} else {
  databaseOptions.database = 'farmapp'
}

const dbClient = new Client(databaseOptions)
dbClient.connect()

// allow requests from other domains
app.use(cors())




// Database functions

const getToDoItemsFromDB = (req, res) => {
  dbClient.query(`SELECT * FROM todolist`, (error, dbResponse) => {
    if (error) {
      console.log(error)
    } else {
      // console.log(dbResponse.rows[0])
      res.json(dbResponse.rows)
    }
  })
}

// add item to DB!
const addToDoItemToDB = (req, res) => {
  const { title, category, details, location, lat, long} = req.body
  console.log(req.body)
  dbClient.query(`INSERT INTO todolist (title, category, details, location, lat, long) VALUES ($1, $2, $3, $4, $5, $6)`, [title, category, details, location, parseFloat(lat), parseFloat(long)], (error, dbResponse) => {
    if (error) {
      console.log(error)
    } else {
      res.json(dbResponse.rows)
    }
  })
}


// middleware

// https://github.com/expressjs/body-parser
// support parsing of application/json type post data
app.use(bodyParser.json())
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))



// Routes
app.get('/', (req, res) => {
  res.send('server running')
})

app.get('/api/todolist', getToDoItemsFromDB)

app.post('/api/todolist', addToDoItemToDB)




app.listen(8080, () => {
  console.log('Running on port 8080')
})

