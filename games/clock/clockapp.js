//----------------------------------
// clockapp.js
// Clock App
// author: mohan chinnappan
//----------------------------------

const analogClock = document.getElementById('analogClock');
const digitalClock = document.getElementById('digitalClock');
const toggleViewBtn = document.getElementById('toggleView');
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');
const alarmTimeInput = document.getElementById('alarmTime');
const setAlarmBtn = document.getElementById('setAlarm');
const alarmStatus = document.getElementById('alarmStatus');
const stopwatchDisplay = document.getElementById('stopwatch');
const startStopwatchBtn = document.getElementById('startStopwatch');
const stopStopwatchBtn = document.getElementById('stopStopwatch');
const resetStopwatchBtn = document.getElementById('resetStopwatch');

let isAnalog = false;
let alarmSet = null;
let stopwatchRunning = false;
let stopwatchTime = 0;
let stopwatchInterval;

// Add numbers to analog clock
function addClockNumbers() {
    const radius = 130; // Distance from center to place numbers
    const centerX = 150; // Half of 300px width
    const centerY = 150; // Half of 300px height
    for (let i = 1; i <= 12; i++) {
        const angle = (i - 3) * 30 * Math.PI / 180; // 30° per hour, offset by 90° (3 o'clock)
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const number = document.createElement('div');
        number.className = 'clock-number';
        number.textContent = i;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        analogClock.appendChild(number);
    }
}

// Clock Update
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Analog Clock
    const hourDeg = (hours % 12 + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;
    const secondDeg = seconds * 6;
    hourHand.style.transform = `rotate(${hourDeg}deg) translateX(-50%)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg) translateX(-50%)`;
    secondHand.style.transform = `rotate(${secondDeg}deg) translateX(-50%)`;

    // Digital Clock
    digitalClock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Check Alarm
    if (alarmSet) {
        const [alarmHours, alarmMinutes] = alarmSet.split(':').map(Number);
        if (hours === alarmHours && minutes === alarmMinutes && seconds === 0) {
            alarmStatus.textContent = 'Alarm ringing!';
            alert('Alarm!');
            alarmSet = null; // Reset alarm after it rings
        }
    }
}

// Toggle View
toggleViewBtn.addEventListener('click', () => {
    isAnalog = !isAnalog;
    analogClock.classList.toggle('hidden', !isAnalog);
    digitalClock.classList.toggle('hidden', isAnalog);
    toggleViewBtn.textContent = isAnalog ? 'Switch to Digital' : 'Switch to Analog';
});

// Set Alarm
setAlarmBtn.addEventListener('click', () => {
    const time = alarmTimeInput.value;
    if (time) {
        alarmSet = time;
        alarmStatus.textContent = `Alarm set for ${time}`;
    } else {
        alarmStatus.textContent = 'Please select a time';
    }
});

// Stopwatch Functions
function updateStopwatch() {
    stopwatchTime++;
    const hours = Math.floor(stopwatchTime / 3600);
    const minutes = Math.floor((stopwatchTime % 3600) / 60);
    const seconds = stopwatchTime % 60;
    stopwatchDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

startStopwatchBtn.addEventListener('click', () => {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        startStopwatchBtn.textContent = 'Pause';
        stopwatchInterval = setInterval(updateStopwatch, 1000);
    } else {
        stopwatchRunning = false;
        startStopwatchBtn.textContent = 'Start';
        clearInterval(stopwatchInterval);
    }
});

stopStopwatchBtn.addEventListener('click', () => {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        startStopwatchBtn.textContent = 'Start';
        clearInterval(stopwatchInterval);
    }
});

resetStopwatchBtn.addEventListener('click', () => {
    stopwatchRunning = false;
    startStopwatchBtn.textContent = 'Start';
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    stopwatchDisplay.textContent = '00:00:00';
});

// Initial Setup
addClockNumbers(); // Add numbers to clock face
digitalClock.classList.remove('hidden'); // Start with digital view
setInterval(updateClock, 1000);
updateClock(); // Initial call