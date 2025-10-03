// const form = document.getElementById("addForm");
// const input = document.getElementById("input");
// const btn = document.querySelector("#addForm button");

// const taskList = document.getElementById("taskList");
// const liChecked = document.querySelectorAll("#taskList li");
// const span = document.querySelectorAll("#taskList li span");
// const btnList = document.querySelectorAll("#taskList li button");

// let li = document.createElement("li");
// li.innerHTML = "<span></span><button class='delete-btn'>✕</button>";

// taskList.addEventListener("click", (e) => {
//   if (e.target.tagName === "LI") {
//     e.target.classList.toggle("checked");
//     saveTasks();
//   }

//   if (e.target.tagName === "BUTTON") {
//     e.target.parentElement.remove();
//     saveTasks();
//   }
// });

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   if (input.value.trim() === "") {
//     return;
//   }

//   taskList.appendChild(li.cloneNode(true));

//   const lastLi = taskList.lastElementChild;
//   const lastSpan = lastLi.querySelector("span");

//   lastSpan.textContent = input.value;
//   input.value = "";

//   saveTasks();
// });

// // دي معرفش فيها حاجه بس حفيت اضيف زي saveTasks
// // يخزن المهام في التخزين المحلي
// function saveTasks() {
//   const tasks = [];
//   taskList.querySelectorAll("li").forEach((li) => {
//     tasks.push({
//       text: li.querySelector("span").textContent,
//       checked: li.classList.contains("checked"),
//     });
//   });
//   localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// function loadTasks() {
//   const saved = JSON.parse(localStorage.getItem("tasks")) || [];
//   saved.forEach((task) => {
//     const liClone = li.cloneNode(true);
//     liClone.querySelector("span").textContent = task.text;
//     if (task.checked) liClone.classList.add("checked");
//     taskList.appendChild(liClone);
//   });
// }

// loadTasks();

// -----------------------------------------------------------------------------------
// | انا معملش اي حاجه من الكود اللي تحت ده و مش عارف فيه اي حاجه عشان كنت غايب |
// -----------------------------------------------------------------------------------
//
//

const form = document.getElementById("addForm");
const input = document.getElementById("input");
const taskList = document.getElementById("taskList");

// **متغيرات وأزرار التحكم في السجل (History) الجديدة**
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
let history = []; // مكدس السجل لتخزين حالات القائمة السابقة
let historyIndex = -1; // مؤشر للحالة الحالية في مكدس السجل
const maxHistorySize = 50; // حد أقصى لحجم السجل

// **عنصر الـ li الأساسي لاستنساخه**
let liTemplate = document.createElement("li");
liTemplate.innerHTML = "<span></span><button class='delete-btn'>✕</button>";

// ------------------------------------------------------------------
// 1. وظائف السجل (History Functions)
// ------------------------------------------------------------------

// وظيفة لحفظ الحالة الحالية في مكدس السجل
function saveState() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      checked: li.classList.contains("checked"),
    });
  });

  // حذف الحالات اللاحقة عند إضافة حالة جديدة (لإلغاء أي Redo كان متاحاً)
  history = history.slice(0, historyIndex + 1);

  // إضافة الحالة الجديدة إلى السجل
  history.push(tasks);

  // الحفاظ على حجم السجل بحد أقصى (لإزالة أقدم الحالات)
  if (history.length > maxHistorySize) {
    history.shift(); // إزالة العنصر الأول (الأقدم)
  }

  // تحديث المؤشر للحالة الجديدة
  historyIndex = history.length - 1;

  updateHistoryButtons();
  saveTasksToLocalStorage(); // حفظ المهام في التخزين المحلي أيضاً
}

// وظيفة لاستعادة حالة معينة من السجل وعرضها
function restoreState(tasks) {
  // مسح القائمة الحالية بالكامل
  taskList.innerHTML = "";

  // بناء القائمة بناءً على الحالة المستعادة
  tasks.forEach((task) => {
    const liClone = liTemplate.cloneNode(true);
    liClone.querySelector("span").textContent = task.text;
    if (task.checked) liClone.classList.add("checked");
    taskList.appendChild(liClone);
  });
}

// وظيفة لتحديث حالة أزرار Undo/Redo (مُفعلة/معطلة)
function updateHistoryButtons() {
  // زر Undo يكون مُفعل إذا كان المؤشر أكبر من أول عنصر في السجل
  undoBtn.disabled = historyIndex <= 0;

  // زر Redo يكون مُفعل إذا كان المؤشر قبل آخر عنصر في السجل
  redoBtn.disabled = historyIndex >= history.length - 1;
}

// ------------------------------------------------------------------
// 2. معالجة أحداث التراجع والإعادة (Undo/Redo Event Handlers)
// ------------------------------------------------------------------

undoBtn.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--; // الرجوع إلى الحالة السابقة
    restoreState(history[historyIndex]);
    updateHistoryButtons();
    saveTasksToLocalStorage();
  }
});

redoBtn.addEventListener("click", () => {
  if (historyIndex < history.length - 1) {
    historyIndex++; // التقدم إلى الحالة التالية
    restoreState(history[historyIndex]);
    updateHistoryButtons();
    saveTasksToLocalStorage();
  }
});

// ------------------------------------------------------------------
// 3. تحديث وظائف القائمة لاستخدام saveState
// ------------------------------------------------------------------

// حفظ المهام في التخزين المحلي (Local Storage) - تم تعديلها لتكون منفصلة
function saveTasksToLocalStorage() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      checked: li.classList.contains("checked"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// وظيفة التحميل من التخزين المحلي
function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  restoreState(saved); // استعادة الحالة من الذاكرة المحلية

  // حفظ الحالة الأولية في السجل بعد التحميل
  saveState();
}

taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveState(); // تغيير حالة => حفظ الحالة
  }

  if (e.target.tagName === "BUTTON") {
    e.target.parentElement.remove();
    saveState(); // حذف مهمة => حفظ الحالة
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value.trim() === "") {
    return;
  }

  taskList.appendChild(liTemplate.cloneNode(true));

  const lastLi = taskList.lastElementChild;
  const lastSpan = lastLi.querySelector("span");

  lastSpan.textContent = input.value;
  input.value = "";

  saveState(); // إضافة مهمة => حفظ الحالة
});

// ابدأ بتحميل المهام وحفظ الحالة الأولية
loadTasks();
