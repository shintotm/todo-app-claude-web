/**
 * File: script.js
 * Description: Todo list application with add, toggle, and delete functionality
 * Author: Shinto
 * Date: November 2025
 */

let todos = [];
let currentFilter = 'all';

  function addTodo() {
      const input = document.getElementById('todoInput');
      const prioritySelect = document.getElementById('prioritySelect');
      const todoText = input.value.trim();
      const priority = prioritySelect.value;

      if (todoText === '') {
          alert('Please enter a task!');
          return;
      }

      const todo = {
          id: Date.now(),
          text: todoText,
          completed: false,
          timestamp: Date.now()
          priority: priority
      };

      todos.push(todo);
      input.value = '';
      prioritySelect.value = 'medium'; // Reset to default
      renderTodos();
  }

  function toggleTodo(id) {
      const todo = todos.find(t => t.id === id);
      if (todo) {
          todo.completed = !todo.completed;
          renderTodos();
      }
  }

  function deleteTodo(id) {
      todos = todos.filter(t => t.id !== id);
      renderTodos();
  }

  function updateActiveCounter() {
      const activeTasks = todos.filter(todo => !todo.completed).length;
      const counter = document.getElementById('activeCounter');
      counter.textContent = `Active tasks: ${activeTasks}`;
  }

  function clearCompleted() {
      todos = todos.filter(todo => !todo.completed);
      renderTodos();
  }

  function setFilter(filter) {
      currentFilter = filter;

      // Update active button styling
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('data-filter') === filter) {
              btn.classList.add('active');
          }
      });

      renderTodos();
  }

  function getFilteredTodos() {
      switch(currentFilter) {
          case 'active':
              return todos.filter(todo => !todo.completed);
          case 'completed':
              return todos.filter(todo => todo.completed);
          case 'all':
          default:
              return todos;
      }
  }

  function renderTodos() {
      const todoList = document.getElementById('todoList');
      todoList.innerHTML = '';

      const filteredTodos = getFilteredTodos();

      filteredTodos.forEach(todo => {
          const li = document.createElement('li');
          li.className = 'todo-item' + (todo.completed ? ' completed' : '');
          const priority = todo.priority || 'medium'; // Default to medium for old todos
          li.innerHTML = `
              <input type="checkbox"
                     ${todo.completed ? 'checked' : ''}
                     onchange="toggleTodo(${todo.id})">
              <span class="priority-badge priority-${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
              <span style="margin-left: 10px;">${todo.text}</span>
              <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
          `;
          todoList.appendChild(li);
      });

      // Update active counter and clear completed button visibility
      updateActiveCounter();
      const clearBtn = document.getElementById('clearCompletedBtn');
      const completedTasks = todos.filter(todo => todo.completed).length;
      clearBtn.style.display = completedTasks > 0 ? 'block' : 'none';
  }

  // Dark Mode Toggle Functionality
  function toggleDarkMode() {
      const body = document.body;
      const darkModeToggle = document.getElementById('darkModeToggle');

      body.classList.toggle('dark-mode');

      // Update button text based on current mode
      if (body.classList.contains('dark-mode')) {
          darkModeToggle.textContent = '☀️ Light Mode';
          localStorage.setItem('darkMode', 'enabled');
      } else {
          darkModeToggle.textContent = '🌙 Dark Mode';
          localStorage.setItem('darkMode', 'disabled');
      }
  }

  // Load dark mode preference on page load
  function loadDarkModePreference() {
      const darkMode = localStorage.getItem('darkMode');
      const body = document.body;
      const darkModeToggle = document.getElementById('darkModeToggle');

      if (darkMode === 'enabled') {
          body.classList.add('dark-mode');
          darkModeToggle.textContent = '☀️ Light Mode';
      }
  }

  // Export todos to JSON file
  function exportTodos() {
      // Create export data with all required fields
      const exportData = todos.map(todo => ({
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
          timestamp: todo.timestamp || todo.id // Use timestamp if available, fallback to id
      }));

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create a Blob with the JSON data
      const blob = new Blob([jsonString], { type: 'application/json' });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'todos.json';

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  }

  // Allow Enter key to add todo
  document.addEventListener('DOMContentLoaded', function() {
      const input = document.getElementById('todoInput');
      input.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
              addTodo();
          }
      });

      // Set up dark mode toggle
      const darkModeToggle = document.getElementById('darkModeToggle');
      darkModeToggle.addEventListener('click', toggleDarkMode);

      // Load dark mode preference
      loadDarkModePreference();
  });
