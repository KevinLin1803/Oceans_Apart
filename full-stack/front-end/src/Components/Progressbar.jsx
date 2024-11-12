import React from 'react'
import Date from './Date';
import { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { getSocket } from './socket';

const Progressbar = () => {
  const [taskTarget, setTaskTarget] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [completedTasks, setCompletedTasks] = useState(0)
  const [showDate, setShowDate] = useState(true)

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
    console.log('Progressbar are being initalised XX times')

    const socket = getSocket()
    const handleDisconnect = () => {console.log('Disconnected from server')}
    const handleDate = () => {setShowDate(true); console.log('something happening')}
    const handleProgress = () => {getProgress()}


    socket.on('progress_update', handleProgress)

    socket.on('progress_full', handleDate)

    socket.on('disconnect', handleDisconnect);

    // Careful though --> we never disconnect sockets. This is going to have to change once you really get started
    return () => {
      socket.off('progress_update', handleProgress)
      socket.off('progress_full', handleDate)
      socket.off('disconnect', handleDisconnect);
    }
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

        {showDate && (
          <div className = 'overlay'>
            <Date date={null} prize={true} />
            <button onClick={()=>{setShowDate(false)}}>X</button>
          </div>)}
    </div>
  )
}

export default Progressbar

// Holy fugg --> the moral of today is that callbacks are insanely important => without them, React will just call them

// Remainders:
// 1. Make it pretty
// 2. Finish the debugging (eg: you have rather few limited sessions)
// 3. Deploy it

// For tonight: ponder how/what to code while travelling. You wanna stay calm and continue learning (in a diff state)
// But also how to improve your baseline level of coding. Define it and how to improve that (would raise travel baseline too)