const form = document.getElementById("addForm");
const input = document.getElementById("input");
const btn = document.querySelector("#addForm button");

const taskList = document.getElementById("taskList");
const liChecked = document.querySelectorAll("#taskList li");
const span = document.querySelectorAll("#taskList li span");
const btnList = document.querySelectorAll("#taskList li button");

let li = document.createElement("li");
li.innerHTML = "<span></span><button class='delete-btn'>✕</button>";

taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveTasks();
  }

  if (e.target.tagName === "BUTTON") {
    e.target.parentElement.remove();
    saveTasks();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value.trim() === "") {
    return;
  }

  taskList.appendChild(li.cloneNode(true));

  const lastLi = taskList.lastElementChild;
  const lastSpan = lastLi.querySelector("span");

  lastSpan.textContent = input.value;
  input.value = "";

  saveTasks();
});

// دي معرفش فيها حاجه بس حفيت اضيف زي saveTasks
// يخزن المهام في التخزين المحلي
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      checked: li.classList.contains("checked"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach((task) => {
    const liClone = li.cloneNode(true);
    liClone.querySelector("span").textContent = task.text;
    if (task.checked) liClone.classList.add("checked");
    taskList.appendChild(liClone);
  });
}

loadTasks();
