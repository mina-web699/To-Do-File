/* ==========================================================================
   1. Variables & Selectors
   ========================================================================== */
// مصفوفات البيانات والتحميل من الـ Local Storage
let taskData = JSON.parse(localStorage.getItem("tasks")) || [];
let noteData = JSON.parse(localStorage.getItem("notes")) || [];
let currentFilter = "all"; // يمكن أن يكون: all, pending, completed, notes

// عناصر الإدخال والتحكم المشتركة
const btnAdd = document.getElementById("add-task-btn");
const inputText = document.getElementById("task-input");

// عناصر الفلترة والـ Tabs فوق
const btnAll = document.getElementById("all-tasks");
const btnPending = document.getElementById("pending-tasks");
const btnCompleted = document.getElementById("completed-tasks");
const btnNotesTab = document.getElementById("notes-tab"); 

// الحاويات الكبيرة (الWrapper الخاص بكل صفحة)
const tasksWrapper = document.getElementById("tasks-wrapper");
const notesWrapper = document.getElementById("notes-wrapper");

// الحاويات الداخلية اللي بنرسم جواها العناصر
const container = document.getElementById("tasks-container");
const notesContainer = document.getElementById("notes-container");

/* ==========================================================================
   2. Event Listeners (الـ Tabs والتبديل بين الصفحات)
   ========================================================================== */

// عند الضغط على زرار All Tasks
btnAll.addEventListener("click", () => {
  currentFilter = "all";
  updateFilterButtons(btnAll);
  switchPage("tasks");
  renderTask();
});

// عند الضغط على زرار Active
btnPending.addEventListener("click", () => {
  currentFilter = "pending";
  updateFilterButtons(btnPending);
  switchPage("tasks");
  renderTask();
});

// عند الضغط على زرار Completed
btnCompleted.addEventListener("click", () => {
  currentFilter = "completed";
  updateFilterButtons(btnCompleted);
  switchPage("tasks");
  renderTask();
});

// 🔥 عند الضغط على زرار الـ Notes الجديد (يفتح صفحة الملاحظات)
btnNotesTab.addEventListener("click", () => {
  currentFilter = "notes";
  updateFilterButtons(btnNotesTab);
  switchPage("notes");
  renderNotes();
});

// دالة لتحديث كلاس الـ Active على الأزرار فوق
function updateFilterButtons(activeButton) {
  [btnAll, btnPending, btnCompleted, btnNotesTab].forEach((btn) => {
    btn.classList.remove("active");
  });
  activeButton.classList.add("active");
}



const noteInput = document.getElementById("note-input");

function switchPage(pageName) {
  if (pageName === "tasks") {
    tasksWrapper.style.display = "block";
    notesWrapper.style.display = "none";

    inputText.style.display = "block"; 
    noteInput.style.display = "none";
    btnAdd.innerText = "Add Task";
  } else if (pageName === "notes") {
    tasksWrapper.style.display = "none";
    notesWrapper.style.display = "block";

    inputText.style.display = "none"; 
    noteInput.style.display = "block"; 
    btnAdd.innerText = "Add Note";
  }
}

/* ==========================================================================
   3. الذكاء الاصطناعي لزرار الإضافة المشترك (Add Button)
   ========================================================================== */
btnAdd.addEventListener("click", () => {
  // 1. لو واقفين في صفحة الملاحظات (بنقرأ ونفحص الـ textarea)
  if (currentFilter === "notes") {
    if (noteInput.value.trim() !== "") {
      const newNote = {
        id: Date.now(),
        text: noteInput.value, 
      };
      noteData.push(newNote);
      noteInput.value = ""; // تفريغ مساحة الكتابة
      renderNotes();
      noteInput.focus(); // إرجاع المؤشر للكتابة فوراً
    }
  }

  // 2. لو واقفين في صفحة المهام (بنقرأ ونفحص الـ input الصغير)
  else {
    if (inputText.value.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: inputText.value,
        completed: false,
      };
      taskData.push(newTask);
      inputText.value = "";
      renderTask();
      inputText.focus();
    }
  }
});

/* ==========================================================================
   4. Core Functions (الـ Render والـ Save)
   ========================================================================== */

// دالة عرض وتصفية المهام
function renderTask() {
  container.innerHTML = "";
  let filteredTask = [];

  if (currentFilter === "all") {
    filteredTask = taskData;
  } else if (currentFilter === "pending") {
    filteredTask = taskData.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTask = taskData.filter((task) => task.completed);
  }

  filteredTask.forEach((task) => {
    const div = document.createElement("div");
    div.classList.add("task-item");

    if (task.completed) {
      div.classList.add("completed");
    }

    const myDiv = document.createElement("div");
    myDiv.classList.add("custom-checkbox");

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.innerText = task.text;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerHTML = "&times;";

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");
    taskLeft.append(myDiv);
    taskLeft.append(span);

    div.append(taskLeft);
    div.append(delBtn);
    container.append(div);

    // حذف مهمة
    delBtn.addEventListener("click", () => {
      taskData = taskData.filter((ele) => ele.id !== task.id);
      renderTask();
    });

    // تشيك بوكس المهمة
    myDiv.addEventListener("click", () => {
      task.completed = !task.completed;
      renderTask();
    });
  });
  saveData();
}

// 🔥 دالة عرض الملاحظات في صفحتها المستقلة
function renderNotes() {
  notesContainer.innerHTML = "";

  noteData.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("note-item");

    const span = document.createElement("span");
    span.classList.add("note-text");
    span.innerText = note.text;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerHTML = "&times;";

    div.append(span);
    div.append(delBtn);
    notesContainer.append(div);

    // حذف الملاحظة
    delBtn.addEventListener("click", () => {
      noteData = noteData.filter((ele) => ele.id !== note.id);
      renderNotes();
    });
  });
  saveNotes();
}

// دوال التخزين في الـ Local Storage
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(taskData));
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(noteData));
}

// تشغيل العرض التلقائي أول ما نفتح الصفحة
renderTask();
renderNotes();


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("Service Worker Registered Successfully!"))
    .catch((err) => console.log("Service Worker Failed", err));
}