const addbtn = document.querySelector(".addbtn");
const ul = document.querySelector(".ul-container");
const input = document.querySelector(".input-btn");
const deletebtn = document.querySelector(".delete-btn");
const editbtn = document.querySelector(".edit-btn");
const search = document.getElementById("search");
const ol = document.getElementById("ol");

const addButtonTexts = {
    ADD: "Add Todo",
    EDIT: "Edit Todo",
};

let todos = [];
let editId = null;

fetch(`https://jsonplaceholder.typicode.com/todos`)
    .then((res) => res.json())
    .then((data) => {
        data.forEach((todo) => {
            addTodo(todo);
        });
    });

addbtn.addEventListener("click", getTodoInTheInput);
search.addEventListener("input", searchFn);

function searchFn() {
    const allItems = ul.querySelectorAll("li");
    allItems.forEach((todo) => {
        if (
            !search.value.trim() ||
            todo
                .getAttribute("data-value")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) === 0
        ) {
            todo.style.display = "flex";
        } else {
            todo.style.display = "none";
        }
    });
}

function addTodo(todo) {
    const li = document.createElement("li");
    const actionsConteiner = document.createElement("div");
    const deleteBtn = document.createElement("span");
    deleteBtn.className = "todo-delete";
    const editBtn = document.createElement("span");
    editBtn.className = "todo-edit";
    const title = document.createElement("span");
    title.className = "todo-title";

    li.className = "item-li todo";
    li.setAttribute("data-id", todo.id);
    li.setAttribute("data-value", todo.title);

    deleteBtn.addEventListener("click", moveToDeletedSection);
    editBtn.addEventListener("click", editItem);

    title.innerText = todo.title;
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    editBtn.innerHTML = `<i class="fas fa-pen-fancy"></i>`;

    li.append(title);
    actionsConteiner.append(deleteBtn);
    actionsConteiner.append(editBtn);
    li.append(actionsConteiner);
    ul.prepend(li);

    todos.unshift(todo);
}

function editTodoById(todo) {
    const todoEl = document.querySelector(`.item-li[data-id="${todo.id}"]`);
    todoEl.querySelector(".todo-title").innerText = todo.title;
    todoEl.setAttribute("data-value", todo.title);

    const todoIndex = todos.findIndex((t) => t.id === todo.id);
    const currentTodoObj = {...todos[todoIndex]};
    currentTodoObj.title = todo.title;
    todos[todoIndex] = currentTodoObj;

    input.value = "";
    todoEl.classList.remove("isEdit");
    editId = null;
    addbtn.innerText = addButtonTexts.ADD;
}

function moveToDeletedSection() {
    const todoItem = this.closest(".item-li");
    const id = todoItem.getAttribute("data-id");
    const todoIndex = todos.findIndex((t) => t.id === +id);
    const currentTodoObj = {...todos[todoIndex]};

    if (currentTodoObj.deleted) {
        // Remove
        todoItem.remove();
        todos.splice(todoIndex, 1);
    } else {
        // Move to deleted Section
        const undo = document.createElement("span");
        undo.className = "todo-undo";
        undo.innerHTML = `<i class="fas fa-undo"></i>`;
        undo.addEventListener("click", undoDelete);
        todoItem.querySelector(".todo-edit").classList.add("hide");

        todoItem.querySelector("div").append(undo);
        ol.append(todoItem);
        currentTodoObj.deleted = true;
        todos[todoIndex] = currentTodoObj;
        console.log(todos);
    }
}

function undoDelete() {
    const todoItem = this.closest(".item-li");
    const id = todoItem.getAttribute("data-id");

    const todoIndex = todos.findIndex((t) => t.id === +id);
    const currentTodoObj = {...todos[todoIndex]};
    delete currentTodoObj.deleted;
    console.log(currentTodoObj);
    todos[todoIndex] = currentTodoObj;

    todoItem.querySelector(".todo-edit").classList.remove("hide");
    todoItem.querySelector(".todo-undo").remove();
    ul.prepend(todoItem);
}

function editItem() {
    const editableElement = document.querySelector(".isEdit");
    if (editableElement) {
        editableElement.classList.remove("isEdit");
    }

    addbtn.innerText = addButtonTexts.EDIT;
    const parent = this.closest(".item-li");
    parent.classList.add("isEdit");
    editId = parent.getAttribute("data-id");
    input.value = parent.getAttribute("data-value");
}

function getTodoInTheInput() {
    if (input.value.trim() !== "") {
        if (editId) {
            // Edit
            const todo = {...todos.find((t) => t.id === +editId)};
            todo.title = input.value;
            editTodoById(todo);
        } else {
            // Add
            const newTodo = {
                userId: 1,
                id: Date.now(),
                title: input.value,
                completed: false,
            };

            addTodo(newTodo);
            input.value = "";
        }
    }
}
