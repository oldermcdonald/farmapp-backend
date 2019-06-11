const express = require('express')
const app = express()


// Connect to Postgresql Database
let databaseOptions = {}
if (process.env.PRODUCTION) {
  databaseOptions.connectionString = process.env.DATABASE_URL
} else {
  databaseOptions.database = 'farmapp'
}

const { Client } = require('pg')
const client = new Client(databaseOptions)
client.connect()


function connectDb() {
  if(!client.connection.stream.connecting){
    client.connect()
  }
  console.log(`Connection Status: ${client.connection.stream.connecting}`)
}


// Routes
app.get('/', (req, res) => {
  res.send('server running')
})

app.get('/api/todolist', (req, res) => {
  // connectDb()
  client.query(`SELECT * FROM todolist`, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res.rows[0])
    }
  })
})



app.listen(8080, () => {
  console.log('Running on port 8080')
})

