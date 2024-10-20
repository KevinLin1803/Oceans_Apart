const express = require('express')
const path = require('path')
// Why do or do these need to be constants?
var data = require('../../back-end/tasks.json')
const fs = require('fs')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const app = express()
const port = 5500

app.use(express.static(__dirname))
app.use(express.static(__dirname + '/icons'))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
}) 

app.get('/api/users', (req, res) => {
    res.json(data)
})

app.post('/api/users', jsonParser, (req, res) => {
    let new_tasks = req.body    
    data.push(new_tasks)
    // You need __dirname because that's the current directory
    fs.writeFileSync(__dirname + '/../../back-end/tasks.json', JSON.stringify(data, null, 2))

    res.json()
})

// When are we supposed to use delete?
app.post('/api/removetask', jsonParser, (req, res) => {
    let id_to_remove = req.body
    console.log('tasks before:', data)   

    // No idea why this filter function doesn't work
    // const new_data = data.filter((task) => {
    //     task.id !== id_to_remove.id
    // })

    var new_data = []

    for (task of data) {
        console.log(task.id, id_to_remove.id, task.id != id_to_remove.id)
        if (task.id != id_to_remove.id) {
            new_data.push(task)
        }
    }

    data = new_data
    console.log('tasks after:', data)

    // You need __dirname because that's the current directory
    fs.writeFileSync(__dirname + '/../../back-end/tasks.json', JSON.stringify(data, null, 2))

    // All server requests have to return a response. Doesn't always need to carry data
    res.json()
})


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

// How is it appending these extra genders? 

// Improvements --> make the above work + add in a little bar for progression and kiss
// Then you can send it to the gurl and just let it run like that :) --> saves for each browser

// Today --> partial functinolaity --> but still worked well on the task :). Also got in contact with Hayden :)

// I want to connect it 
// Perfect the add
// And then I can work on the other requests
// Then we'll have something kinda cool to work with --> sus out tutorials/contacting other peoeple as well :)
// Work on being as smart and efficient with your applicatino as possible

// Tomorrow's tasks --> get a functioning backend to work (create, delete, edit as well)

// Then on Sunday --> (look to join a community perhaps to try make it more pretty)

// Figure out how to host sessions with your stuff --> or if you want to go build your social media clone
