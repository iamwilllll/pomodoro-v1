/* Wait for DOM to load */
document.addEventListener('DOMContentLoaded', () => {
    const taskFormHTML = document.querySelector('#task-form');

    // Listen for form submit event
    taskFormHTML.addEventListener('submit', taskManager.handleFormSubmit);
    // Load tasks from localStorage to DOM
    taskManager.addTasksToDOM();
});

/* Classes */
class Task {
    constructor() {
        // Initialize tasks array from localStorage or empty array
        this.tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        // Get task input element
        const taskInputHTML = document.querySelector('#task-input');

        if (taskInputHTML.value.trim()) taskManager.saveNewTask(taskInputHTML.value);
        
        taskManager.clearInput(taskInputHTML);
    }

    saveNewTask(inputTaskValue) {
        // Validate type and content
        if (typeof inputTaskValue !== 'string' || !inputTaskValue.trim()) return;

        const newTask = {
            taskTitle: inputTaskValue,
            taskID: performance.now()
        };

        this.tasksArray = [...this.tasksArray, newTask];

        // Send input value to storage handler
        taskManager.addTasksToLocalStorage();
    }

    addTasksToLocalStorage() {
        if (!this.tasksArray || this.tasksArray.length === 0) {
            localStorage.removeItem('tasks');
            return;
        }

        // Validate before saving
        localStorage.setItem('tasks', JSON.stringify(this.tasksArray));

        // Refresh DOM task list
        taskManager.addTasksToDOM();
    }

    addTasksToDOM() {
        // Retrieve tasks from localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks'));

        // Exit if no tasks exist
        if (!tasks) return;

        const taskContainerHTML = document.querySelector('#task-container');
        taskContainerHTML.innerHTML = ''; // Clear container

        tasks.forEach(taskValue => {
            const { taskTitle, taskID } = taskValue;
            // Create list item
            const LI = document.createElement('LI');

            // Create checkbox input
            const INPUT = document.createElement('input');
            INPUT.type = 'checkbox';
            INPUT.setAttribute('data-id', taskID);
            INPUT.id = taskID;

            // Create task label
            const LABEL = document.createElement('LABEL');
            LABEL.htmlFor = taskID;
            LABEL.textContent = taskTitle;

            // Assemble components
            LI.append(INPUT, LABEL);

            // Add to container
            taskContainerHTML.appendChild(LI);
        });
    }

    clearInput(input) {
        input.value = '';
    }
}

// Create task manager instance
const taskManager = new Task();
