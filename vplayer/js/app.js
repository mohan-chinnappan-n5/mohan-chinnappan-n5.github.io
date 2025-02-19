// app.js
// Load videos from a JSON file and display them on the page
// Play all videos when the "Run" button is clicked
// Author: Mohan Chinnappan

async function loadVideos() {
    const urlParams = new URLSearchParams(window.location.search);
    let dataUrl = urlParams.get('data');

    if (!dataUrl) {
        dataUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n5/llm-compare/main/videos.json';
    }

    try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        const container = document.getElementById("video-container");
        const runButton = document.getElementById("run-btn");

        let loadedVideos = 0;
        const totalVideos = data.videos.length;

        data.videos.forEach(video => {
            const videoElement = document.createElement("video");
            videoElement.src = video.url;
            videoElement.controls = true;
            videoElement.className = "w-full rounded-lg shadow-lg";

            // Check when all videos have loaded
            videoElement.onloadeddata = () => {
                loadedVideos++;
                if (loadedVideos === totalVideos) {
                    runButton.disabled = false; // Enable the Run button
                }
            };

            const div = document.createElement("div");
            div.appendChild(videoElement);
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error loading videos:", error);
        alert("Failed to load video data.");
    }
}

// Play all videos on "Run" button click
document.getElementById("run-btn").addEventListener("click", () => {
    document.querySelectorAll("video").forEach(video => video.play());
});

// Load videos on page load
loadVideos();