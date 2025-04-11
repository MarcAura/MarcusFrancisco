// Get all the section elements and sidebar links
const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.sidebar ul li a');

let lastActiveSection = sections[0];
const topOffset = document.querySelector('header').offsetHeight; // Get height of the top bar

// Function to highlight the active section in the sidebar
function setActiveLink() {
    let currentSection = lastActiveSection; // Default to last active

    for (let section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= topOffset && rect.bottom > topOffset) {
            currentSection = section;
            break;
        }
    }

    if (currentSection !== lastActiveSection) {
        links.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar ul li a[href="#${currentSection.id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');

            // Scroll the sidebar so the active link is centered
            const sidebar = document.querySelector('.sidebar');
            const sidebarHeight = sidebar.clientHeight;
            const linkPosition = activeLink.offsetTop;
            const linkHeight = activeLink.clientHeight;

            // Ensure scrolling centers the active link within the sidebar
            sidebar.scrollTop = linkPosition - (sidebarHeight / 2) + (linkHeight / 2);
        }
        lastActiveSection = currentSection; // Update last active section
    }

    // Center the active section in the sidebar
    window.addEventListener("scroll", function () {
        const sidebar = document.querySelector(".sidebar");
        const footer = document.querySelector("footer");
        const pageHeight = document.documentElement.scrollHeight; // Total page height
        const viewportHeight = window.innerHeight; // Viewport height
        const scrollY = window.scrollY; // Current scroll position
        const footerTop = footer.getBoundingClientRect().top + scrollY; // Footer's absolute position

        // Calculate how far user has scrolled down the page (as a percentage)
        const scrollPercentage = scrollY / (pageHeight - viewportHeight);

        // Sidebar height and max scroll offset
        const sidebarHeight = sidebar.scrollHeight;
        const sidebarContainerHeight = sidebar.clientHeight;

        // Max sidebar scroll to ensure last link is 60px above footer
        const maxSidebarScroll = sidebarHeight - sidebarContainerHeight - 60;

        // Calculate the new sidebar scroll position based on scroll percentage
        const newSidebarScroll = scrollPercentage * maxSidebarScroll;

        // Update the sidebar scroll position dynamically
        sidebar.scrollTop = newSidebarScroll;
    });

}



// Listen for scroll events to update active section
window.addEventListener('scroll', setActiveLink);

// Initial call to set active link
setActiveLink();

// Function to shrink the header on scroll
function shrinkHeader() {
    const header = document.querySelector('header');
    const button = document.querySelector('.top-right-button');

    if (window.scrollY > 50) { // Adjust the scroll distance as needed
        header.classList.add('shrink');
        // Trigger button exit animation only once
        if (!button.classList.contains('exit')) {
            button.classList.add('exit');
            button.classList.remove('reenter');
        }
    } else {
        header.classList.remove('shrink');
        if (button.classList.contains('exit')) {
            button.classList.remove('exit');
    
            // Force reflow to allow animation to restart cleanly
            void button.offsetWidth;
    
            button.classList.add('reenter');
          }
    }
}

// Listen for scroll events to shrink the header
window.addEventListener('scroll', shrinkHeader);

document.addEventListener("DOMContentLoaded", function () {
    // Modal elements
    const modal = document.getElementById("imageModal");
    const zoomableImages = document.querySelectorAll(".zoomable"); // All images with class "zoomable"
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".modal .close");

    // Variables for zoom
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    // Update the transform on the modal image based on scale and offsets
    function updateTransform() {
        modalImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }

    // Reset zoom and translation to default
    function resetTransform() {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        updateTransform();
    }

    // Open the modal when any zoomable image is clicked
    zoomableImages.forEach(function (img) {
        img.addEventListener("click", function () {
            modal.style.display = "block";
            // Add the "show" class after a short delay so the opacity transition runs
            setTimeout(() => modal.classList.add("show"), 10);
            // Use a high-res version if available via data-largeSrc, else the thumbnail src
            modalImage.src = this.dataset.largeSrc || this.src;
            modalCaption.textContent = this.alt;
            resetTransform();
        });
    });

    // Function to close the modal (and reset zoom/translation)
    function closeModal() {
        modal.classList.remove("show");
        // Wait for the opacity transition to finish (300ms) before hiding the modal
        setTimeout(() => {
            modal.style.display = "none";
            resetTransform();
        }, 300);
    }

    // Close the modal if the user clicks directly on the modal image
    modalImage.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent the click from bubbling up to the modal background
        closeModal();
    });

    // Close via the close button and clicking on the modal background
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal when the Escape key is pressed
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    // Zoom functionality: zoom toward the mouse pointer when scrolling on the modal image
    modalImage.addEventListener("wheel", function (event) {
        event.preventDefault(); // Prevent the page from scrolling

        // Get the mouse position relative to the modal image.
        const rect = modalImage.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Determine zoom factor: 1.1 for zoom in, 0.9 for zoom out
        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
        const newScale = scale * zoomFactor;

        // Adjust offsets so that the point under the mouse remains fixed:
        offsetX = mouseX - zoomFactor * (mouseX - offsetX);
        offsetY = mouseY - zoomFactor * (mouseY - offsetY);

        scale = newScale;

        // Prevent zooming out past the original size
        if (scale < 1) {
            scale = 1;
            offsetX = 0;
            offsetY = 0;
        }

        updateTransform();
    });

    // Optional: Zoom in/out buttons (if present in your HTML)
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");

    if (zoomInBtn) {
        zoomInBtn.addEventListener("click", function () {
            scale += 0.1;
            updateTransform();
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", function () {
            scale = Math.max(1, scale - 0.1);
            updateTransform();
        });
    }
});


document.querySelectorAll('.sidebar ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default jump behavior
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetId === "section1") {
            // If "Homepage" is clicked, scroll to the very top
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else if (targetSection) {
            // For other sections, apply the offset
            const topOffset = document.querySelector('header').offsetHeight + 20; // Adjust for header height
            const targetPosition = targetSection.offsetTop - topOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth" // Smooth scrolling effect
            });
        }
    });
});

document.getElementById("sidebar-toggle").addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("collapsed");
});

const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("sidebar-toggle");
const content = document.querySelector(".content");

document.getElementById("sidebar-toggle").addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
});

toggleButton.addEventListener("click", function () {
    if (sidebar.classList.contains("collapsed")) {
        // Expanding sidebar with bounce effect
        sidebar.classList.remove("collapsed");
        sidebar.classList.add("expanding");

        setTimeout(() => {
            sidebar.classList.remove("expanding");
            sidebar.classList.add("expanded");
        }, 300); // Wait before settling
    } else {
        // Collapsing sidebar with bounce effect
        sidebar.classList.remove("expanded");
        sidebar.classList.add("collapsing");

        setTimeout(() => {
            sidebar.classList.remove("collapsing");
            sidebar.classList.add("collapsed");
        }, 300); // Wait before fully collapsing
    }
});


window.addEventListener("scroll", function () {
    const footer = document.querySelector("footer"); // Get the footer element
    const button = document.getElementById("sidebar-toggle"); // Get the sidebar button

    const footerTop = footer.getBoundingClientRect().top; // Footer's position relative to the viewport
    const windowHeight = window.innerHeight; // Height of the viewport

    // If the footer is in view, move the button up
    if (footerTop < windowHeight) {
        button.style.bottom = `${windowHeight - footerTop + 20}px`; // Adjust button position dynamically
    } else {
        button.style.bottom = "5px"; // Default position when footer is not in view
    }
});

// Open the modal and show the clicked image
function openModal(imgElement) {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    var modalCaption = document.getElementById("modalCaption"); // Get caption element
    modal.style.display = "block";
    modal.classList.add("show");
    modalImg.src = imgElement.src;
    modalCaption.textContent = imgElement.alt || "No description available"; // Set caption text

}

// Close the modal
function closeModal() {
    var modal = document.getElementById("imageModal");
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 300); // Wait for fade-out transition
}


// Animations for Landing Page
document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.3 });

    fadeElements.forEach((element) => {
        observer.observe(element);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const introSection = document.querySelector("#portfolio-intro");
    const timelineItems = document.querySelectorAll(".timeline-item");

    function handleScroll() {
        const introRect = introSection.getBoundingClientRect();
        if (introRect.top < window.innerHeight * 0.85) {
            introSection.classList.add("visible");
        }

        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                item.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on page load
});

// Sending Emails

document.getElementById("contact-form").addEventListener("submit", function (event) {
    document.getElementById("form-message").style.display = "block";
});

// Dropdown Script
function toggleDropdown(element) {
    element.classList.toggle("active");
}



// Dropdown Script
function toggleReflection(element) {
    const content = element.querySelector('.course-desc-icon');

    if (content.classList.contains('active') && element.classList.contains('active')) {
        content.classList.toggle("active");
    }
    else {
        element.classList.toggle("active");
    }
}




// Reflection Expanding

document.addEventListener("DOMContentLoaded", function () {
    function toggleReflection(reflection) {
        document.querySelectorAll(".reflection-item").forEach(item => {
            if (item !== reflection) {
                item.classList.remove("active");
                let content = item.querySelector(".reflection-full");
                content.style.maxHeight = "0px";
                content.style.opacity = "0";
                item.querySelector(".toggle-icon").textContent = "+";
            }
        });

        reflection.classList.toggle("active");
        let content = reflection.querySelector(".reflection-full");
        let icon = reflection.querySelector(".toggle-icon");

        if (reflection.classList.contains("active")) {
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.opacity = "1";
            icon.textContent = "−";
        } else {
            content.style.maxHeight = "0px";
            content.style.opacity = "0";
            icon.textContent = "+";
        }
    }

    document.querySelectorAll(".reflection-item").forEach(item => {
        item.addEventListener("click", function (event) {
            // Prevent reflection from closing when clicking a zoomable image
            if (!event.target.classList.contains("zoomable")) {
                toggleReflection(this);
            }

        });
    });
});
