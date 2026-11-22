/* ========================================
   DK VISUALS — GLOBAL NAVIGATION
======================================== */

    /* =========================
        MOBILE NAVIGATION
    ========================= */

        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });

    /* =========================
        ACTIVE NAVIGATION
    ========================= */

        const sections = document.querySelectorAll('main section[id]');
        const navigationLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {

            let current = '';

            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 180) {
                    current = section.getAttribute('id');
                }
            });

            navigationLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + current
                );
            });

        });