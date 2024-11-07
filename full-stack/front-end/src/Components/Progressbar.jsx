import React from 'react'
import { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { io } from "socket.io-client";

const Progressbar = () => {
  const [taskTarget, setTaskTarget] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [completedTasks, setCompletedTasks] = useState(0)

  // Yes it's slow but I think it has time to catchup
  const updateTarget = ((e) => {
    setTaskTarget(e.target.value)
  })

  const submitTarget = async (e) => {
    // Why is this getting printed 8 times?
    e.preventDefault()

    try {
      await fetch(`${process.env.REACT_APP_SERVER}/progressbar`, {
        method: "PUT",
        body: JSON.stringify({"task_target": taskTarget, "session_id": cookies.Session}),
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
    setTaskTarget(data[0].tasks_target)
    setCompletedTasks(data[0].completed_tasks)
  }

  // Get it on initial mounting
  useEffect(()=> { getProgress() }, [])

  // Keep it updating
  useEffect(()=> {
    const socket = io(process.env.REACT_APP_SERVER);
    // Why does this console.log twice on mounting?
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
            <div> {`${completedTasks/taskTarget * 100}%`}</div>
        </div>

        {/* <div className = "progress-bar-container">
            <div className='progress-bar-girl-label'>Set progress parameters</div>
            <progress value="50" max="100" className='progress-bar-girl'></progress>
        </div> */}
    </div>
  )
}

export default Progressbar


// To do

// Making the progress bar work for your partner as well (you can add tasks and whatnot with your partner)
  // Thing is making it a live session is also different I think
  // How do I make everything a live session?
  
// add Date list (modal + progress bar succession) + add invite link to partner + words of affirmation?