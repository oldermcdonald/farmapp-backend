const express = require('express')
const app = express()
const cors = require('cors')

// Connect to Postgresql Database
let databaseOptions = {}
if (process.env.PRODUCTION) { // heroku
  databaseOptions.connectionString = process.env.DATABASE_URL
} else {
  databaseOptions.database = 'farmapp'
}

const { Client } = require('pg')
const dbClient = new Client(databaseOptions)
dbClient.connect()

// allow requests from other domains
app.use(cors())


// Routes
app.get('/', (req, res) => {
  res.send('server running')
})


app.get('/api/todolist', (req, res) => {
  dbClient.query(`SELECT * FROM todolist`, (error, dbResponse) => {
    if (error) {
      console.log(error)
    } else {
      // console.log(dbResponse.rows[0])
      res.json(dbResponse.rows)
    }
  })
})



app.listen(8080, () => {
  console.log('Running on port 8080')
})

