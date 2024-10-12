const express = require('express')
const path = require('path')
const data = require('../../back-end/tasks.json')
const fs = require('fs')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


const app = express()
const port = 5500

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
}) 

app.get('/api/users', (req, res) => {
    res.json(data)
})

app.post('/api/users', jsonParser, (req, res) => {
    // I think I need to use req here?
    let new_tasks = req.body    
    data.push(new_tasks)
    // You need __dirname because that's the current directory
    fs.writeFileSync(__dirname + '/../../back-end/tasks.json', JSON.stringify(data, null, 2))
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})


// Tomorrow's tasks --> get a functioning backend to work (create, delete, edit as well)

// Then on Sunday --> (look to join a community perhaps to try make it more pretty)

// Figure out how to host sessions with your stuff --> or if you want to go build your social media clone
