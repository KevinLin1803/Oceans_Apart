import React from 'react'
import TaskGridHalves from './TaskGridHalves'

const TaskGrid = () => {
  return (
    <div className = "task-grid">
        <TaskGridHalves gender={'boy'}/>
        <TaskGridHalves gender={'girl'}/>
    </div>
    )
}

export default TaskGrid
