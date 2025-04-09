document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll('.citation-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const details = toggle.nextElementSibling;
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const courseworkItems = document.querySelectorAll('.coursework-item');

    courseworkItems.forEach(item => {
        const toggle = item.querySelector('.toggle-button'); // adjust to your actual toggle element

        toggle.addEventListener('click', () => {
            // Collapse all others
            courseworkItems.forEach(i => i.classList.remove('active'));

            // Toggle this one
            item.classList.toggle('active');
        });
    });


    // Simulate a click if landing on a citation via anchor/hash
    const hash = window.location.hash;
    if (hash && hash.startsWith("#citation")) {
        const target = document.querySelector(hash);
        if (target && target.classList.contains('citation-item')) {
            const toggle = target.querySelector('.citation-toggle');
            if (toggle) {
                // Delay the simulated click to ensure the page has rendered
                setTimeout(() => {
                    toggle.click(); // Simulate user click
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100); // slight delay for rendering
            }
        }
    }
});

