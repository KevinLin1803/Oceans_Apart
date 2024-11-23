import React from 'react'
import trash from './icons/trash-can.png'
import checkmark from './icons/checked.png'
import { useCookies } from 'react-cookie'

const Task = ({task, gender}) => {
  const [cookies, setCookies, removeCookies] = useCookies("")

  const deleteTask = (async() => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER}/tasks/${task.id}`, {
        method: "DELETE",
      })
    } catch (err) {
      console.error(err)
    }
  })

  const completeTask = (async() => {
    await deleteTask()

    try {
      await fetch(`${process.env.REACT_APP_SERVER}/progressbar`, {
        method: "PUT",
        body: JSON.stringify({"completed_tasks": 1, "gender": gender, "session_id": cookies.Session}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })

      console.log('we finishing it')
    } catch (err) {
      console.error(err)
    }
  })
  
  if (String(task.gender) === String(gender)) {
    return (
      <div className='task-container-single'>
        <div className = "checkbox" onClick={completeTask}> 
          <img src={checkmark} className="checkmark-icon" alt="complete"></img>
        </div>

        <div className = "task" id={task.id}></div>
        <label htmlFor = {task.id}> {task.title} </label>
        <button className = "delete-task-button" onClick={deleteTask}> 
          <img src={trash} className="trash-icon" alt="delete"></img>
        </button>
      </div>
    )  
  } else {
    return (
      <></>
    )
  }
}

export default Task

// onChange

// onclick = "{`completeTask('${gender}')`}" --> this is additional custom functionlaity to work around a little later imo
// complete task + edit --> come back to work on this after authentication

// After we got authentication --> + the other basic functinolaities we'll work on creating the progress bar

// That universal progress bar might just be something we set or we collect input from the user I reckon.

// onclick = "{`removeTask('${id}')`}"
