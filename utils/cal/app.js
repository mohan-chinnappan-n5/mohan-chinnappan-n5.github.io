  document.addEventListener("DOMContentLoaded", function () {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const calendar = document.getElementById("calendar");
    const monthYearDisplay = document.getElementById("month-year");

    function generateCalendar2(month, year) {
      calendar.innerHTML = "";
      monthYearDisplay.innerText = `${monthNames[month]} ${year}`;
      
      // Get first and last day of the month
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();

      // Add empty divs for days of the previous month
      for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calendar.appendChild(emptyDiv);
      }

      // Add days with To-Do functionality
      for (let day = 1; day <= lastDay; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const dayDiv = document.createElement("div");
        dayDiv.className = "day p-4 text-center rounded-lg shadow-md cursor-pointer transition duration-300";
        
        const dayIndex = new Date(year, month, day).getDay();
        const isWeekend = dayIndex === 0 || dayIndex === 6;
        dayDiv.classList.add(isWeekend ? "bg-red-100" : "bg-blue-100");

        const dayNumber = document.createElement("div");
        dayNumber.className = "day-number text-lg font-bold";
        dayNumber.innerText = day;
        
        const dayOfWeek = document.createElement("div");
        dayOfWeek.className = "text-sm text-gray-600";
        dayOfWeek.innerText = weekdays[dayIndex];
        
        if (day === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
          dayDiv.classList.add("bg-green-200");
        }

        const todos = JSON.parse(localStorage.getItem(dateKey)) || [];
        todos.forEach(todo => {
          const todoIndicator = document.createElement("p");
          todoIndicator.className = "text-xs text-green-700 mt-1";
          todoIndicator.innerText = `${todo.time || ""} - ${todo.text}`;
          dayDiv.appendChild(todoIndicator);
        });

        dayDiv.appendChild(dayOfWeek);
        dayDiv.appendChild(dayNumber);
        dayDiv.onclick = () => openTodoModal(dateKey);
        calendar.appendChild(dayDiv);
      }
    }
    function generateCalendar(month, year) {
      calendar.innerHTML = "";
      monthYearDisplay.innerText = `${monthNames[month]} ${year}`;
      
      // Get first and last day of the month
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
    
      // Add empty divs for days of the previous month
      for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calendar.appendChild(emptyDiv);
      }
    
      // Add days with To-Do functionality
      for (let day = 1; day <= lastDay; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const dayDiv = document.createElement("div");
        dayDiv.className = "day p-4 text-center rounded-lg shadow-md cursor-pointer transition duration-300";
        
        const dayIndex = new Date(year, month, day).getDay();
        const isWeekend = dayIndex === 0 || dayIndex === 6;
        dayDiv.classList.add(isWeekend ? "bg-red-100" : "bg-blue-100");
    
        const dayNumber = document.createElement("div");
        dayNumber.className = "day-number text-lg font-bold";
        dayNumber.innerText = day;
        
        const dayOfWeek = document.createElement("div");
        dayOfWeek.className = "text-sm text-gray-600";
        dayOfWeek.innerText = weekdays[dayIndex];
        
        if (day === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
          dayDiv.classList.add("bg-green-200");
        }
    
        // Safely retrieve To-Do items for the current dateKey
        let todos;
        try {
          todos = JSON.parse(localStorage.getItem(dateKey)) || [];
        } catch (e) {
          console.error("Error parsing JSON from localStorage", e);
          todos = []; // Fallback to empty array if parsing fails
        }
        
        todos.forEach(todo => {
          const todoIndicator = document.createElement("p");
          todoIndicator.className = "text-xs text-green-700 mt-1";
          todoIndicator.innerText = `${todo.time || ""} - ${todo.text}`;
          dayDiv.appendChild(todoIndicator);
        });
    
        dayDiv.appendChild(dayOfWeek);
        dayDiv.appendChild(dayNumber);
        dayDiv.onclick = () => openTodoModal(dateKey);
        calendar.appendChild(dayDiv);
      }
    }
    function openTodoModal(dateKey) {
      const todos = JSON.parse(localStorage.getItem(dateKey)) || [];
      const todoList = document.getElementById("todo-list");
      todoList.innerHTML = "";

      todos.forEach((todo, index) => {
        const todoItem = document.createElement("div");
        todoItem.className = "p-2 border-b border-gray-200";
        todoItem.innerText = `${todo.time || ""} - ${todo.text}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "text-red-500 text-xs ml-2";
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => {
          todos.splice(index, 1);
          localStorage.setItem(dateKey, JSON.stringify(todos));
          openTodoModal(dateKey);
          generateCalendar(currentMonth, currentYear);
        };

        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);
      });

      document.getElementById("modal-date").innerText = `To-Dos for ${dateKey}`;
      document.getElementById("todo-input").value = "";
      document.getElementById("todo-time").value = "";

      document.getElementById("add-todo").onclick = function () {
        const todoText = document.getElementById("todo-input").value.trim();
        const todoTime = document.getElementById("todo-time").value;
        if (todoText) {
          todos.push({ text: todoText, time: todoTime });
          localStorage.setItem(dateKey, JSON.stringify(todos));
          closeTodoModal();
          generateCalendar(currentMonth, currentYear);
        }
      };

      document.getElementById("todo-modal").classList.remove("hidden");
    }

    function closeTodoModal() {
      document.getElementById("todo-modal").classList.add("hidden");
    }

    document.getElementById("prev-month").onclick = function () {
      currentMonth = (currentMonth - 1 + 12) % 12;
      if (currentMonth === 11) currentYear -= 1;
      generateCalendar(currentMonth, currentYear);
    };

    document.getElementById("next-month").onclick = function () {
      currentMonth = (currentMonth + 1) % 12;
      if (currentMonth === 0) currentYear += 1;
      generateCalendar(currentMonth, currentYear);
    };

    document.getElementById("close-modal").onclick = closeTodoModal;
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
  });