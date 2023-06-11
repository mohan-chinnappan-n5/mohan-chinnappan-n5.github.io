var startTime = new Date().getTime();
var timerElement = document.getElementById('timer');

// Update the timer element with the elapsed time every second
setInterval(updateTimer, 1000);

function updateTimer() {
  var endTime = new Date().getTime();
  var timeSpent = endTime - startTime;
  var formattedTime = formatTime(timeSpent);
  timerElement.textContent = formattedTime;
}

function formatTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60);
  var minutes = Math.floor((duration / (1000 * 60)) % 60);
  var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return (
    leadingZero(hours) + ':' + leadingZero(minutes) + ':' + leadingZero(seconds)
  );
}

function leadingZero(value) {
  return value < 10 ? '0' + value : value;
}

