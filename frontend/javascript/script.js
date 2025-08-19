const Today = document.querySelector("#today");
const AllList = document.querySelector("#AllList");
const Upcoming = document.querySelector("#Upcomming");
const todayStr = new Date().toDateString();

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

// Main toDo function with filter
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

      // Filtering logic
      if (filter === "today" && taskDueDateStr !== todayStr) return;
      if (
        filter === "upcoming" &&
        (!taskDueDateStr || new Date(taskDueDateStr) <= new Date(todayStr))
      )
        return;

      const taskDiv = document.createElement("div");
      taskDiv.classList.add("List");
      taskDiv.dataset.completed = t.completed ? "true" : "false";
      let color = "";
      if (t.completed) {
        color = "blue";
      } else if (t.priority === "Critical") {
        color = "red";
      } else if (t.priority === "ToDo") {
        color = "gray";
      }
      taskDiv.innerHTML = `
        <input type="checkbox" class="select container" />
        <p onclick="window.location.href='/static/description.html?title=${encodeURIComponent(
          t.title
        )}'">
          ${t.title}
        </p>
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

      if (t.category.toLowerCase() === "work" && work)
        work.appendChild(taskDiv);
      else if (t.category.toLowerCase() === "other" && other)
        other.appendChild(taskDiv);
      else if (personal) personal.appendChild(taskDiv);
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
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
async function deleteTask(taskDiv, title) {
  try {
    const res = await fetch(`/api/todos/${encodeURIComponent(title)}`, {
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
      await deleteTask(taskDiv, title);
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
    if (!taskDiv) return;

    const title = taskDiv.querySelector("p").textContent.trim();

    // Redirect to the form page with the title as query param
    window.location.href = `/static/form.html?title=${encodeURIComponent(
      title
    )}`;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-btn")) {
    const taskDiv = e.target.closest(".List");
    if (!taskDiv) return;

    const title = taskDiv.querySelector("p").textContent.trim();
    window.location.href = `/static/description.html?title=${encodeURIComponent(
      title
    )}`;
  }
});
// Initial load
toDo("all");
