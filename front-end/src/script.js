function addTask(gender) {
    // Prevent default here is preventing it from actually submitting
    event.preventDefault();

    // Javascript equality
    if (gender == 'boy') {
        var tasks = 'tasks-boy'
        var task_input = 'task-input-boy'
    } else {
        var tasks = 'tasks-girl'
        var task_input = 'task-input-girl'
    }

    let id = document.querySelectorAll(`#${tasks} div`).length

    let task_name = document.getElementById(`${task_input}`).value

    if (task_name == '') {
        return
    }

    displayTask(gender, `${gender}-${id}`, task_name, tasks)

    // The strat here might just be to host the json server and do cros rather than local file updating
    try {
        const response = fetch('/api/users', {
            method: "POST",
            body: JSON.stringify({task: task_name, id: `${gender}-${id}`, gender, completed: false}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        console.log(response)
    } catch (error) {
        console.log(error)
    }

    // Resetting the input bar
    document.getElementById(`${task_input}`).value = ''
 
}

// // ye this CORS stuff doesn't work
// async function addTaskDB(task_name, gender, id) {
//     try {
//         const response = await fetch('/api/users', {
//             method: "POST",
//             body: JSON.stringify({task: task_name, id: `${gender}-${id}`, gender, completed: false}),
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8"
//             }
//         })

//         console.log(response)
//     } catch (error) {
//         console.log(error)
//     }
// }

function displayTask(gender, id, task_name, tasks){
    let new_task = document.createElement("div")
    new_task.innerHTML = `<input class = "task" type="checkbox" onclick = "completeTask('${gender}')" id="${id}""> </input>
                          <label for = "${id}" contenteditable="true"> ${task_name} </label>
                          <button class = "delete-task-button" onclick = "removeTask('${id}')" > <img src="../icons/trash-can.png" id="trash-icon"> </button>`

                        //did it auto-update or something? the fug happened
    new_task.className = "task-container-single"

    document.getElementById(`${tasks}`).appendChild(new_task)
}

function displayCompletedTask(gender, id, task_name, tasks){
    let new_task = document.createElement("div")
    new_task.innerHTML = `<input class = "task" type="checkbox" onclick = "completeTask('${gender}')" id="${id}""> </input>
                          <label for = "${id}" contenteditable="true"> ${task_name} </label>
                          <button class = "delete-task-button" onclick = "removeTask('${id}')" > <img src="../icons/trash-can.png" id="trash-icon"> </button>`

                        //did it auto-update or something? the fug happened
    new_task.className = "task-container-single"

    document.getElementById(`${tasks}`).appendChild(new_task)
}

function completeTask(gender) {
    if (gender == 'boy') {
        var tasks = 'tasks-boy'
        var completed_tasks = 'completed-tasks-boy'
    } else {
        var tasks = 'tasks-girl'
        var completed_tasks = 'completed-tasks-girl'
    }

    let inputs = document.querySelectorAll(`#${tasks} div`)
    
    for (let i = 0; i < inputs.length; i++) {
        // did the turnerary force shut it down before?
        if (inputs[i].querySelector("input").checked) {
            let result = document.getElementById(`${completed_tasks}`).appendChild(inputs[i])
        }
    }
}

function removeTask(id) {
    let parent = document.getElementById(id).parentNode
    parent.remove()
    try {
        const response = fetch('/api/removetask', {
            method: "POST",
            body: JSON.stringify({id: id}),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        console.log(response)
    } catch (error) {
        console.log("Error in deleting a task:", error)
    }
}

// async function removeTaskDB(id) {
//     try {
//         const response = await fetch('/api/removetask', {
//             method: "POST",
//             body: JSON.stringify({id: id}),
//             headers:{
//                 "Content-type": "application/json; charset=UTF-8"
//             }
//         })

//         console.log(response)
//     } catch (error) {
//         console.log("Error in deleting a task:", error)
//     }
// }


//Updating the date
document.getElementById("date").innerHTML = Date().substring(0,15)

// Loading the uncompleted tasks from the previous session --> need to add the completed tasks to this
try {
    fetch('/api/users')
        .then(response => response.json())
        .then(task_data => task_data.forEach(task => {
            if (task.gender == 'boy') {
                var tasks = 'tasks-boy'
            } else {
                var tasks = 'tasks-girl'
            }

            if (task.completed == false) {
                displayTask(task.gender, task.id, task.task, tasks)
            } else {
                displayCompletedTask(task.gender, task.id, task.task, tasks)
            }
        }))
  } catch (error) {
    console.error(error.message);
}

// Current Tasks: 
// 1. Figure out this CORS issue
// 2. Figuring out CRUD replacement functionlaity --> need for updating if tasks are completed + for editing the actual task values