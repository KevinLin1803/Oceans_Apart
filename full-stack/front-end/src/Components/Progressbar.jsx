import React from 'react'
import Date from './Date';
import { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { getSocket } from './socket';

const Progressbar = () => {
  const [taskTarget, setTaskTarget] = useState(10)
  const [taskTargetGirl, setTaskTargetGirl] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [completedTasks, setCompletedTasks] = useState(0)
  const [completedTasksGirl, setCompletedTasksGirl] = useState(0)
  const [showDate, setShowDate] = useState(false)

  // Yes it's slow but I think it has time to catchup
  const updateTarget = ((e) => {
    setTaskTarget(e.target.value)
  })

  const updateTargetGirl = ((e) => {
    setTaskTargetGirl(e.target.value)
  })

  const submitTarget = async (e) => {
    e.preventDefault()

    const gender = e.target.className === 'set_task_target_girl'? 'girl' : 'boy'
    const updated_target = gender === 'girl'? taskTargetGirl : taskTarget

    console.log(e.target.className)

    try {
      await fetch(`${process.env.REACT_APP_SERVER}/progressbar`, {
        method: "PUT",
        body: JSON.stringify({"gender": gender, "task_target": updated_target, "session_id": cookies.Session}),
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
    setCompletedTasksGirl(data[0].completed_tasks_girl)
    setTaskTargetGirl(data[0].tasks_target_girl)
  }
  
  const reset = async () => {
    setShowDate(false)

    try {
      await fetch(`${process.env.REACT_APP_SERVER}/progressbar/${cookies.Session}`, {
        method: "PUT"
      })

    } catch(error) {
      console.log(error)
    }
     
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

  // Changes:
    // Front end: Task.Jsx -> add gender information to task completion, Backend: Server needs to update new fields, DB: Add new data fields for girls
    // I also need to change the initalisation of the progressBars
    // Front end: Progressbar.jsx --> get two new state variables, update them accordingly whenever
    // Adjust progress_full --> need to debug this bit anyway 

  return (
    <div className = "progress-bar-component-container">
        <div className = "progress-bar-container-boy">
            <div>
              <div className="task-target-title"> Task Goal</div>
              <form onSubmit={submitTarget}>
                <input type="number" value={taskTarget} onChange={updateTarget} className="tasktarget-input"></input>
                <button className='taskTarget-Button'>Set</button>
              </form>
            </div>

            <div className="progress-bar-boy">
              <div style={{'width':`${(completedTasks/taskTarget)* 100}%`}} className="progress-boy"></div>
              <div className="progress-boy-figure" style={{'marginLeft':`${(completedTasks/taskTarget)* 100 + 1}%`}}> {`${completedTasks/taskTarget * 100}%`}</div>
            </div>
        </div>

          
          <div className = "progress-bar-container-girl">
            <div className="set-task-girl">
              <div className="task-target-title"> Task Goal</div>
              <form className ="set_task_target_girl" onSubmit={submitTarget}>
                <input type="number" value={taskTargetGirl} onChange={updateTargetGirl} className="tasktarget-input"></input>
                <button className='taskTarget-Button'>Set</button>
              </form>
            </div>

            <div className="progress-bar-girl">
              <div style={{'width':`${(completedTasksGirl/taskTargetGirl)* 100}%`}} className="progress-girl"></div>
              {/* set a max --> research the function for this*/}
              {/* play around with fish svg maybe? */}
              <div className="progress-girl-figure" style={{'marginRight': `${96 - ((completedTasksGirl/taskTargetGirl)* 100)}%`}}> {`${completedTasksGirl/taskTargetGirl * 100}%`}</div>
            </div>
          </div>

          {/* 'marginleft':`${96 - ((completedTasksGirl/taskTargetGirl)* 100)}% */}

          <div className="progress-description"> Reach 100% to decide your next date!</div>

        {showDate && (
          <div className = 'overlay'>
            <Date date={null} prize={true} />
            <button onClick={reset}>X</button>
          </div>)}
    </div>
  )
}

export default Progressbar

{/* <progress value={completedTasks} max={taskTarget} className='progress-bar-boy'></progress> */}


// Holy fugg --> the moral of today is that callbacks are insanely important => without them, React will just call them

// Remainders:
// 1. Make it pretty
// 2. Finish the debugging (eg: you have rather few limited sessions)
// 3. Deploy it

// For tonight: ponder how/what to code while travelling. You wanna stay calm and continue learning (in a diff state)
// But also how to improve your baseline level of coding. Define it and how to improve that (would raise travel baseline too)

