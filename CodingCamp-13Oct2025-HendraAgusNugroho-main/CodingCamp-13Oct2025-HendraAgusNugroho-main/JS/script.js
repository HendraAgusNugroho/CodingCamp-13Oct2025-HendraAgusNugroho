
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const filterBtn = document.getElementById('filterBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const todoListEl = document.getElementById('todoList');
const todoForm = document.getElementById('todoForm');

let todos = JSON.parse(localStorage.getItem('todos_v1')) || [];
let filterState = localStorage.getItem('filter_v1') || 'all'; 


function formatDue(dateIso){
  if(!dateIso) return '';
  const d = new Date(dateIso);
  
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const yy = d.getFullYear();
  return `${mm}/${dd}/${yy}`;
}

function save() {
  localStorage.setItem("todos_v1", JSON.stringify(todos));
  localStorage.setItem("filter_v1", filterState);
}

function render() {
  todoListEl.innerHTML = "";

  const filtered = todos.filter((t) => {
    if (filterState === "all") return true;
    if (filterState === "pending") return !t.done;
    if (filterState === "done") return t.done;
  });

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "no-task";
    td.colSpan = 4;
    td.textContent = "No task found";
    tr.appendChild(td);
    todoListEl.appendChild(tr);
    highlightFilterLabel();
    return;
  }

  filtered.forEach((t, idx) => {
    
    const originalIndex = todos.findIndex(x => x.id === t.id);

    const tr = document.createElement("tr");

    const tdTask = document.createElement("td");
    tdTask.textContent = t.text;
    if (t.done) tdTask.style.textDecoration = "line-through";

    const tdDate = document.createElement("td");
    tdDate.textContent = formatDue(t.due);

    const tdStatus = document.createElement("td");
    tdStatus.textContent = t.done ? "Done" : "Pending";

    const tdActions = document.createElement("td");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "action-btn toggle";
    toggleBtn.textContent = t.done ? "Mark Pending" : "Mark Done";
    toggleBtn.addEventListener("click", () => {
      todos[originalIndex].done = !todos[originalIndex].done;
      save();
      render();
    });

    
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn remove';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      if(!confirm('Delete this task?')) return;
      todos.splice(originalIndex, 1);
      save();
      render();
    });

    tdActions.appendChild(toggleBtn);
    tdActions.appendChild(delBtn);

    tr.appendChild(tdTask);
    tr.appendChild(tdDate);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    todoListEl.appendChild(tr);
  });

  highlightFilterLabel();
}

function highlightFilterLabel(){
  
  const map = {
    all: "FILTER • ALL",
    pending: "FILTER • PENDING",
    done: "FILTER • DONE",
  };
  filterBtn.textContent = map[filterState] || "FILTER";
}


function addTodo(e){
  if(e) e.preventDefault();
  const text = taskInput.value.trim();
  const due = dateInput.value;
  if (!text || !due) {
    alert("Isi task dan tanggal sebelum menambah.");
    return;
  }
  const newTodo = {
    id: Date.now() + Math.random().toString(16).slice(2, 8),
    text,
    due,
    done: false,
  };
  todos.unshift(newTodo); 
  taskInput.value = '';
  dateInput.value = '';
  save();
  render();
}


function cycleFilter(){
  if(filterState === 'all') filterState = 'pending';
  else if(filterState === 'pending') filterState = 'done';
  else filterState = 'all';
  save();
  render();
}

function deleteAll() {
  if (todos.length === 0) return alert("Tidak ada task untuk dihapus.");
  if (!confirm("Delete ALL tasks?")) return;
  todos = [];
  save();
  render();
}


todoForm.addEventListener('submit', addTodo);
addBtn.addEventListener('click', (e) => {
  
});

filterBtn.addEventListener("click", cycleFilter);
deleteAllBtn.addEventListener("click", deleteAll);


render();


window._TODO = { todos, render };
