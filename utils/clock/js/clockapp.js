// clock 
// mohan chinnappan
// -----------------------------------------------------
const digitalClock = document.getElementById("digitalClock");
const alarmTime = document.getElementById("alarmTime");
const analogClock = document.getElementById("analogClock");
const analogClockContext = analogClock.getContext("2d");

const analogClockIndia = document.getElementById("analogClockIndia");
const analogClockIndiaContext = analogClockIndia.getContext("2d");

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const alarmInput = document.getElementById("alarmInput");
const stopAlarmButton = document.getElementById("stopAlarmButton");


let timerInterval;
let startTime;
let elapsedTime = 0;
let alarmSound = new Audio('beep.mp3'); // Beep sound file
let alarmInterval;

startButton.addEventListener("click", () => {
    elapsedTime = 0;
    if (!timerInterval) {
        startTime = new Date().getTime() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        stopButton.disabled = false;
        startButton.disabled = true;
    }
})

stopButton.addEventListener("click", () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = new Date().getTime() - startTime;
        startButton.disabled = false;
        stopButton.disabled = true;
    }
});

alarmInput.addEventListener("change", () => {
    setAlarm(alarmInput.value);
});

function setAlarm(alarmTime) {
    const now = new Date();
    const alarmHour = parseInt(alarmTime.split(':')[0]);
    const alarmMinute = parseInt(alarmTime.split(':')[1]);
    now.setHours(alarmHour, alarmMinute, 0, 0);
    alarmSound.pause();
    alarmSound.currentTime = 0;
    if (now.getTime() > new Date().getTime()) {
        // Alarm is in the future
        const timeToAlarm = now.getTime() - new Date().getTime();
        alarmInterval = setTimeout(() => {
            alarmSound.play();
            stopAlarmButton.disabled = false;
        }, timeToAlarm);
    }
}
function stopAlarm() {
    if (alarmInterval) {
        clearTimeout(alarmInterval);
        alarmSound.pause();
    }
}

stopAlarmButton.addEventListener("click", () => {
    stopAlarm();
});


function updateDigitalClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    digitalClock.innerHTML = formatTime(hours, minutes, seconds);
}

function formatTime(hours, minutes, seconds) {
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function updateTimer() {
    const currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;
    displayElapsedTime();
}

function displayElapsedTime() {
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    timerDisplay.innerHTML = `Timer: ${formatTime(hours, minutes % 60, seconds % 60)}`;
}

function drawAnalogClock(context, timeOffset) {
    context.clearRect(0, 0, 200, 200);

    const now = new Date();
    const hours = (now.getHours() + timeOffset) % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Draw clock face
    context.beginPath();
    context.arc(100, 100, 90, 0, 2 * Math.PI);
    context.stroke();

    // Draw numbers
    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) {
        const numberAngle = (360 / 12) * (i - 0);
        const numberX = 100 + 75 * Math.cos((numberAngle - 90) * (Math.PI / 180));
        const numberY = 100 + 75 * Math.sin((numberAngle - 90) * (Math.PI / 180));
        context.fillText(i, numberX, numberY);
    }

    // Draw hour hand
    context.beginPath();
    context.moveTo(100, 100);
    const hourAngle = (360 / 12) * (hours + minutes / 60) - 90;
    const hourX = 100 + 40 * Math.cos(hourAngle * (Math.PI / 180));
    const hourY = 100 + 40 * Math.sin(hourAngle * (Math.PI / 180));
    context.lineTo(hourX, hourY);
    context.lineWidth = 4; // 200% thicker
    context.stroke();
    context.lineWidth = 2; // Reset line width

    // Draw minute hand
    context.beginPath();
    context.moveTo(100, 100);
    const minuteAngle = (360 / 60) * minutes - 90;
    const minuteX = 100 + 60 * Math.cos(minuteAngle * (Math.PI / 180));
    const minuteY = 100 + 60 * Math.sin(minuteAngle * (Math.PI / 180));
    context.lineTo(minuteX, minuteY);
    context.lineWidth = 4; // 200% thicker
    context.stroke();
    context.lineWidth = 2; // Reset line width

    // Draw second hand
    context.beginPath();
    context.moveTo(100, 100);
    const secondAngle = (360 / 60) * seconds - 90;
    const secondX = 100 + 70 * Math.cos(secondAngle * (Math.PI / 180));
    const secondY = 100 + 70 * Math.sin(secondAngle * (Math.PI / 180));
    context.strokeStyle = "#ff99cc"; // Set the second hand color
    context.lineTo(secondX, secondY);
    context.lineWidth = 2; // Reset line width
    context.stroke();
    context.strokeStyle = "black"; // Reset the color

    // Draw 'C' in the center
    context.font = "24px Arial";
    context.fillText("C", 100, 100);
}

setInterval(updateDigitalClock, 1000);
setInterval(() => drawAnalogClock(analogClockContext,0 ), 1000);
// setInterval(() => drawAnalogClock(analogClockIndiaContext,5.5 ), 1000);

