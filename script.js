// DOM Elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const taskCounter = document.getElementById("task-counter");
const clearCompletedBtn = document.getElementById("clear-completed");

// Array to track existing tasks
let existingTasks = [];

// Add new task (with duplicate check)
function addTask() {
    const taskText = inputBox.value.trim();
    
    if(taskText === '') {
        showNotification("🌸 Please write your task first!");
        inputBox.focus();
        return;
    }
    
    // Check for duplicate task (case insensitive)
    if(existingTasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        showNotification("⚠️ This task already exists!");
        inputBox.value = "";
        inputBox.focus();
        return;
    }
    
    let li = document.createElement("li");
    li.innerHTML = taskText;
    listContainer.appendChild(li);
    
    let span = document.createElement("span");
    span.innerHTML = '<i class="fas fa-trash-alt"></i>';
    span.setAttribute("aria-label", "Delete task");
    li.appendChild(span);
    
    // Add to existing tasks array
    existingTasks.push({
        text: taskText,
        element: li
    });
    
    inputBox.value = "";
    updateTaskCounter();
    saveData();
    showNotification("✨ Task added successfully!");
}

// Click event for list container
listContainer.addEventListener("click", function(e) {
    if(e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        updateTaskCounter();
        saveData();
        const notification = e.target.classList.contains("checked") 
            ? "🌟 Task completed! Great job!" 
            : "📝 Task marked incomplete";
        showNotification(notification);
    }
    else if(e.target.tagName === "SPAN" || e.target.parentElement.tagName === "SPAN") {
        const taskItem = e.target.closest("li");
        const taskText = taskItem.textContent.trim();
        
        // Remove from existing tasks array
        existingTasks = existingTasks.filter(task => task.element !== taskItem);
        
        taskItem.remove();
        updateTaskCounter();
        saveData();
        showNotification(`🗑️ "${taskText}" deleted`);
    }
}, false);

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function() {
    const completedTasks = document.querySelectorAll(".checked");
    if(completedTasks.length === 0) {
        showNotification("🌸 No completed tasks to clear!");
        return;
    }
    
    completedTasks.forEach(task => {
        // Remove from existing tasks array
        existingTasks = existingTasks.filter(t => t.element !== task);
        task.remove();
    });
    
    updateTaskCounter();
    saveData();
    showNotification(`✨ Cleared ${completedTasks.length} completed tasks!`);
});

// Update task counter
function updateTaskCounter() {
    const totalTasks = listContainer.children.length;
    const completedTasks = document.querySelectorAll(".checked").length;
    taskCounter.textContent = `${completedTasks}/${totalTasks} tasks completed`;
    
    // Change color based on progress
    if(completedTasks === totalTasks && totalTasks > 0) {
        taskCounter.style.color = "#ff69b4";
        taskCounter.innerHTML += " 🎉";
    } else {
        taskCounter.style.color = "#d35d8a";
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("fade-out");
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem("todoData", listContainer.innerHTML);
}

// Load data from localStorage
function showTask() {
    const savedData = localStorage.getItem("todoData");
    if(savedData) {
        listContainer.innerHTML = savedData;
        
        // Rebuild existingTasks array
        existingTasks = [];
        document.querySelectorAll("#list-container li").forEach(li => {
            existingTasks.push({
                text: li.textContent.replace('×', '').trim(),
                element: li
            });
        });
    }
    updateTaskCounter();
}

// Initialize the app
showTask();

// Add task when pressing Enter
inputBox.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        addTask();
    }
});

// Focus input box on page load
window.addEventListener("load", function() {
    inputBox.focus();
});