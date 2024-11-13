// agent-app.js
// mohan chinnappan


document.getElementById('toggle-pane').addEventListener('click', function () {
  const pane = document.querySelector('.floating-pane');
  const icon = document.getElementById('toggle-icon');

  if (pane.classList.contains('collapsed')) {
    pane.classList.remove('collapsed');
    icon.classList.replace('fa-chevron-down', 'fa-chevron-up'); // Change icon to 'collapse'
  } else {
    pane.classList.add('collapsed');
    icon.classList.replace('fa-chevron-up', 'fa-chevron-down'); // Change icon to 'expand'
  }
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Enhanced Component Details
const componentDetails = {
    User: {
        title: "User",
        description:
            "The user interacts with the system to provide input queries and receive results.",
    },
    "Atlas Reasoning Engine": {
        title: "Atlas Reasoning Engine",
        description: `The Atlas Reasoning Engine is a proprietary system designed to emulate human thought and planning. 
                      It begins by analyzing user queries, refining them for clarity and relevance. Subsequently, it retrieves 
                      pertinent data and formulates an action plan, which is further refined to ensure accuracy and reliability. 
                      This sophisticated reasoning process enables the engine to autonomously make decisions, solve problems, 
                      and execute business tasks, delivering precise and factually correct outcomes.`,
        source:
            "https://www.salesforce.com/agentforce/what-is-a-reasoning-engine/atlas/",
    },
    "Data Cloud": {
        title: "Data Cloud",
        description:
            "Data Cloud provides a 360-degree view and RAG capabilities to integrate Sales, Service, and Marketing Clouds.",
    },
    "Sales Cloud": {
        title: "Sales Cloud",
        description:
            "A cloud service focused on improving sales performance and customer relationship management.",
    },
    "Service Cloud": {
        title: "Service Cloud",
        description:
            "A cloud-based solution aimed at improving customer service and engagement through various tools.",
    },
    "Marketing Cloud": {
        title: "Marketing Cloud",
        description:
            "A cloud service for managing marketing campaigns and customer journeys with advanced tools.",
    },
};

// Open Modal Function with Enhanced Details
function openModal(component) {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const content = document.getElementById("modal-content");

    const details = componentDetails[component];
    if (details) {
        title.textContent = details.title;
        content.innerHTML = `
            <p>${details.description}</p>
            ${
                details.source
                    ? `<p class="mt-2 text-blue-600 underline">
                         <a href="${details.source}" target="_blank">Learn more</a>
                       </p>`
                    : ""
            }
        `;
    } else {
        title.textContent = component;
        content.textContent = "Details not available.";
    }

    modal.classList.remove("hidden");
}

// Close Modal Function
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// Add Event Listeners to Areas
document.querySelectorAll("area[data-component]").forEach((area) => {
    area.addEventListener("click", (event) => {
        event.preventDefault();
        const component = area.getAttribute("data-component");
        openModal(component);
    });
});


async function loadMarkdown() {
    // Get the 'data' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const markdownUrl = urlParams.get('data');

    if (markdownUrl) {
      try {
        // Fetch the markdown content
        const response = await fetch(markdownUrl);

        if (!response.ok) {
          throw new Error(`Error fetching markdown: ${response.statusText}`);
        }

        const markdownText = await response.text();
        
        // Convert markdown to HTML
        const contentHtml = marked.parse(markdownText);

        // Inject HTML into the page
        const aboutDiv = document.getElementById('about-content');
        aboutDiv.innerHTML = contentHtml;
      } catch (error) {
        console.error('Error:', error);
        document.getElementById('about-content').innerText = "Failed to load content.";
      }
    } else {
      document.getElementById('about-content').innerText = "No markdown file specified.";
    }
  }

  // Load the markdown content when the page loads
  loadMarkdown();



// Function to fetch and display references

const urlParams = new URLSearchParams(window.location.search);
const refUrl = urlParams.get('ref');

if (refUrl) {
try {

fetch(refUrl)
.then(response => response.json())
.then(data => {
const referenceList = document.getElementById('reference-list');

data.references.forEach(reference => {
const listItem = document.createElement('li');
const link = document.createElement('a');

link.href = reference.url;
link.target = '_blank';
link.classList.add('text-blue-600', 'hover:underline');
link.textContent = reference.title;

listItem.appendChild(link);
referenceList.appendChild(listItem);
});
})
.catch(error => console.error('Error loading references:', error));

} catch (error) {
console.error('Error:', error);
document.getElementById('about-content').innerText = "Failed to ref load content.";
}
} else {
document.getElementById('about-content').innerText = "No reference json file specified.";
} 

// videos rendering
// Function to render videos
async function renderVideos() {
const videoGrid = document.getElementById("video-grid");
const videosParam = getQueryParam("videos") || "vids.json"; // Default to vids.json
try {
// Fetch the video details from JSON
const response = await fetch(videosParam);
const videos = await response.json();

// Loop through videos and append to the container
videos.forEach((video) => {
const videoBlock = document.createElement("div");
videoBlock.classList.add("video-item");

videoBlock.innerHTML = `
  <h3 class="text-xl font-bold text-center mb-4">${video.title}</h3>
  <div class="vidyard-player-container" uuid="${video.uuid}" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
    <iframe allow="autoplay; fullscreen; picture-in-picture; camera; microphone; display-capture; clipboard-write"
            allowfullscreen allowtransparency="true"
            referrerpolicy="no-referrer-when-downgrade"
            class="vidyard-iframe-${video.uuid}"
            frameborder="0" height="100%" width="100%" scrolling="no"
            src="https://play.vidyard.com/${video.uuid}?disable_popouts=1&v=4.3.15&type=inline"
            title="${video.iframeTitle}"
            style="opacity: 1; background-color: transparent; position: absolute; top: 0; left: 0;">
    </iframe>
  </div>
`;
videoGrid.appendChild(videoBlock);
});
} catch (error) {
console.error("Failed to fetch video details:", error);
}
}
// Call the render function
renderVideos();


// Function to render YouTube videos
async function renderYouTubeVideos() {
  const videoGridYT = document.getElementById("video-grid-yt");
  const videosParam = getQueryParam("youtubeVideos") || "vids2.json"; // Default to _vids2.json
  try {
    // Fetch the YouTube video details from JSON
    const response = await fetch(videosParam);
    const videos = await response.json();

    // Loop through YouTube videos and append to the container
    videos.forEach((video) => {
      const videoBlock = document.createElement("div");
      videoBlock.classList.add("video-item");

      videoBlock.innerHTML = `
        <h3 class="text-xl font-bold text-center mb-4">${video.title}</h3>
        <div class="youtube-player-container" uuid="${video.uuid}" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
          <iframe width="100%" height="100%" 
                  src="https://www.youtube.com/embed/${video.uuid}?autoplay=0&rel=0" 
                  frameborder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowfullscreen
                  title="${video.title}" 
                  style="opacity: 1; background-color: transparent; position: absolute; top: 0; left: 0;">
          </iframe>
        </div>
      `;
      videoGridYT.appendChild(videoBlock);
    });
  } catch (error) {
    console.error("Failed to fetch YouTube video details:", error);
  }
}

// Call the render function
renderYouTubeVideos();



