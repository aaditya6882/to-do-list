const Today = document.querySelector("#today");
const AllList = document.querySelector("#AllList");
const Upcoming = document.querySelector("#Upcomming");
const todayStr = new Date().toDateString();

const filterToDo = document.querySelector("#filter-todo");
const filterCritical = document.querySelector("#filter-critical");
const filterCompleted = document.querySelector("#filter-completed");

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navItems = document.querySelector(".nav-items");

  toggle.addEventListener("click", () => {
    navItems.classList.toggle("active");
  });
});

// Button handlers
if (Today) {
  Today.addEventListener("click", () => {
    document.querySelector("#date-day").innerHTML = "Today";
    toDo("today");
  });
}
if (AllList) {
  AllList.addEventListener("click", () => {
    document.querySelector("#date-day").innerHTML = "All List";
    toDo("all");
  });
}
if (Upcoming) {
  Upcoming.addEventListener("click", () => {
    document.querySelector("#date-day").innerHTML = "Upcoming";
    toDo("upcoming");
  });
}

filterToDo?.addEventListener("click", () => {
  document.querySelector("#date-day").innerHTML = "To Do";
  filterTasksByType("ToDo");
});
filterCritical?.addEventListener("click", () => {
  document.querySelector("#date-day").innerHTML = "Critical";
  filterTasksByType("Critical");
});
filterCompleted?.addEventListener("click", () => {
  document.querySelector("#date-day").innerHTML = "Completed";
  filterTasksByType("Completed");
});

async function toDo(filter = "all") {
  const personal = document.querySelector(".Personal .main-container");
  const work = document.querySelector(".Work .main-container");
  const other = document.querySelector(".Other .main-container");
  if (!personal && !work && !other) return;

  try {
    const response = await fetch("/api/todos");
    if (!response.ok) throw new Error("Network response was not ok");
    const todos = await response.json();

    if (personal) personal.innerHTML = "";
    if (work) work.innerHTML = "";
    if (other) other.innerHTML = "";

    todos.forEach((t) => {
      const taskDueDateStr = t.dueDate
        ? new Date(t.dueDate).toDateString()
        : null;

      // Date filtering
      if (filter === "today" && taskDueDateStr !== todayStr) return;
      if (
        filter === "upcoming" &&
        (!taskDueDateStr || new Date(taskDueDateStr) <= new Date(todayStr))
      )
        return;

      appendTaskDiv(t, personal, work, other);
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
  }
}

// Type-based filter function
async function filterTasksByType(type) {
  const personal = document.querySelector(".Personal .main-container");
  const work = document.querySelector(".Work .main-container");
  const other = document.querySelector(".Other .main-container");
  if (!personal && !work && !other) return;

  try {
    const response = await fetch("/api/todos");
    if (!response.ok) throw new Error("Network response was not ok");
    const todos = await response.json();

    if (personal) personal.innerHTML = "";
    if (work) work.innerHTML = "";
    if (other) other.innerHTML = "";

    todos.forEach((t) => {
      const taskType = t.completed
        ? "Completed"
        : t.priority === "Critical"
        ? "Critical"
        : "ToDo";

      if (taskType !== type) return; // Skip non-matching type
      appendTaskDiv(t, personal, work, other);
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
  }
}

function appendTaskDiv(t, personal, work, other) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("List");
  taskDiv.dataset.completed = t.completed ? "true" : "false";
  taskDiv.dataset.id = t._id;

  let color = t.completed
    ? "#3b82f6"
    : t.priority === "Critical"
    ? "#f63b3e"
    : "gray";

  taskDiv.innerHTML = `
    <input type="checkbox" class="select container" />
    <p onclick="window.location.href='/static/description.html?id=${encodeURIComponent(
      t._id
    )}'">${t.title}</p>
    <div class="list-menu-wrapper">
      <span class="list-menu">⋮</span>
      <div class="dropdown-menu">
        <span class="edit-btn">Edit</span>
        <span class="view-btn">View</span>
        <span class="delete-btn">Delete</span>
      </div>
    </div>
    <span class="priority-indicator" style="background-color: ${color};"></span>
  `;

  if (t.category.toLowerCase() === "work" && work) work.appendChild(taskDiv);
  else if (t.category.toLowerCase() === "other" && other)
    other.appendChild(taskDiv);
  else if (personal) personal.appendChild(taskDiv);
}
// Event delegation for dropdowns
document.addEventListener("click", (e) => {
  // Check if the clicked element has class 'list-menu' (the triple dot)
  if (e.target.classList.contains("list-menu")) {
    e.stopPropagation(); // prevent document click from closing it immediately
    const dropdown = e.target.nextElementSibling;
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  } else {
    // Clicked outside, close all dropdowns
    document.querySelectorAll(".dropdown-menu").forEach((drop) => {
      drop.style.display = "none";
    });
  }
});

const deletes = document.querySelector("#delete");

const selectAll = document.querySelector("#selectAll");

selectAll?.addEventListener("change", (e) => {
  const allCheckboxes = document.querySelectorAll(".select");
  allCheckboxes.forEach((box) => {
    box.checked = e.target.checked;
  });
});

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("select")) {
    const anyChecked = [...document.querySelectorAll(".select")].some(
      (box) => box.checked
    );
    deletes.style.display = anyChecked ? "block" : "none";
  }
});
async function deleteTask(taskDiv) {
  try {
    const id = taskDiv.dataset.id;
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (res.ok) taskDiv.remove();
    else console.error("Failed to delete task");
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}
const clearCompleted = document.querySelector(".CompletedClear");
clearCompleted?.addEventListener("click", async () => {
  const allLists = document.querySelectorAll(".List");
  for (const taskDiv of allLists) {
    if (taskDiv.dataset.completed === "true") {
      const title = taskDiv.querySelector("p").textContent.trim();
      await deleteTask(taskDiv);
    }
  }
});

deletes.addEventListener("click", () => {
  const checkedBoxes = document.querySelectorAll(".select:checked");

  for (const box of checkedBoxes) {
    const taskDiv = box.closest(".List");
    if (!taskDiv) continue;

    const title = taskDiv.querySelector("p").textContent.trim();
    deleteTask(taskDiv, title);
  }

  deletes.style.display = "none";
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const taskDiv = e.target.closest(".List");
    if (!taskDiv) return;
    const title = taskDiv.querySelector("p").textContent.trim();
    deleteTask(taskDiv, title);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const taskDiv = e.target.closest(".List");
    const completed = taskDiv.dataset.completed === "true";
    if (completed) {
      alert("Cannot edit completed tasks");
      return;
    }
    if (!taskDiv) return;
    const id = taskDiv.dataset.id;
    const title = taskDiv.querySelector("p").textContent.trim();

    // Redirect to the form page with the title as query param
    window.location.href = `/static/form.html?id=${encodeURIComponent(id)}`;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-btn")) {
    const taskDiv = e.target.closest(".List");
    if (!taskDiv) return;

    const id = taskDiv.dataset.id;
    window.location.href = `/static/description.html?id=${encodeURIComponent(
      id
    )}`;
  }
});

// Initial load
toDo("all");
