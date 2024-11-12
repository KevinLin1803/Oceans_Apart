import React from 'react'
import Task from './Task'
import { useEffect, useState} from 'react'
import { getSocket } from './socket';
import { useCookies } from 'react-cookie'


const TaskContainer = ({gender}) => {
  const [tasks, setTasks] = useState(null)
  const [taskUpdates, setTaskUpdates] = useState(1)
  const [cookies, setCookies, removeCookies] = useCookies("")
  const session_id = cookies.Session

  // Make the web sockets work --> then when pushing to production, maybe switch to polling

  const getTasks = (async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/tasks/${session_id}`)
      const data = await res.json()
      setTasks(data)
    } catch(err){
      console.error(err)
    }
  })

  useEffect(() => {
    // This is currently running twice. Might be some double mounting shit happening
    console.log('Task Container are being initalised XX times')

    const socket = getSocket()
    const handleTaskUpdates = () => {setTaskUpdates(prevData => prevData + 1)}
    const handleDisconnect = () => {console.log('Disconnected from server')}

    socket.on('db_update', handleTaskUpdates)

    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('db_update', handleTaskUpdates)
      socket.off('disconnect', handleDisconnect );
    }
  }, [])
  
  useEffect(() => getTasks, [taskUpdates])

  return (
    <div className = "task-container">
        <div className= "task-title">Tasks</div>
        <div className = {`tasks tasks-${gender}`}>
          {tasks?.map((task) => <Task key={task.id} task={task} gender={gender}/>)}
        </div>
        
        {/* <div className = {`completed-tasks completed-tasks-${gender}`} > 
            <div className="task-title completed-task-title"> Completed Tasks</div>
        </div>     */}
    </div>
  )
}

export default TaskContainer

// EXTENSIONS:
// - Rather than websockets --> should be using http polling lmao
// - but right now there's also a bug with the web sockets, so they don't fully work either :3
// - but let's just go create our shit first