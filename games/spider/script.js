//let audio = new Audio('itsy-bitsy.mp3'); // Ensure this file is present
/*
document.getElementById("lyrics-box").addEventListener("click", function() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});
*/

function singSong() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(lyrics);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.2; // Slightly higher pitch for a playful tone
        speechSynthesis.speak(utterance);
    } else {
        alert('Sorry, your browser does not support text-to-speech!');
    }
}
const lyrics = document.getElementById('lyrics').innerText;
const singBtn = document.getElementById('singBtn');
singBtn.addEventListener('click', singSong);