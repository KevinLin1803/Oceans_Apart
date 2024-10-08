import React from 'react'
import Tasklist from './Tasklist'

const Inputbar = () => {
  
//   const addTask = function () {
//     event.preventDefault();

//     let id = document.querySelectorAll("#tasks div").length

//     let task_name = document.getElementById("task-input").value

//     if (task_name == '') {
//         return
//     }

//     let new_task = document.createElement("div")
//     new_task.innerHTML = `<input class = "task" type="checkbox" onclick = "removeTask()" id="${id}""> </input>
//                           <label for = "${id}" contenteditable="true"> ${task_name} </label>`

//     // Very unsure why this works
//     tasks.appendChild(new_task)

//     // Resetting the input bar
//     document.getElementById("task-input").value = ''
//   }

// I feel like the entire approach in React would be different

  return (
    <div>
        <form onsubmit="addTask()">
            <input type="text"></input>      
        </form>

        <Tasklist />
    </div>
  )
}

export default Inputbar

// React and jquery/javascript work in different wayss :3. Doesn't seem like the specifics/knowledge really help each other here
// Like hmm. I think conversion won't be the best idea for this then. 
// They say fundamenetals but what specifically do you actually learn?

// What is my goal? What's employable is not always what's efficient and what's most enjoyable for you