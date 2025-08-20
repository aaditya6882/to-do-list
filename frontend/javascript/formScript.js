// const title = document.getElementById("title");
// const description = document.getElementById("description");
// const dueDate = document.getElementById("due-date");
// const category = document.getElementById("category");
// const priority = document.getElementById("importance");
// const addButton = document.getElementById("submit-btn");

// addButton.addEventListener("click", async () => {
//   const todoData = {
//     title: title.value,
//     description: description.value,
//     dueDate: dueDate.value,
//     category: category.value,
//     priority: priority.value,
//   };

//   try {
//     const response = await fetch("/api/todos", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(todoData),
//     });

//     if (!response.ok) throw new Error("Failed to create todo");

//     alert("Task added successfully!");
//     window.location.href = "/"; // redirect to index.html
//   } catch (err) {
//     console.error("Error creating todo:", err);
//     alert("Error creating todo. Check console.");
//   }
// });

const titleInput = document.querySelector("#title");
const descInput = document.querySelector("#description");
const dateInput = document.querySelector("#due-date");
const categoryInput = document.querySelector("#category");
const priorityInput = document.querySelector("#importance");
const submitBtn = document.querySelector("#submit-btn");

let editing = null;

// Check URL for edit
const params = new URLSearchParams(window.location.search);
const editTitle = params.get("id");

if (editTitle) {
  editing = editTitle;

  (async () => {
    try {
      const res = await fetch(`/api/todos/${encodeURIComponent(editTitle)}`);
      if (!res.ok) throw new Error("Failed to fetch task");

      const task = await res.json();
      titleInput.value = task.title;
      descInput.value = task.description || "";
      dateInput.value = task.dueDate ? task.dueDate.slice(0, 10) : "";
      categoryInput.value = task.category || "Personal";
      priorityInput.value = task.priority || "ToDo";
    } catch (err) {
      console.error(err);
    }
  })();
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const taskData = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    dueDate: dateInput.value,
    category: categoryInput.value,
    priority: priorityInput.value,
  };

  const url = editing
    ? `/api/todos/${encodeURIComponent(editing)}`
    : "/api/todos";
  const method = editing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) throw new Error("Failed to save task");

    alert(editing ? "Task updated!" : "Task added!");
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
  }
});
