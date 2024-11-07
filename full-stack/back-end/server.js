const express = require('express')
const app = express()
const port = 5500
const pool = require('./db.js')
const cors = require('cors')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors())

const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Update to your React app's URL
      methods: ["GET", "POST", "DELETE", "PUT"]
    }
  });


app.get('/tasks/:session_id', async (req, res) => {
    var {session_id} = req.params
    
    try {
        const data = await pool.query(`Select * from "Tasks" WHERE session_id = $1`, [session_id])
        res.json(data.rows)
    } catch (error) {
        console.error(error)
    }
})

app.post('/tasks', jsonParser, async (req, res) => {
    var {id, session_id, title, date, gender} = req.body
    id = Date.now()

    try {
        await pool.query(`INSERT INTO "Tasks" (id, session_id, title, date, gender) VALUES ($1, $2, $3, $4, $5)`, 
            [id, session_id, title, date, gender])
        
        io.emit("db_update","")
    } catch (error) {
        console.error(error)
    }

    res.json()
})

app.delete('/tasks/:id', async (req, res) => {
    var {id} = req.params

    try {
        await pool.query(`DELETE FROM "Tasks" WHERE id = $1`, [id])
        io.emit("db_update","")
    } catch (error) {
        console.error(error)
    }

    res.json()
})

app.post('/signup', jsonParser, async (req, res) => {
    var {email, password} = req.body

    try {
        await pool.query(`INSERT INTO "Users" (user_email, password) VALUES ($1, $2)`, 
            [email, password])

        const token = jwt.sign({
            data: email
          }, 'secret', { expiresIn: '1h' });

        res.json({token, email})

    } catch (error) {
        console.error(error)
    }
})

app.post('/login', jsonParser, async (req, res) => {
    var {email, password} = req.body

    try {
        console.log(email)
        const user = await pool.query(`SELECT * FROM "Users" WHERE "Users".user_email = $1`, 
            [email])

        if (user.rows.length == 0) {
            return res.json({details: "User does not exist"})
        }

        if (password !== user.rows[0].password) {
            return res.json({details: "Incorrect password"})
        }
        
        const token = jwt.sign({
            data: email
          }, 'secret', { expiresIn: '1h' });

        res.json({token, email})

    } catch (error) {
        console.error(error)
    }
})

app.put('/progressbar', jsonParser, async (req, res) => {
    var {session_id, task_target, complete_task} = req.body

    try {
        if (task_target) {
            await pool.query(`UPDATE "Progressbars" as p SET tasks_target = $1 WHERE p.session_id = $2`, 
                [task_target, session_id])
        } else {
            await pool.query(`UPDATE "Progressbars" as p SET completed_tasks = completed_tasks + 1 WHERE p.session_id = $1`, 
                [session_id])
        }

        io.emit("progress_update","")

    } catch (error) {
        console.error(error)
    }
});

app.get('/progressbar/:session_id', jsonParser, async (req, res) => {
    var {session_id} = req.params
    console.log('session id is', session_id)

    try {
        const data = await pool.query(`SELECT tasks_target, completed_tasks FROM "Progressbars" as p where p.session_id = $1`, 
            [session_id])

        console.log('data from the query is', data.rows)
        
        res.json(data.rows)
        
        } catch (error) {
        console.error(error)
    }
});

app.post('/createsession', jsonParser, async (req, res) => {
    var id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    try {
        await pool.query(`INSERT INTO "Sessions" (session_id) VALUES ($1)`, [id])

        await pool.query(`INSERT INTO "Progressbars" (session_id, completed_tasks, tasks_target) VALUES ($1, $2, $3)`,
            [id, 0 , 10]
        )
  
        res.json({"session": id})
        
    } catch (error) {
        console.error(error)
        return res.json({"data": "Error creating session:" + error })
    }
});

app.get('/joinsession/:id', jsonParser, async (req, res) => {
    var {id} = req.params

    var token = Date.now().toString(36) + Math.random().toString(36).substring(2);

    try {
        await pool.query(`SELECT session_id FROM "Sessions" WHERE session_id = $1 `, [id])
        
        res.json({"session": token})
        
    } catch (error) {
        console.error(error)
        return res.json({"data": "Error joining session:" + error })
    }
});

// Since we don't have that myny users and that tasks aren't being uploaded that frquently, polling may be better here actulaly
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

// TESTING --> using the same email to signup twice

// THINGS YOU HAVE TO DO --> ensure passwords have to match and also that you can only sign up once for each email
// FOR SECURITY REASONS --> creating proper IDs, hashing the passwords, backend server signout (get rid of the Token)

// Cleaning up the code: You can probably do this without the authToken
