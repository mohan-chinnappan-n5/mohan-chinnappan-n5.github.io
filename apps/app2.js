document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from JSON file
    fetch('sections.json')
    .then(response => response.json())
    .then(data => {
        const sections = data.sections;
        const dropdown = document.getElementById('sectionDropdown');

        // Add an event listener to the dropdown
        dropdown.addEventListener('change', function() {
            // Get the value of the selected option
            const selectedSectionId = this.value;

            // Scroll to the selected section
            const selectedSection = document.getElementById(selectedSectionId);
            selectedSection.scrollIntoView({ behavior: 'smooth' });
        });

        const sectionsContainer = document.getElementById('sectionsContainer');

        // Populate dropdown and create sections
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = section.title;
            dropdown.appendChild(option);

            const sectionDiv = document.createElement('section');
            sectionDiv.id = section.id;
            sectionDiv.classList.add('my-8','bg-white', 'rounded-lg', 'p-10', 'shadow-md');

            const h4 = document.createElement('h4');
            h4.classList.add('text-xl', 'font-semibold', 'mb-4');
            h4.textContent = section.title;
            sectionDiv.appendChild(h4);

            const ul = document.createElement('ul');
            ul.classList.add('list-none');

            section.items.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('mb-2', 'flex', 'items-center');
                const icon = document.createElement('i');
                icon.classList.add('fas', item.icon, 'text-blue-500', 'mr-2');
                const link = document.createElement('a');
                link.href = item.url;
                link.classList.add('text-blue-500', 'hover:underline');
                link.textContent = item.text;
                li.appendChild(icon);
                li.appendChild(link);
                ul.appendChild(li);
            });

            sectionDiv.appendChild(ul);
            //sectionDiv.appendChild(document.createElement('hr'))
            sectionsContainer.appendChild(sectionDiv);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});
