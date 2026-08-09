/* =========================================================
   DUA BEAUTY STUDIO
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header = document.querySelector(".header");
    const mobileMenu = document.querySelector(".mobile-menu");
    const navigation = document.querySelector(".navigation");
    const navigationLinks = document.querySelectorAll(".navigation a");

    const revealElements = document.querySelectorAll(
        ".reveal, .fade-up, .fade-left, .fade-right, .scale"
    );

    const scrollLinks = document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    );


    /* =====================================================
       HEADER — SCROLL EFFECT
    ===================================================== */

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 45) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const openMenu = () => {

        if (!mobileMenu || !navigation) return;

        mobileMenu.classList.add("active");
        navigation.classList.add("active");

        document.body.classList.add("menu-open");

        mobileMenu.setAttribute(
            "aria-expanded",
            "true"
        );

    };


    const closeMenu = () => {

        if (!mobileMenu || !navigation) return;

        mobileMenu.classList.remove("active");
        navigation.classList.remove("active");

        document.body.classList.remove("menu-open");

        mobileMenu.setAttribute(
            "aria-expanded",
            "false"
        );

    };


    const toggleMenu = () => {

        if (!mobileMenu || !navigation) return;

        const isOpen =
            navigation.classList.contains("active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    };


    if (mobileMenu) {

        mobileMenu.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu.setAttribute(
            "aria-label",
            "Open menu"
        );

        mobileMenu.addEventListener(
            "click",
            toggleMenu
        );

    }


    /* =====================================================
       CLOSE MENU WHEN CLICKING NAVIGATION LINK
    ===================================================== */

    navigationLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    /* =====================================================
       CLOSE MENU WITH ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (!navigation || !mobileMenu) return;

            const clickedInsideMenu =
                navigation.contains(event.target);

            const clickedMenuButton =
                mobileMenu.contains(event.target);

            const menuIsOpen =
                navigation.classList.contains("active");

            if (
                menuIsOpen &&
                !clickedInsideMenu &&
                !clickedMenuButton
            ) {
                closeMenu();
            }

        }
    );


    /* =====================================================
       RESET MOBILE MENU ON DESKTOP
    ===================================================== */

    const checkViewport = () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    };

    window.addEventListener(
        "resize",
        checkViewport
    );


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    scrollLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetID =
                    link.getAttribute("href");

                const target =
                    document.querySelector(targetID);

                if (!target) return;

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    15;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }
        );

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -45px 0px"
                }
            );

        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       AUTOMATIC REVEAL FOR MAIN CONTENT
    ===================================================== */

    const automaticRevealElements =
        document.querySelectorAll(
            ".feature, .treatment-card, .review-card"
        );

    if (
        "IntersectionObserver" in window &&
        automaticRevealElements.length
    ) {

        const automaticObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        automaticObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.1,
                    rootMargin: "0px 0px -30px 0px"
                }
            );

        automaticRevealElements.forEach(
            element => {

                element.classList.add("fade-up");

                automaticObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       GALLERY REVEAL
    ===================================================== */

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item"
        );

    if (
        "IntersectionObserver" in window &&
        galleryItems.length
    ) {

        const galleryObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        galleryObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.08
                }
            );

        galleryItems.forEach(
            (item, index) => {

                item.classList.add("fade-up");

                item.style.transitionDelay =
                    `${index * 0.06}s`;

                galleryObserver.observe(item);

            }
        );

    }


    /* =====================================================
       IMAGE LOAD FADE
    ===================================================== */

    const images =
        document.querySelectorAll("img");

    images.forEach(image => {

        if (image.complete) {

            image.classList.add("loaded");

        } else {

            image.addEventListener(
                "load",
                () => {

                    image.classList.add(
                        "loaded"
                    );

                },
                { once: true }
            );

        }

    });


    /* =====================================================
       GALLERY LIGHTBOX
    ===================================================== */

    const gallery =
        document.querySelector(".gallery");

    const galleryImages =
        document.querySelectorAll(
            ".gallery-item img"
        );

    let lightbox = null;

    const createLightbox = () => {

        if (lightbox) return;

        lightbox =
            document.createElement("div");

        lightbox.className =
            "gallery-lightbox";

        lightbox.innerHTML = `
            <button
                class="lightbox-close"
                type="button"
                aria-label="Close image"
            >
                ×
            </button>

            <button
                class="lightbox-prev"
                type="button"
                aria-label="Previous image"
            >
                ‹
            </button>

            <div class="lightbox-content">
                <img src="" alt="">
            </div>

            <button
                class="lightbox-next"
                type="button"
                aria-label="Next image"
            >
                ›
            </button>
        `;

        document.body.appendChild(lightbox);

    };


    let currentImage = 0;


    const openLightbox = index => {

        if (!galleryImages.length) return;

        createLightbox();

        currentImage = index;

        updateLightbox();

        lightbox.classList.add("active");

        document.body.classList.add(
            "lightbox-open"
        );

    };


    const closeLightbox = () => {

        if (!lightbox) return;

        lightbox.classList.remove("active");

        document.body.classList.remove(
            "lightbox-open"
        );

    };


    const updateLightbox = () => {

        if (!lightbox) return;

        const image =
            lightbox.querySelector(
                ".lightbox-content img"
            );

        const source =
            galleryImages[currentImage];

        if (!source) return;

        image.src = source.currentSrc ||
                    source.src;

        image.alt =
            source.alt || "Gallery image";

    };


    const nextImage = () => {

        currentImage =
            (currentImage + 1) %
            galleryImages.length;

        updateLightbox();

    };


    const previousImage = () => {

        currentImage =
            (currentImage -
                1 +
                galleryImages.length) %
            galleryImages.length;

        updateLightbox();

    };


    galleryImages.forEach(
        (image, index) => {

            image.parentElement.addEventListener(
                "click",
                () => {

                    openLightbox(index);

                }
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (!lightbox) return;

            if (
                event.target.closest(
                    ".lightbox-close"
                )
            ) {
                closeLightbox();
            }

            if (
                event.target.closest(
                    ".lightbox-next"
                )
            ) {
                nextImage();
            }

            if (
                event.target.closest(
                    ".lightbox-prev"
                )
            ) {
                previousImage();
            }

            if (
                event.target === lightbox
            ) {
                closeLightbox();
            }

        }
    );


    /* =====================================================
       LIGHTBOX KEYBOARD CONTROL
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (!lightbox ||
                !lightbox.classList.contains("active")
            ) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowRight") {
                nextImage();
            }

            if (event.key === "ArrowLeft") {
                previousImage();
            }

        }
    );


    /* =====================================================
       PARALLAX — DESKTOP ONLY
    ===================================================== */

    const hero =
        document.querySelector(".hero");

    let ticking = false;

    const updateParallax = () => {

        if (!hero) {
            ticking = false;
            return;
        }

        if (window.innerWidth <= 700) {
            hero.style.setProperty(
                "--hero-offset",
                "0px"
            );

            ticking = false;

            return;
        }

        const scroll =
            window.scrollY;

        const offset =
            Math.min(scroll * 0.12, 100);

        hero.style.setProperty(
            "--hero-offset",
            `${offset}px`
        );

        ticking = false;

    };


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateParallax
                );

                ticking = true;

            }

        },
        { passive: true }
    );


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navAnchors =
        document.querySelectorAll(
            '.navigation a[href^="#"]'
        );

    if (
        sections.length &&
        navAnchors.length &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id =
                            entry.target.id;

                        navAnchors.forEach(link => {

                            link.classList.remove(
                                "active"
                            );

                            if (
                                link.getAttribute(
                                    "href"
                                ) === `#${id}`
                            ) {

                                link.classList.add(
                                    "active"
                                );

                            }

                        });

                    });

                },
                {
                    threshold: 0.35
                }
            );

        sections.forEach(section => {

            sectionObserver.observe(section);

        });

    }


    /* =====================================================
       BOOKING CTA
    ===================================================== */

    const bookingButtons =
        document.querySelectorAll(
            '[href="#booking"], [data-booking]'
        );

    bookingButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const bookingSection =
                    document.querySelector(
                        "#booking"
                    );

                if (!bookingSection) return;

                event.preventDefault();

                bookingSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-year]"
        );

    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       RESIZE OPTIMIZATION
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(() => {

                    updateHeader();
                    checkViewport();
                    updateParallax();

                }, 150);

        }
    );


    /* =====================================================
       PAGE LOADED
    ===================================================== */

    document.documentElement.classList.add(
        "js-loaded"
    );

});


























/* =====================================================
   TREATMENTS — SHOW MORE
===================================================== */
/*
const treatmentGrid =
    document.querySelector(".treatment-grid");

const treatmentToggle =
    document.querySelector(".treatment-toggle");

if (treatmentGrid && treatmentToggle) {

    treatmentToggle.addEventListener("click", () => {

        const expanded =
            treatmentGrid.classList.toggle("expanded");

        treatmentToggle.classList.toggle(
            "active",
            expanded
        );

        treatmentToggle.setAttribute(
            "aria-expanded",
            expanded
        );

        treatmentToggle.textContent =
            expanded
                ? "Minder Behandelingen"
                : "Bekijk Alle Behandelingen";

        if (expanded) {

            treatmentGrid
                .querySelectorAll(".treatment-extra")
                .forEach(card => {

                    card.classList.add("visible");

                });

        }

    });

}
*/

const treatmentGrid =
    document.querySelector(".treatment-grid");

const treatmentToggle =
    document.querySelector(".treatment-toggle");


if (treatmentGrid && treatmentToggle) {


    treatmentToggle.addEventListener("click", () => {


        const expanded =
            treatmentGrid.classList.toggle("expanded");


        treatmentToggle.classList.toggle(
            "active",
            expanded
        );


        treatmentToggle.setAttribute(
            "aria-expanded",
            expanded
        );


        treatmentToggle.textContent =
            expanded
                ? "Minder Behandelingen"
                : "Bekijk Alle Behandelingen";



        treatmentGrid
            .querySelectorAll(".treatment-extra")
            .forEach(card => {

                card.classList.toggle(
                    "visible",
                    expanded
                );

            });



        // TERUG SCROLLEN BIJ SLUITEN

        if (!expanded) {

            document
                .querySelector("#behandelingen")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        }


    });

}











































