import React from 'react'
import { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { io } from "socket.io-client";

const Progressbar = () => {
  const [taskTarget, setTaskTarget] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [completedTasks, setCompletedTasks] = useState(0)
  // const [progress, setProgress] = useState(0)

  // This is an issue --> it keeps changing back and forth
    // Might just have to create sessions right
    // Store the session and then load all the data within said session

  // how else can you track everything? --> can just load whose tasks are whose
    // session Ids: --> join a different session or add someone else to the session
    // The session will store everything (all tasks within that session, all progress bars within that session)
    // Don't make anythign user-based make it all sessino based and create a session ID

    // Just add a session ID to everything basically (whatever they decide to do on the page is their issue, session will save it)
    // For now, I'll allow each user to have one session basically
      // Since all the db logic will be session based, once two users have the same session, they'll see everything the same/update everything the same
      // Won't require email to update but session :) --> save it to cookies and DB

    // Still need to figure out how to save progress bar values so that when you load it up it's correct (easiest/most robust way of doing this?)

  const updateTarget = (e) => {
    setTaskTarget(e.target.value)
  }

  const submitTarget = async (e) => {
    e.preventDefault()

    try {
      await fetch(`${process.env.REACT_APP_SERVER}/progressbar`, {
        method: "PUT",
        body: JSON.stringify({"task_target": taskTarget, "email": cookies.Email}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const getProgress = async ()=> {
    const res = await fetch(`${process.env.REACT_APP_SERVER}/progressbar/${cookies.Session}`)
    const data = await res.json()
    console.log('data is', data[0])
    setTaskTarget(data[0].tasks_target)
    setCompletedTasks(data[0].completed_tasks)
  }

  // Get it on initial mounting
  useEffect(()=> { getProgress() }, [])

  // Keep it updating
  useEffect(()=> {
    const socket = io(process.env.REACT_APP_SERVER);
    console.log('established')

    socket.on('progress_update', getProgress)

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => socket.disconnect
  }, [])

  return (
    <div className = "progress-bar-component-container">
        <div className = "progress-bar-container">
            <div>Set task limit 
              <form onSubmit={submitTarget}>
                <input type="number" value={taskTarget} onChange={updateTarget}></input>
                <button>Save</button>
              </form>
            </div>
            <progress value={completedTasks} max={taskTarget} className='progress-bar-boy'></progress>
        </div>
        <div className = "progress-bar-container">
            <div className='progress-bar-girl-label'>Set progress parameters</div>
            <progress value="50" max="100" className='progress-bar-girl'></progress>
        </div>
    </div>
  )
}

export default Progressbar


// To do

// Making the progress bar work for your partner as well (you can add tasks and whatnot with your partner)
  // Thing is making it a live session is also different I think
  // How do I make everything a live session?
  
// add Date list (modal + progress bar succession) + add invite link to partner + words of affirmation?