import React from 'react'

const TaskContainer = ({gender}) => {
  return (
    <div className = "task-container">
        <div className= "task-title">Tasks</div>
        <div className = {`tasks tasks-${gender}`}></div>
        <div className = {`completed-tasks completed-tasks-${gender}`} > 
            <div className="task-title completed-task-title"> Completed Tasks</div>
        </div>    
    </div>

  )
}

export default TaskContainer
