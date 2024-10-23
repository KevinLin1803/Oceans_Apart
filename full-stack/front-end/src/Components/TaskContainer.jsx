import React from 'react'
import Task from './Task'
import { useEffect, useState} from 'react'

const TaskContainer = ({gender}) => {
  const [tasks, setTasks] = useState(null)

  const getTasks = (async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/tasks`)
      const data = await res.json()
      setTasks(data)
    } catch(err){
      console.error(err)
    }
  })
  
  useEffect(() => getTasks, [])

  return (
    <div className = "task-container">
        <div className= "task-title">Tasks</div>
        <div className = {`tasks tasks-${gender}`}>
          {tasks?.map((task) => <Task key={task.id} task={task} gender={gender}/>)}
        </div>
        
        <div className = {`completed-tasks completed-tasks-${gender}`} > 
            <div className="task-title completed-task-title"> Completed Tasks</div>
        </div>    
    </div>
  )
}

export default TaskContainer
