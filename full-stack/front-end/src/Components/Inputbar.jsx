import React from 'react'
import { useState } from 'react'
import { useCookies } from 'react-cookie'


const Inputbar = ({gender}) => {
  const [task, setTask] = useState('')
  const [cookies, setCookies, removeCookies] = useCookies("")
  var session_id = cookies.Session

  const handleInput = ( (e) => {
    setTask(e.target.value)
  })

  const addTask = ( (e) => {
    e.preventDefault();
    postTask()
    setTask('')
  })

  const postTask = (async () => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          "id": null,
          "session_id": session_id,
          "title": task,
          "date": new Date().toISOString(),
          "gender": gender
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }  
      })

    } catch (err) {
      console.error(err)
    }
  })

  return (
    <form className = "input-bar" onSubmit={addTask}>
        <input className = {`task-input task-input-${gender}`} type="text" placeholder="Add a task" value = {task} onChange={handleInput}></input>
    </form>
  )
}

export default Inputbar
