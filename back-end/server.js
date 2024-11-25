require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 5500
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
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "DELETE", "PUT"]
    }
  });


app.get('/user/:email', async (req, res) => {
    var {email} = req.params

    const client = await pool.connect()


    try {
        const data = await client.query(`Select sessions from "Users" WHERE user_email = $1`, [email])
        res.json(data.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Get user sessions error ' })
    } finally {
        client.release()
    }
})

app.get('/tasks/:session_id', async (req, res) => {
    var {session_id} = req.params
    // I'm not even using ti
    const client = await pool.connect()

    try {
        const data = await client.query(`Select * from "Tasks" WHERE session_id = $1`, [session_id])
        res.json(data.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Get tasks from session error ' })
    } finally {
        client.release()
    }
})

app.post('/tasks', jsonParser, async (req, res) => {
    var {id, session_id, title, date, gender} = req.body
    id = Date.now()

    const client = await pool.connect()
    
    try {
        await client.query(`INSERT INTO "Tasks" (id, session_id, title, date, gender) VALUES ($1, $2, $3, $4, $5)`, 
            [id, session_id, title, date, gender])
        
        io.emit("db_update","")
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Get tasks from session error ' })
    } finally {
        client.release()
    }

    res.json()
})

app.delete('/tasks/:id', async (req, res) => {
    var {id} = req.params
    const client = await pool.connect()

    try {
        await client.query(`DELETE FROM "Tasks" WHERE id = $1`, [id])

        io.emit("db_update","")
    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }

    res.json()
})

app.post('/signup', jsonParser, async (req, res) => {
    var {email, password} = req.body

    const client = await pool.connect()

    try {
        await client.query(`INSERT INTO "Users" (user_email, password) VALUES ($1, $2)`, 
            [email, password])

        const token = jwt.sign({
            data: email
          }, 'secret', { expiresIn: '1h' });

        res.json({token, email})

    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }
})

app.post('/login', jsonParser, async (req, res) => {
    var {email, password} = req.body

    const client = await pool.connect()

    try {
        const user = await client.query(`SELECT * FROM "Users" WHERE "Users".user_email = $1`, 
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
    } finally {
        client.release()
    }
})

app.put('/progressbar', jsonParser, async (req, res) => {
    var {session_id, task_target, gender} = req.body

    const client = await pool.connect()

    try {
        if (task_target) {
            var dataField = gender === 'girl' ? "tasks_target_girl": "tasks_target"

            await client.query(`UPDATE "Progressbars" as p SET ${dataField} = $1 WHERE p.session_id = $2`, 
                [task_target, session_id])
            
        } else {
            var dataField = gender === 'girl' ? "completed_tasks_girl": "completed_tasks"

            await client.query(`UPDATE "Progressbars" as p SET ${dataField} = ${dataField} + 1 WHERE p.session_id = $1`, 
                [session_id])
        }
        
        io.emit("progress_update","")

    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }

    res.json()

});

// Resetting after we hit 100% on our dates
app.put('/progressbar/:session_id', jsonParser, async (req, res) => {
    var {session_id} = req.params

    const client = await pool.connect()

    try {        
        await client.query(`UPDATE "Progressbars" as p SET completed_tasks = $1, completed_tasks_girl = $2 WHERE p.session_id = $3`, 
            [0, 0, session_id])
  
        io.emit("progress_update","")
        
    } catch (error) {
        console.error(error)
        return res.json({"data": "Error resetting data details:" + error })
    } finally {
        client.release()
    }

    res.json()

});

app.get('/progressbar/:session_id', jsonParser, async (req, res) => {
    var {session_id} = req.params

    const client = await pool.connect()

    try {
        const data = await client.query(`SELECT tasks_target, completed_tasks, tasks_target_girl, completed_tasks_girl FROM "Progressbars" as p where p.session_id = $1`, 
            [session_id])
        
        const boy_progress = data.rows[0].completed_tasks/data.rows[0].tasks_target
        const girl_progress = data.rows[0].completed_tasks_girl/data.rows[0].tasks_target_girl
        
        if (boy_progress >= 1 && girl_progress >= 1) {
            io.emit("progress_full","")
        }

        res.json(data.rows)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
    } finally {
        client.release()
    }

});

app.post('/createsession/:email', jsonParser, async (req, res) => {
    var {email} = req.params

    var id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    const client = await pool.connect()

    try {
        await client.query(`INSERT INTO "Sessions" (session_id) VALUES ($1)`, [id])

        await client.query(`INSERT INTO "Progressbars" (session_id, completed_tasks, tasks_target, completed_tasks_girl, tasks_target_girl) 
            VALUES ($1, $2, $3, $4, $5)`,
            [id, 0 , 10, 0, 10]
        )

        await client.query(`UPDATE "Users" SET sessions = sessions || $1 WHERE "Users".user_email = $2`, [[id], email]) 
        
        res.json({"session": id})

    } catch (error) {
        console.error(error)
        return res.json({"data": "Error creating session:" + error })
    } finally {
        client.release()
    }

});

app.get('/joinsession/:id/:email', jsonParser, async (req, res) => {
    var {id, email} = req.params

    var token = Date.now().toString(36) + Math.random().toString(36).substring(2);

    const client = await pool.connect()

    try {
        await client.query(`SELECT session_id FROM "Sessions" WHERE session_id = $1 `, [id])

        if (email) {
            await client.query(`UPDATE "Users" SET sessions = sessions || $1 WHERE "Users".user_email = $2`, [[id], email]) 
        }
        
        res.json({"session": token})
        
    } catch (error) {
        console.error(error)
        return res.json({"data": "Error joining session:" + error })
    } finally {
        client.release()
    }
});

app.post('/dates', jsonParser, async (req, res) => {
    var {id, session_id, title, date} = req.body
    id = Date.now()
    date = new Date().toISOString()

    const client = await pool.connect()

    try {
        await client.query(`INSERT INTO "Dates" (date_id, session_id, date_title, date_date) VALUES ($1, $2, $3, $4)`, 
            [id, session_id, title, date])
        
        io.emit("date_update","")

    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }

    res.json()
})

app.get('/dates/:session_id', async (req, res) => {
    var {session_id} = req.params

    const client = await pool.connect()

    try {
        const data = await client.query(`Select * from "Dates" WHERE session_id = $1`, [session_id])
        res.json(data.rows)
    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }
})

// whatever you put in the :id --> you need for the req.params too :)
app.delete('/dates/:id', async (req, res) => {
    var {id} = req.params

    const client = await pool.connect()

    try {
        await client.query(`DELETE FROM "Dates" WHERE date_id = $1`, [id])
        io.emit("date_update","")
    } catch (error) {
        console.error(error)
    } finally {
        client.release()
    }

    res.json()

})

// Since we don't have that myny users and that tasks aren't being uploaded that frquently, polling may be better here actulaly
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', (reason) => {
        console.log(`a user disconnected due to ${reason}`);
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

// TESTING --> using the same email to signup twice

// THINGS YOU HAVE TO DO --> ensure passwords have to match and also that you can only sign up once for each email
// FOR SECURITY REASONS --> creating proper IDs, hashing the passwords, backend server signout (get rid of the Token)

// Cleaning up the code: You can probably do this without the authToken, web socket connections are insane (you get so many initally)
// A shit ton of repetition between date and task tbh

// BUGS: Sometimes web can only take 6 task completions at a time

// DESIGN DESIGIONS: COMPLETED TASK SECTION? TWO PROGRESS BARS?
