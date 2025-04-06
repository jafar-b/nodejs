//Todo Application
// 1. To-Do Manager (Local Data)
// Create a JavaScript module to manage to-dos:
// ● Add, remove, and list tasks
// ● Store tasks in an array (in memory)
// ● Use array methods like filter, map, findIndex

const todos = [];

function addTodo(todo) {
  todos.push({ id: todos.length + 1, todo, done: false });
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
}

function listTodos() {
  return todos.map(
    (todo) => `${todo.id}. ${todo.done ? "[done]" : "[ ]"} ${todo.task}`
  );
}

function markAsComplete(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos[index].done = true;
  }
}

console.log(todos);
todos.push({ id: 1, task: "Task 1", done: false });
todos.push({ id: 2, task: "Task 2", done: false });
markAsComplete(1);
console.log(todos);
console.log("Your Todos are: ");

console.log(listTodos());
