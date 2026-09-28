// =============================================
// Sidebar — active section highlighting
// =============================================
const sections = document.querySelectorAll('section');
const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

let lastActiveSection = sections[0] || null;

function setActiveLink() {
    if (!sections.length || !sidebarLinks.length) return;

    const header = document.querySelector('header');
    const topOffset = header ? header.offsetHeight : 0;
    let currentSection = lastActiveSection;

    for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= topOffset && rect.bottom > topOffset) {
            currentSection = section;
            break;
        }
    }

    if (currentSection !== lastActiveSection) {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar ul li a[href="#${currentSection.id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                const sidebarHeight = sidebar.clientHeight;
                const linkPosition = activeLink.offsetTop;
                const linkHeight = activeLink.clientHeight;
                sidebar.scrollTop = linkPosition - (sidebarHeight / 2) + (linkHeight / 2);
            }
        }
        lastActiveSection = currentSection;
    }
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();


// =============================================
// Sidebar — scroll to match page scroll %
// =============================================
window.addEventListener('scroll', function () {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('footer');
    if (!sidebar || !footer) return;

    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const scrollPercentage = scrollY / (pageHeight - viewportHeight);
    const sidebarHeight = sidebar.scrollHeight;
    const sidebarContainerHeight = sidebar.clientHeight;
    const maxSidebarScroll = Math.max(0, sidebarHeight - sidebarContainerHeight - 60);

    sidebar.scrollTop = scrollPercentage * maxSidebarScroll;
});


// =============================================
// Header — shrink on scroll
// =============================================
function shrinkHeader() {
    const header = document.querySelector('header');
    const button = document.querySelector('.top-right-button');
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add('shrink');
        if (button && !button.classList.contains('exit')) {
            button.classList.add('exit');
            button.classList.remove('reenter');
        }
    } else {
        header.classList.remove('shrink');
        if (button && button.classList.contains('exit')) {
            button.classList.remove('exit');
            void button.offsetWidth; // force reflow
            button.classList.add('reenter');
        }
    }
}

window.addEventListener('scroll', shrinkHeader);


// =============================================
// Hamburger Menu
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('nav-hamburger');
    const navList = document.querySelector('nav ul');
    if (!hamburger || !navList) return;

    hamburger.addEventListener('click', function () {
        const isOpen = navList.classList.toggle('nav-open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked on mobile
    navList.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navList.classList.remove('nav-open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
});


// =============================================
// Image Modal — zoom, pan, keyboard close
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const zoomableImages = document.querySelectorAll('.zoomable');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal .close');

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    function updateTransform() {
        modalImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }

    function resetTransform() {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        updateTransform();
    }

    function openModal(src, caption) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
        modalImage.src = src;
        if (modalCaption) modalCaption.textContent = caption || '';
        resetTransform();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            resetTransform();
            document.body.style.overflow = '';
        }, 300);
    }

    zoomableImages.forEach(function (img) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function () {
            openModal(this.dataset.largeSrc || this.src, this.alt);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeModal();
    });

    // Scroll-to-zoom on desktop
    modalImage.addEventListener('wheel', function (event) {
        event.preventDefault();
        const rect = modalImage.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
        const newScale = scale * zoomFactor;

        offsetX = mouseX - zoomFactor * (mouseX - offsetX);
        offsetY = mouseY - zoomFactor * (mouseY - offsetY);
        scale = newScale;

        if (scale < 1) {
            scale = 1;
            offsetX = 0;
            offsetY = 0;
        }
        updateTransform();
    }, { passive: false });

    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    if (zoomInBtn) zoomInBtn.addEventListener('click', function () { scale += 0.1; updateTransform(); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () { scale = Math.max(1, scale - 0.1); updateTransform(); });
});


// =============================================
// Sidebar — smooth scroll on link click
// =============================================
document.querySelectorAll('.sidebar ul li a').forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        const header = document.querySelector('header');

        if (targetSection) {
            const topOffset = (header ? header.offsetHeight : 0) + 20;
            window.scrollTo({ top: targetSection.offsetTop - topOffset, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});


// =============================================
// Sidebar — toggle with bounce animation
// =============================================
(function () {
    const toggleButton = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (!toggleButton || !sidebar) return;

    toggleButton.addEventListener('click', function () {
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed', 'collapsing');
            sidebar.classList.add('expanding');
            setTimeout(() => {
                sidebar.classList.remove('expanding');
                sidebar.classList.add('expanded');
            }, 300);
        } else {
            sidebar.classList.remove('expanded', 'expanding');
            sidebar.classList.add('collapsing');
            setTimeout(() => {
                sidebar.classList.remove('collapsing');
                sidebar.classList.add('collapsed');
            }, 300);
        }
    });
})();


// =============================================
// Sidebar toggle — move above footer on scroll
// =============================================
window.addEventListener('scroll', function () {
    const footer = document.querySelector('footer');
    const button = document.getElementById('sidebar-toggle');
    if (!footer || !button) return;

    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    button.style.bottom = footerTop < windowHeight
        ? `${windowHeight - footerTop + 20}px`
        : '5px';
});


// =============================================
// Fade-in on scroll — IntersectionObserver
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(function (el) { observer.observe(el); });
});


// =============================================
// Portfolio intro & timeline — scroll reveal
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const introSection = document.querySelector('#portfolio-intro');
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!introSection && !timelineItems.length) return;

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    if (introSection) revealObserver.observe(introSection);
    timelineItems.forEach(function (item) { revealObserver.observe(item); });
});


// =============================================
// Contact form — async Formspree submission
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const submitBtn = document.getElementById('form-submit-btn');
    const successMsg = document.getElementById('form-message');
    const errorMsg = document.getElementById('form-error');

    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                contactForm.reset();
                contactForm.style.display = 'none';
                if (successMsg) { successMsg.removeAttribute('hidden'); }
                if (errorMsg) { errorMsg.setAttribute('hidden', ''); }
            } else {
                throw new Error('Server error');
            }
        } catch {
            if (errorMsg) { errorMsg.removeAttribute('hidden'); }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
        }
    });
});


// =============================================
// Dropdown text toggles (projects / reflections)
// =============================================
function toggleDropdown(element) {
    element.classList.toggle('active');
}


// =============================================
// Reflection items — accordion expand/collapse
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    function toggleReflection(reflection) {
        document.querySelectorAll('.reflection-item').forEach(function (item) {
            if (item !== reflection) {
                item.classList.remove('active');
                const content = item.querySelector('.reflection-full');
                if (content) { content.style.maxHeight = '0px'; content.style.opacity = '0'; }
                const icon = item.querySelector('.toggle-icon');
                if (icon) icon.textContent = '+';
            }
        });

        reflection.classList.toggle('active');
        const content = reflection.querySelector('.reflection-full');
        const icon = reflection.querySelector('.toggle-icon');

        if (reflection.classList.contains('active')) {
            if (content) { content.style.maxHeight = content.scrollHeight + 'px'; content.style.opacity = '1'; }
            if (icon) icon.textContent = '−';
        } else {
            if (content) { content.style.maxHeight = '0px'; content.style.opacity = '0'; }
            if (icon) icon.textContent = '+';
        }
    }

    document.querySelectorAll('.reflection-item').forEach(function (item) {
        item.addEventListener('click', function (event) {
            if (!event.target.classList.contains('zoomable')) {
                toggleReflection(this);
            }
        });
    });
});
