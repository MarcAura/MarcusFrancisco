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

// Get the modal elements
const modal = document.getElementById("imageModal");
const zoomableImage = document.getElementById("zoomableImage");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const closeBtn = document.querySelector(".modal .close");

// When the image is clicked, open the modal and display the image
zoomableImage.addEventListener("click", function() {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10); // small delay for transition effect
    modalImage.src = this.dataset.largeSrc || this.src;
    modalCaption.textContent = this.alt;
});

// When the close button is clicked, hide the modal
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// (Optional) Hide the modal if the user clicks outside the image
modal.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 300); // match the CSS transition duration
    scale = 1; // Reset scale
    modalImage.style.transform = "scale(1)";
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Initialize a scale variable for zooming
let scale = 1;

// Listen for the wheel event on the modal image
modalImage.addEventListener("wheel", function(event) {
  event.preventDefault(); // Prevents the page from scrolling

  // Determine zoom direction
  if (event.deltaY < 0) {
    // Scrolling up - Zoom in
    scale += 0.1;
  } else {
    // Scrolling down - Zoom out, but don't allow scaling below 1 (original size)
    scale = Math.max(1, scale - 0.1);
  }

  // Apply the scaling transform
  modalImage.style.transform = `scale(${scale})`;
});

const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");

zoomInBtn.addEventListener("click", function() {
  scale += 0.1;
  modalImage.style.transform = `scale(${scale})`;
});

zoomOutBtn.addEventListener("click", function() {
  scale = Math.max(1, scale - 0.1);
  modalImage.style.transform = `scale(${scale})`;
});

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("imageModal");
    const zoomableImage = document.getElementById("zoomableImage");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".modal .close");
  
    // Variables for zoom
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
  
    // Update the image transform based on the current scale and offset
    function updateTransform() {
      modalImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }
  
    // Reset the image to its default scale and position
    function resetTransform() {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      updateTransform();
    }
  
    // Open the modal when the image is clicked
    zoomableImage.addEventListener("click", function() {
      modal.style.display = "block";
      // Optionally, if you have a high-res version:
      modalImage.src = this.dataset.largeSrc || this.src;
      modalCaption.textContent = this.alt;
      resetTransform();
    });
  
    // Close the modal (and reset zoom/translation)
    function closeModal() {
      modal.style.display = "none";
      resetTransform();
    }
  
    // Close via the close button and clicking on the modal background
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  
    // Close modal when the Escape key is pressed
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  
    // Zoom functionality: zoom toward the mouse pointer when scrolling
    modalImage.addEventListener("wheel", function(event) {
      event.preventDefault(); // Prevents the page from scrolling
  
      // Get the mouse position relative to the image element.
      // (Since transform-origin is 0 0, these coordinates correspond to the untransformed image.)
      const rect = modalImage.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
  
      // Determine zoom factor: 1.1 for zoom in, 0.9 for zoom out
      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      const newScale = scale * zoomFactor;
  
      // Adjust offsets so that the point under the mouse remains fixed:
      // New offset = current mouse position minus the scaled distance from the current offset.
      offsetX = mouseX - zoomFactor * (mouseX - offsetX);
      offsetY = mouseY - zoomFactor * (mouseY - offsetY);
  
      // Update the scale
      scale = newScale;
  
      // Optional: prevent zooming out past the original size
      if (scale < 1) {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
      }
  
      updateTransform();
    });
  });
  