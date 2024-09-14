document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Get URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const contentUrl = urlParams.get('c') || 'https://mohan-chinnappan-n5.github.io/pages/os/content.js';
  
      // Fetch the content
      const response = await fetch(contentUrl);
      if (!response.ok) throw new Error(`Failed to fetch content from ${contentUrl}`);
      const contentText = await response.text();
  
      // Create a Blob URL to evaluate the module content
      const blob = new Blob([contentText], { type: 'application/javascript' });
      const moduleUrl = URL.createObjectURL(blob);
      const module = await import(moduleUrl);
  
      // Use the imported content
      const siteContent = module.default;
  
      document.getElementById("title").textContent = siteContent.title;
      document.getElementById("headline").textContent = siteContent.headline;
      document.getElementById("overview").textContent = siteContent.overview;
      document.getElementById("featured-title").textContent = siteContent.featuredTitle;
      document.getElementById("featured-description").textContent = siteContent.featuredDescription;
  
      const projectGrid = document.getElementById("project-grid");
      siteContent.projects.forEach((project) => {
        const article = document.createElement("article");
        article.className = "bg-white p-6 shadow rounded-lg";
        article.innerHTML = `
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${getIconPath(project.icon)}" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold">${project.name}</h3>
            <p class="mt-2 text-sm text-gray-600">${project.language}</p>
            <p class="mt-2">${project.description}</p>
            <a href="${project.url}" class="text-white bg-blue-500 rounded-lg px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4 inline-block">
              Website
            </a>    
          </div>
        `;
        projectGrid.appendChild(article);
      });
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  });
  
  function getIconPath(iconName) {
    const icons = {
      server: "M4 6h16M4 10h16M4 14h16M4 18h16",
      cpu: "M9 12h6M12 9v6M6 12h1M17 12h1"
      // Add more icon paths here if needed
    };
    return icons[iconName] || "";
  }

