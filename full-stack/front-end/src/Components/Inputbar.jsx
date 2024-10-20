import React from 'react'

const Inputbar = ({gender}) => {
  return (
    <form className = "input-bar" onsubmit={`addTask(${gender})`}>
        <input className = {`task-input task-input-${gender}`} type="text" placeholder="Add a task"></input>
    </form>
)
}

export default Inputbar
