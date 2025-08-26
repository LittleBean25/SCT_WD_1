const taskInput = document.getElementById("taskInput");
const taskDateTime = document.getElementById("taskDateTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

function updateCounters() {
  const total = taskList.children.length;
  const completed = document.querySelectorAll("#taskList .completed").length;
  totalTasksEl.textContent = `Total: ${total}`;
  completedTasksEl.textContent = `Completed: ${completed}`;
}

// live date-time top left
function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const dateStr = now.toLocaleDateString(undefined, options);
  const timeStr = now.toLocaleTimeString();
  document.getElementById("date-time").textContent = `${dateStr} | ${timeStr}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  const taskDateVal = taskDateTime.value;

  if (taskText === "") return;

  const li = document.createElement("li");

  // checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  // task content wrapper
  const taskContent = document.createElement("div");
  taskContent.classList.add("task-text");

  const span = document.createElement("span");
  span.textContent = taskText;

  taskContent.appendChild(span);

  // date-time display if added
  if (taskDateVal) {
    const small = document.createElement("small");
    small.style.color = "#ffd6e7";
    small.style.fontSize = "12px";
    small.textContent = "📅 " + taskDateVal.replace("T", " ");
    taskContent.appendChild(small);
  }

  // edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.classList.add("edit-input");

    taskContent.replaceChild(input, span);
    input.focus();

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") saveEdit();
    });
    input.addEventListener("blur", saveEdit);

    function saveEdit() {
      span.textContent = input.value.trim() || "Untitled Task";
      taskContent.replaceChild(span, input);
    }
  });

  // delete button
  const delBtn = document.createElement("button");
  delBtn.innerHTML = "✖";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => {
    li.remove();
    updateCounters();
  });

  // checkbox toggle
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      span.classList.add("completed");
    } else {
      span.classList.remove("completed");
    }
    updateCounters();
  });

  // assemble
  li.appendChild(checkbox);
  li.appendChild(taskContent);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  // reset inputs
  taskInput.value = "";
  taskDateTime.value = "";

  updateCounters();
}
