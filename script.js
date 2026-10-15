document.addEventListener("DOMContentLoaded", () => {
  // ---- Theme Toggle System ----
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // ---- Weather Tracker Engine (Live Fetch) ----
  async function fetchWeather() {
    const weatherDesc = document.getElementById("weather-desc");
    const tempElement = document.getElementById("temp");
    try {
      // Using a free, unauthenticated Open-Meteo public endpoint
      const res = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=New+York&units=metric&appid=561f3e07df7d1bda15f800014a038524"
      );
      const data = await res.json();
      if (data && data.main && data.main.temp) {
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDesc.textContent = `${data.name}, ${data.sys.country}`;
      } else {
        weatherDesc.textContent = "Data unavailable";
      }
    } catch (error) {
      weatherDesc.textContent = "Offline mode active";
    }
  }
  fetchWeather();

  // ---- Reactive State Management (Tasks & Analytics) ----
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const counterValue = document.getElementById("counter-value");

  let tasks = JSON.parse(localStorage.getItem("dashboard-tasks")) || [];

  function updateDashboardState() {
    taskList.innerHTML = "";
    let completedCount = 0;

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task.text;
      if (task.completed) {
        li.classList.add("completed");
        completedCount++;
      }

      // Toggle task logic
      li.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveAndUpdate();
      });

      taskList.appendChild(li);
    });

    counterValue.textContent = completedCount;
  }

  function saveAndUpdate() {
    localStorage.setItem("dashboard-tasks", JSON.stringify(tasks));
    updateDashboardState();
  }

  addTaskBtn.addEventListener("click", () => {
    if (taskInput.value.trim() !== "") {
      tasks.push({ text: taskInput.value.trim(), completed: false });
      taskInput.value = "";
      saveAndUpdate();
    }
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTaskBtn.click();
  });

  // Initialize UI on execution
  updateDashboardState();
});
