const title = document.getElementById("title");
const description = document.getElementById("description");
const dueDate = document.getElementById("due-date");
const category = document.getElementById("category");
const priority = document.getElementById("importance");
const addButton = document.getElementById("submit-btn");

addButton.addEventListener("click", async () => {
  const todoData = {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    category: category.value,
    priority: priority.value,
  };

  try {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) throw new Error("Failed to create todo");

    alert("Task added successfully!");
    window.location.href = "/"; // redirect to index.html
  } catch (err) {
    console.error("Error creating todo:", err);
    alert("Error creating todo. Check console.");
  }
});
