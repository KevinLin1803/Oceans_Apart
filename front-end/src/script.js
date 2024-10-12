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

    displayTask(gender, id, task_name, tasks)

    // Resetting the input bar
    document.getElementById(`${task_input}`).value = ''

    // Why do we need this header?
    try {
        const response = fetch('/api/users', {
        method: "POST",
        body: JSON.stringify({task: task_name, id: id, gender}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    } catch (error) {
        console.log(error)
    }
}

function displayTask(gender, id, task_name, tasks){
    let new_task = document.createElement("div")
    new_task.innerHTML = `<input class = "task" type="checkbox" onclick = "completeTask('${gender}')" id="${gender}-${id}""> </input>
                          <label for = "${gender}-${id}" contenteditable="true"> ${task_name} </label>
                          <button class = "delete-task-button" onclick = "removeTask('${gender}-${id}')" > <img src="../icons/trash-can.png" id="trash-icon"> </button>`

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
}

//Updating the date
document.getElementById("date").innerHTML = Date().substring(0,15)

try {
    fetch('/api/users')
        .then(response => response.json())
        .then(task_data => array.forEach(task => {
            if (task.gender == 'boy') {
                var tasks = 'tasks-boy'
            } else {
                var tasks = 'tasks-girl'
            }
            displayTask(task.gender, task.id, task.task, tasks)
            console.log('added', task)
        }))
  } catch (error) {
    console.error(error.message);
}
