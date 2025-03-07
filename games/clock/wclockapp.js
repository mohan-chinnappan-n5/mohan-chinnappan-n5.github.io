//----------------------------------
// wclockapp.js
// World Clock App
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
const indiaClock = document.getElementById('indiaClock');
const nyClock = document.getElementById('nyClock');
const austinClock = document.getElementById('austinClock');
const sfClock = document.getElementById('sfClock');
const citySelector = document.getElementById('citySelector');
const selectedCityClock = document.getElementById('selectedCityClock');

let isAnalog = false;
let alarmSet = null;
let stopwatchRunning = false;
let stopwatchTime = 0;
let stopwatchInterval;
let lastAnnouncedHour = -1; // To track the last announced hour

// Time zones
const timeZones = {
    'India': 'Asia/Kolkata',
    'New York': 'America/New_York',
    'Austin TX': 'America/Chicago',
    'San Francisco CA': 'America/Los_Angeles'
};

// Major cities with their time zones
const majorCities = {
    'Coimbatore': 'Asia/Kolkata',
    'London': 'Europe/London',
    'Tokyo': 'Asia/Tokyo',
    'Sydney': 'Australia/Sydney',
    'Paris': 'Europe/Paris',
    'Beijing': 'Asia/Shanghai',
    'Moscow': 'Europe/Moscow',
    'Dubai': 'Asia/Dubai',
    'Singapore': 'Asia/Singapore',
    'Berlin': 'Europe/Berlin',
    'Toronto': 'America/Toronto'
};

// Add numbers to analog clock
function addClockNumbers() {
    const radius = 130;
    const centerX = 150;
    const centerY = 150;
    for (let i = 1; i <= 12; i++) {
        const angle = (i - 3) * 30 * Math.PI / 180;
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

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour12: false });
}

// Announce the hour
function announceHour(hour) {
    const speech = new SpeechSynthesisUtterance(`The time is now ${hour} o'clock`);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
}

// Update all clocks
function updateClocks() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Local time (analog and digital)
    const hourDeg = (hours % 12 + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;
    const secondDeg = seconds * 6;
    hourHand.style.transform = `rotate(${hourDeg}deg) translateX(-50%)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg) translateX(-50%)`;
    secondHand.style.transform = `rotate(${secondDeg}deg) translateX(-50%)`;
    digitalClock.textContent = formatTime(now);

    // Hourly announcement for local time
    if (minutes === 0 && seconds === 0 && hours !== lastAnnouncedHour) {
        announceHour(hours);
        lastAnnouncedHour = hours; // Update the last announced hour
    }

    // World clocks
    indiaClock.textContent = `India: ${now.toLocaleTimeString('en-US', { timeZone: timeZones['India'], hour12: false })}`;
    nyClock.textContent = `New York: ${now.toLocaleTimeString('en-US', { timeZone: timeZones['New York'], hour12: false })}`;
    austinClock.textContent = `Austin TX: ${now.toLocaleTimeString('en-US', { timeZone: timeZones['Austin TX'], hour12: false })}`;
    sfClock.textContent = `San Francisco: ${now.toLocaleTimeString('en-US', { timeZone: timeZones['San Francisco CA'], hour12: false })}`;

    // Selected city clock
    const selectedCity = citySelector.value;
    if (selectedCity) {
        selectedCityClock.textContent = `${selectedCity}: ${now.toLocaleTimeString('en-US', { timeZone: majorCities[selectedCity], hour12: false })}`;
    }

    // Check Alarm (local time)
    if (alarmSet) {
        const [alarmHours, alarmMinutes] = alarmSet.split(':').map(Number);
        if (hours === alarmHours && minutes === alarmMinutes && seconds === 0) {
            alarmStatus.textContent = 'Alarm ringing!';
            alert('Alarm!');
            alarmSet = null;
        }
    }
}

// Populate city selector
function populateCitySelector() {
    Object.keys(majorCities).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelector.appendChild(option);
    });
}

// Event Listeners
toggleViewBtn.addEventListener('click', () => {
    isAnalog = !isAnalog;
    analogClock.classList.toggle('hidden', !isAnalog);
    digitalClock.classList.toggle('hidden', isAnalog);
    toggleViewBtn.textContent = isAnalog ? 'Switch to Digital' : 'Switch to Analog';
});

setAlarmBtn.addEventListener('click', () => {
    const time = alarmTimeInput.value;
    if (time) {
        alarmSet = time;
        alarmStatus.textContent = `Alarm set for ${time} (Local Time)`;
    } else {
        alarmStatus.textContent = 'Please select a time';
    }
});

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
addClockNumbers();
digitalClock.classList.remove('hidden');
populateCitySelector();
setInterval(updateClocks, 1000);
updateClocks();