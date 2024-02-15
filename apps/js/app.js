// app.js
Split([ "#toc", "#sections"], { sizes: [20, 80] });

function navigateToSection() {
    // Get the selected value from the dropdown
    const selectedSection = document.getElementById("sectionDropdown").value;

    // Use the selected value to construct the anchor link
     anchorLink = "#" + selectedSection;

    // Use smooth scrolling to navigate to the section
    document.querySelector(anchorLink).scrollIntoView({
        behavior: 'smooth'
    });
}

function navigateToSectionToc() {
    // Get the selected value from the dropdown
    const selectedSection = document.getElementById("sectionDropdownToc").value;

    // Use the selected value to construct the anchor link
     anchorLink = "#" + selectedSection;

    // Use smooth scrolling to navigate to the section
    document.querySelector(anchorLink).scrollIntoView({
        behavior: 'smooth'
    });
}