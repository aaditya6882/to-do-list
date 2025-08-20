document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");

  if (!taskId) {
    alert("No task ID provided!");
    return;
  }

  try {
    const res = await fetch(`/api/todos/${taskId}`);
    if (!res.ok) throw new Error("Failed to fetch task");

    const task = await res.json();

    document.getElementById("task-title").textContent = task.title;
    document.getElementById("task-description").textContent = task.description;
    document.getElementById("task-dueDate").textContent = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : "Not set";

    const btn = document.getElementById("mark-completed-btn");
    if (task.completed) {
      btn.textContent = "Completed!";
      btn.disabled = true;
    } else {
      btn.addEventListener("click", async () => {
        const response = await fetch(`/api/todos/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true }),
        });

        if (!response.ok) throw new Error("Failed to mark completed");

        btn.textContent = "Completed!";
        btn.disabled = true;

        window.location.href = "/static/index.html";
      });
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while loading the task.");
  }
});
