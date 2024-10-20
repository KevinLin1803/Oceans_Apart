import React from 'react'
import Inputbar from './Inputbar'
import TaskContainer from './TaskContainer'

const TaskGridHalves = ( {gender} ) => {
  return (
    <div className = "task-grid-halves">
        <Inputbar gender={gender}/>
        <TaskContainer gender={gender}/>
    </div>
  )
}

export default TaskGridHalves
