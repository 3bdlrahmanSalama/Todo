import "./style.css";
import { format } from "date-fns";

class TodoItem {
  constructor(name, description, dueDate, priority, done) {
    this.name = name;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.dueDate.setHours(0, 0, 0, 0);
    this.priority = priority;
    this.done = done;
  }
}

const todos = (function () {
  let todosArray = JSON.parse(localStorage.getItem("todos")) || [];
  let todosIndex = 0;

  function addTodo(todoItem) {
    todoItem.index = todosIndex;
    todos.todosArray.push(todoItem);
    todosIndex++;
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  function listTodos() {
    console.table(todos.todosArray);
  }

  function removeTodo(index) {
    todos.todosArray.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  function changeCompletion(item) {
    item.done = !item.done;
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  function editItem(index, property, value) {
    todos.todosArray[index][property] = value;
    localStorage.setItem("todos", JSON.stringify(todos.todosArray));
  }

  return {
    todosArray,
    todosIndex,
    addTodo,
    listTodos,
    removeTodo,
    changeCompletion,
    editItem,
  };
})();

const init = (function () {
  todos.listTodos();
})();

const DOMHandler = (function () {
  function tasksView() {
    let mainContainer = document.querySelector("#main-container");
    mainContainer.innerHTML = `<div id="cards"></div>
        <button class="plus-icon" id="add-task-button">+</button>`;

    let addTaskBtn = document.querySelector("#add-task-button");
    addTaskBtn.addEventListener("click", () => DOMHandler.addTask());

    let tasksContainer = document.querySelector("#cards");
    tasksContainer.innerHTML = "";

    let array = JSON.parse(localStorage.getItem("todos")) || [];
    console.log(array);

    array.forEach((task, index) => {
      let isDone = task.done ? "check" : "xmark";
      let taskHTML = `
            <div class="todo-card ${task.priority}-priority">
                        <h2 data-task="${task.index}"class="task-title">${task.name}</h2>
                        <p class="todo-item">${task.description}</p>
                        <p class="todo-item"><span class="bold">Due Date:</span> ${format(task.dueDate, "yyyy/MM/dd")}</p>
                        <p class="todo-item"><span class="bold">Priority:</span> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
                        <p class="todo-done"><span class="bold">Completed:</span> <i class="fa-solid fa-${isDone} ${task.done}"></i></p>
            </div>
            `;
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = taskHTML;
      tasksContainer.appendChild(tempDiv);

      let taskEditBtn = tempDiv.querySelector("h2");
      taskEditBtn.addEventListener("click", () => DOMHandler.editTask(index));
    });
  }

  function editTask(task) {
    let selectedTask = todos.todosArray[task];
    let toBeEditedTask = task;
    let mainContainer = document.querySelector("#main-container");
    mainContainer.innerHTML = `
        <div id="task">
            <button id="back-button">
            <i class="fa-solid fa-arrow-left back-button-icon"></i> Go Back </button>
            <label class="task-edit-label">
            <span class="label-title">Title: </span>
            <input type="text" value="${selectedTask.name}" id="name-input">
            </label>
            <label class="task-edit-label">
            <span class="label-title">Description: </span>
            <input type="text" value="${selectedTask.description}" id="description-input">
            </label>
            <label class="task-edit-label">
            <span class="label-title">Due Date: </span>
            <input type="date" value="${format(selectedTask.dueDate, "yyyy-MM-dd")}" id="due-date-input">
            </label>
            <label class="task-edit-label">
            <span class="label-title">Priority: </span>
            <span class="label-buttons">
            <button class="task-button" id="high-priority">High</button>
            <button class="task-button" id="medium-priority">Medium</button>
            <button class="task-button" id="low-priority">Low</button>
            </span>
            </label>
            <label class="task-edit-label">
            <span class="label-title">Completed: </span>
            <span class="label-buttons">
            <button class="task-button" id="done-button">
            <i class="fa-solid fa-check true"></i>
            </button>
            <button class="task-button" id="not-done-button">
            <i class="fa-solid fa-xmark false"></i>
            </button>
            </span>
            </label>
            <button class="task-button chameleon-button" id="finish-button">
            <i class="fa-solid fa-check"></i> Finish </button>
            <button class="task-button chameleon-button" id="delete-button">
            <i class="fa-solid fa-trash"></i> Delete Task </button>
        </div>
        `;

    let backBtn = document.querySelector("#back-button");
    backBtn.addEventListener("click", () => DOMHandler.tasksView());

    let selectedPriority = todos.todosArray[toBeEditedTask].priority;
    let highPriorityBtn = document.querySelector("#high-priority");
    let mediumPriorityBtn = document.querySelector("#medium-priority");
    let lowPriorityBtn = document.querySelector("#low-priority");

    highPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.add("selected-button");
      mediumPriorityBtn.classList.remove("selected-button");
      lowPriorityBtn.classList.remove("selected-button");
      selectedPriority = "high";
    });

    mediumPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("selected-button");
      mediumPriorityBtn.classList.add("selected-button");
      lowPriorityBtn.classList.remove("selected-button");
      selectedPriority = "medium";
    });

    lowPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("selected-button");
      mediumPriorityBtn.classList.remove("selected-button");
      lowPriorityBtn.classList.add("selected-button");
      selectedPriority = "low";
    });

    let selectedDone = todos.todosArray[toBeEditedTask].done;
    let doneBtn = document.querySelector("#done-button");
    let notDoneBtn = document.querySelector("#not-done-button");

    doneBtn.addEventListener("click", () => {
      doneBtn.classList.add("selected-button");
      notDoneBtn.classList.remove("selected-button");
      selectedDone = true;
    });

    notDoneBtn.addEventListener("click", () => {
      doneBtn.classList.remove("selected-button");
      notDoneBtn.classList.add("selected-button");
      selectedDone = false;
    });

    const checkPriorityDone = (function () {
      if (selectedTask.priority == "high") {
        highPriorityBtn.classList.add("selected-button");
      } else if (selectedTask.priority == "medium") {
        mediumPriorityBtn.classList.add("selected-button");
      } else {
        lowPriorityBtn.classList.add("selected-button");
      }

      if (selectedTask.done == true) {
        doneBtn.classList.add("selected-button");
      } else {
        notDoneBtn.classList.add("selected-button");
      }
    })();

    let nameInput = document.querySelector("#name-input");
    let descriptionInput = document.querySelector("#description-input");
    let dueDateInput = document.querySelector("#due-date-input");

    let finishBtn = document.querySelector("#finish-button");
    finishBtn.addEventListener("click", () => {
      todos.editItem(toBeEditedTask, "name", nameInput.value);
      todos.editItem(toBeEditedTask, "description", descriptionInput.value);
      todos.editItem(toBeEditedTask, "dueDate", dueDateInput.value);
      todos.editItem(toBeEditedTask, "priority", selectedPriority);
      todos.editItem(toBeEditedTask, "done", selectedDone);
      todos.editItem(toBeEditedTask, "dueDate", dueDateInput.value);

      DOMHandler.tasksView();
    });

    let deleteBtn = document.querySelector("#delete-button");
    deleteBtn.addEventListener("click", () => {
      todos.removeTodo(toBeEditedTask);
      DOMHandler.tasksView();
    });
  }

  function addTask() {
    let mainContainer = document.querySelector("#main-container");
    mainContainer.innerHTML = `
        <div id="task">
                <button id="back-button">
                <i class="fa-solid fa-arrow-left back-button-icon"></i> Go Back </button>
                <label class="task-edit-label">
                <span class="label-title">Title: </span>
                <input type="text" value="" id="name-input">
                </label>
                <label class="task-edit-label">
                <span class="label-title">Description: </span>
                <input type="text" value="" id="description-input">
                </label>
                <label class="task-edit-label">
                <span class="label-title">Due Date: </span>
                <input type="date" value="" id="due-date-input">
                </label>
                <label class="task-edit-label">
                <span class="label-title">Priority: </span>
                <span class="label-buttons">
                <button class="task-button" id="high-priority">High</button>
                <button class="task-button" id="medium-priority">Medium</button>
                <button class="task-button" id="low-priority">Low</button>
                </span>
                </label>
                <label class="task-edit-label">
                <span class="label-title">Completed: </span>
                <span class="label-buttons">
                <button class="task-button" id="done-button">
                <i class="fa-solid fa-check true"></i>
                </button>
                <button class="task-button" id="not-done-button">
                <i class="fa-solid fa-xmark false"></i>
                </button>
                </span>
                </label>
                <div class="bottom-buttons"><button class="task-button chameleon-button" id="finish-button">
                    <i class="fa-solid fa-check"></i> Finish </button>
                    <button class="task-button chameleon-button" id="cancel-button">
                    <i class="fa-solid fa-xmark"></i> Cancel </button>
                </div>
            </div>
            `;

    let backBtn = document.querySelector("#back-button");
    backBtn.addEventListener("click", () => DOMHandler.tasksView());

    let cancelBtn = document.querySelector("#cancel-button");
    cancelBtn.addEventListener("click", () => DOMHandler.tasksView());

    let selectedPriority;
    let highPriorityBtn = document.querySelector("#high-priority");
    let mediumPriorityBtn = document.querySelector("#medium-priority");
    let lowPriorityBtn = document.querySelector("#low-priority");

    highPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.add("selected-button");
      mediumPriorityBtn.classList.remove("selected-button");
      lowPriorityBtn.classList.remove("selected-button");
      selectedPriority = "high";
    });

    mediumPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("selected-button");
      mediumPriorityBtn.classList.add("selected-button");
      lowPriorityBtn.classList.remove("selected-button");
      selectedPriority = "medium";
    });

    lowPriorityBtn.addEventListener("click", () => {
      highPriorityBtn.classList.remove("selected-button");
      mediumPriorityBtn.classList.remove("selected-button");
      lowPriorityBtn.classList.add("selected-button");
      selectedPriority = "low";
    });

    let selectedDone;
    let doneBtn = document.querySelector("#done-button");
    let notDoneBtn = document.querySelector("#not-done-button");

    doneBtn.addEventListener("click", () => {
      doneBtn.classList.add("selected-button");
      notDoneBtn.classList.remove("selected-button");
      selectedDone = true;
    });

    notDoneBtn.addEventListener("click", () => {
      doneBtn.classList.remove("selected-button");
      notDoneBtn.classList.add("selected-button");
      selectedDone = false;
    });

    let nameInput = document.querySelector("#name-input");
    let descriptionInput = document.querySelector("#description-input");
    let dueDateInput = document.querySelector("#due-date-input");

    let finishBtn = document.querySelector("#finish-button");
    finishBtn.addEventListener("click", () => {
      let newTask = new TodoItem(
        nameInput.value || "New Task",
        descriptionInput.value || "No Description",
        dueDateInput.value || new Date().toISOString().split("T")[0],
        selectedPriority || "medium",
        selectedDone || false
      );
      todos.addTodo(newTask);

      DOMHandler.tasksView();
    });
  }

  return { tasksView, editTask, addTask };
})();

const initDOM = (function () {
  DOMHandler.tasksView();
})();
