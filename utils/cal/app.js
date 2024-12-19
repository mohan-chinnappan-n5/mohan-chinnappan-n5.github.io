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


    document.getElementById("print-month").onclick = function() {
      const originalContent = document.body.innerHTML;
      const printContent = document.getElementById("calendar").outerHTML;
      document.body.innerHTML = `<div style="margin:20px; text-align:center;">
                                   <h1>${monthYearDisplay.innerText}</h1>
                                   ${printContent}
                                 </div>`;
      window.print();
      document.body.innerHTML = originalContent;
    };


    function generateCalendar(month, year) {
        calendar.innerHTML = "";
        monthYearDisplay.innerText = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
      
        for (let i = 0; i < firstDay; i++) {
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'day empty';
          calendar.appendChild(emptyDiv);
        }
      
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
          
          // Highlight current day
          if (day === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            dayDiv.classList.add("bg-green-300", "text-white", "border-2", "border-green-500");
          }
      
          const holiday = isHoliday(year, month, day) || false;
          if (holiday) {
            const holidayName = document.createElement("p");
            holidayName.className = "text-xs text-red-700 mt-1 font-bold";
            holidayName.innerText = holiday.name;
            dayDiv.classList.add("bg-yellow-200");
            dayDiv.appendChild(holidayName);
          }
      
          let todos;
          try {
            todos = JSON.parse(localStorage.getItem(dateKey)) || [];
          } catch (e) {
            console.error("Error parsing JSON from localStorage", e);
            todos = [];
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


  const usHolidays = [
    // 2024 Holidays
    { date: '2024-01-01', name: 'New Year\'s Day', year: 2024 },
    { date: '2024-01-15', name: 'Martin Luther King Jr. Day', year: 2024 },
    { date: '2024-02-19', name: 'Washington\'s Birthday', year: 2024 },
    { date: '2024-05-27', name: 'Memorial Day', year: 2024 },
    { date: '2024-07-04', name: 'Independence Day', year: 2024 },
    { date: '2024-09-02', name: 'Labor Day', year: 2024 },
    { date: '2024-10-14', name: 'Columbus Day', year: 2024 },
    { date: '2024-11-11', name: 'Veterans Day', year: 2024 },
    { date: '2024-11-28', name: 'Thanksgiving Day', year: 2024 },
    { date: '2024-12-25', name: 'Christmas Day', year: 2024 },

    // 2025 Holidays
    { date: '2025-01-01', name: 'New Year\'s Day', year: 2025 },
    { date: '2025-01-20', name: 'Martin Luther King Jr. Day', year: 2025 },
    { date: '2025-02-17', name: 'Washington\'s Birthday', year: 2025 },
    { date: '2025-05-26', name: 'Memorial Day', year: 2025 },
    { date: '2025-07-04', name: 'Independence Day', year: 2025 },
    { date: '2025-09-01', name: 'Labor Day', year: 2025 },
    { date: '2025-10-13', name: 'Columbus Day', year: 2025 },
    { date: '2025-11-11', name: 'Veterans Day', year: 2025 },
    { date: '2025-11-27', name: 'Thanksgiving Day', year: 2025 },
    { date: '2025-12-25', name: 'Christmas Day', year: 2025 },

    // 2026 Holidays
    { date: '2026-01-01', name: 'New Year\'s Day', year: 2026 },
    { date: '2026-01-19', name: 'Martin Luther King Jr. Day', year: 2026 },
    { date: '2026-02-16', name: 'Washington\'s Birthday', year: 2026 },
    { date: '2026-05-25', name: 'Memorial Day', year: 2026 },
    { date: '2026-07-04', name: 'Independence Day', year: 2026 },
    { date: '2026-09-07', name: 'Labor Day', year: 2026 },
    { date: '2026-10-12', name: 'Columbus Day', year: 2026 },
    { date: '2026-11-11', name: 'Veterans Day', year: 2026 },
    { date: '2026-11-26', name: 'Thanksgiving Day', year: 2026 },
    { date: '2026-12-25', name: 'Christmas Day', year: 2026 },
];
  
  // Function to check if a date is a holiday
  function isHoliday(year, month, day) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return usHolidays.find(holiday => holiday.date === dateKey);
  }
  	  
  function generateCalendar(month, year) {
    calendar.innerHTML = "";
    monthYearDisplay.innerText = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
  
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'day empty';
      calendar.appendChild(emptyDiv);
    }
  
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
  
      const holiday = isHoliday(year, month, day);
      if (holiday) {
        const holidayName = document.createElement("p");
        holidayName.className = "text-xs text-red-700 mt-1 font-bold";
        holidayName.innerText = holiday.name;
        dayDiv.classList.add("bg-yellow-200");
        dayDiv.appendChild(holidayName);
      }
  
      let todos;
      try {
        todos = JSON.parse(localStorage.getItem(dateKey)) || [];
      } catch (e) {
        console.error("Error parsing JSON from localStorage", e);
        todos = [];
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
