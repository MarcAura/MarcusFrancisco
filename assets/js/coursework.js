function toggleCoursework(element) {
    element.classList.toggle('active');
}
 
  // Smooth scroll + auto-toggle activation
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Smooth scroll
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-expand the section
        if (!targetSection.classList.contains('expanded')) {
          targetSection.click();
        }
      }
    });
  }); 
