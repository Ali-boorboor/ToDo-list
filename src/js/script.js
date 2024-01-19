// constants
const $ = document;
const addItemInput = $.getElementById("add-item-input");
const addItemBtn = $.getElementById("add-item-btn");

//  functions
//  get function to get datas from localStorage & return array from datas
function getLocalData() {
  let todosArray = [];
  todosArray = JSON.parse(localStorage.getItem("todos"));
  !todosArray ? todosArray = [] : null;     // if the todosArray was empty or falsy value return empty array
  return todosArray;
};

//  will generate html template for each todo item, dynamic with that item`s title
function generateDomTodos(dataArray = getLocalData()) {
  const todoItemsBox = $.getElementById("todo-items-wrapper");
  todoItemsBox.innerHTML = '';
  dataArray.forEach((todos) => {
    todoItemsBox.insertAdjacentHTML("beforeend",   // it will check to see if status property of todo item is true or not then may give line-through style
    `<li id="todo-list-item" class="w-full flex justify-between items-center font-bold text-lg capitalize rounded-full py-2 px-6 ring-2 ring-white bg-sky-400 text-black dark:text-white dark:bg-gray-500">
    <p id="todo-list-item__title" class="cursor-pointer ${todos.status && "line-through opacity-40"}">${todos.title}</p>
    <svg id="todo-list-item__remove-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
    </li> `
    );
  });
};


function setToLocalStorage (param) {
  localStorage.setItem("todos", JSON.stringify(param));
};


function setNewTodo () {
  const alertModalBox = $.getElementById('alert-modal');
  const newTodoTitle = addItemInput.value.trim().toLowerCase();
  const dataArray = getLocalData();
  if (newTodoTitle && newTodoTitle !== '&nbsp') {
    dataArray.push({
      id: dataArray.length + 1,
      title: newTodoTitle,
      status: false
    });
  } else {
    alertModalBox.classList.remove('hidden');
    setTimeout(() => {
      alertModalBox.classList.add('hidden');
    }, 3000);
  };
  addItemInput.value = '';
  setToLocalStorage(dataArray);
  getLocalData();
  generateDomTodos();
  updateTodos();
  removeTodo();
};


function updateTodos (dataArray = getLocalData()) {
  const todoItemTitle = $.querySelectorAll("#todo-list-item__title");
  todoItemTitle.forEach(todo => {
    todo.addEventListener("click", function () {
      const selectedTodo = dataArray.find(data => data.title === this.textContent);
      if (selectedTodo.status) {
        this.classList.remove("line-through");
        this.classList.remove("opacity-40");
        selectedTodo.status = false;
        setToLocalStorage(dataArray);
      } else {
        this.classList.add("line-through");
        this.classList.add("opacity-40");
        selectedTodo.status = true;
        setToLocalStorage(dataArray);
      };
    });
  });
};


function removeTodo (dataArray = getLocalData()) {
  const removeBtn = $.querySelectorAll("#todo-list-item__remove-icon");
  removeBtn.forEach(todo => {
    todo.addEventListener("click", function () {
      this.parentElement.remove();
      const selectedTodo = dataArray.findIndex(data => data.title === this.previousElementSibling.textContent);
      dataArray.splice(selectedTodo, 1);
      setToLocalStorage(dataArray);
    });
  });
}

// events
// onload event to set things right even when the page got refresh 
window.addEventListener("load", () => {
  getLocalData();
  generateDomTodos();
  updateTodos();
  removeTodo();
});

//  if enter got pressed on input set the new todo item 
addItemInput.addEventListener("keypress", (event) => {
  event.keyCode === 13 && setNewTodo();
});

//  if add button got clicked set the new todo item
addItemBtn.addEventListener("click", setNewTodo);