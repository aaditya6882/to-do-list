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

// Dropdown menu
document.querySelectorAll(".list-menu").forEach((menu) => {
  menu.onclick = function (e) {
    e.stopPropagation();
    let dropdown = menu.nextElementSibling;
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  };
});

document.onclick = function () {
  document
    .querySelectorAll(".dropdown-menu")
    .forEach((drop) => (drop.style.display = "none"));
};

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

// Initial load
toDo("all");
