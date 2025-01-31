// Get all the section elements and sidebar links
const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.sidebar ul li a');

// Function to highlight the active section in the sidebar
function setActiveLink() {
    let currentSection = sections[0];
    for (let section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom > 0) {
            currentSection = section;
            break;
        }
    }

    links.forEach(link => {
        link.classList.remove('active'); // Remove active class from all links
    });

    const activeLink = document.querySelector(`.sidebar ul li a[href="#${currentSection.id}"]`);
    if (activeLink) {
        activeLink.classList.add('active'); // Add active class to the current link
    }

    // Center the active section in the sidebar
    const sidebar = document.querySelector('.sidebar');
    const activeLinkElement = document.querySelector('.sidebar ul li a.active');
    if (activeLinkElement) {
        sidebar.scrollTop = activeLinkElement.offsetTop - (sidebar.clientHeight / 2) + (activeLinkElement.clientHeight / 2);
    }
}

// Listen for scroll events to update active section
window.addEventListener('scroll', setActiveLink);

// Initial call to set active link
setActiveLink();

// Function to shrink the header on scroll
function shrinkHeader() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) { // Adjust the scroll distance as needed
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
}

// Listen for scroll events to shrink the header
window.addEventListener('scroll', shrinkHeader);
