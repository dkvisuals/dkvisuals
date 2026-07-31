/* =========================================================
   HIGH QUALITY TAXI
   PREMIUM WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   01. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    /*
    initPreloader();
    */

    initHeader();
    initMobileMenu();
    initCustomCursor();
    initScrollReveal();
    initCounters();
    initReviewSlider();
    initSmoothScroll();
    initActiveNavigation();
    initHeroParallax();

});


/* =========================================================
   02. PRELOADER
========================================================= */

function initPreloader() {

    const preloader = document.querySelector(".preloader");
    const progress = document.querySelector(".preloader-line span");
    const number = document.querySelector(".preloader-number");

    if (!preloader) return;


    let current = 0;

    const duration = 1600;
    const startTime = performance.now();


    function animatePreloader(time) {

        const elapsed = time - startTime;

        current = Math.min(
            Math.floor((elapsed / duration) * 100),
            100
        );


        if (progress) {

            progress.style.width = `${current}%`;

        }


        if (number) {

            number.textContent =
                String(current).padStart(2, "0");

        }


        if (current < 100) {

            requestAnimationFrame(animatePreloader);

        } else {

            setTimeout(() => {

                preloader.style.transition =
                    "opacity .8s ease, visibility .8s ease";

                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";


                document.body.classList.add("loaded");


                setTimeout(() => {

                    preloader.remove();

                }, 900);

            }, 250);

        }

    }


    requestAnimationFrame(animatePreloader);

}


/* =========================================================
   03. HEADER
========================================================= */

function initHeader() {

    const header = document.querySelector(".header");

    if (!header) return;


    function updateHeader() {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    updateHeader();


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}


/* =========================================================
   04. MOBILE MENU
========================================================= */

function initMobileMenu() {

    const toggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks =
        document.querySelectorAll(".mobile-menu a");


    if (!toggle || !mobileMenu) return;


    function openMenu() {

        mobileMenu.classList.add("open");

        document.body.classList.add("menu-open");

        toggle.classList.add("active");

    }


    function closeMenu() {

        mobileMenu.classList.remove("open");

        document.body.classList.remove("menu-open");

        toggle.classList.remove("active");

    }


    toggle.addEventListener("click", () => {

        const isOpen =
            mobileMenu.classList.contains("open");


        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    });


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            closeMenu();

        }

    });

}


/* =========================================================
   05. CUSTOM CURSOR
========================================================= */

function initCustomCursor() {

    const cursor =
        document.querySelector(".cursor");

    const follower =
        document.querySelector(".cursor-follower");


    if (!cursor || !follower) return;


    // Disable custom cursor on touch devices

    if (
        window.matchMedia("(pointer: coarse)").matches
    ) {

        cursor.style.display = "none";
        follower.style.display = "none";

        return;

    }


    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let followerX = mouseX;
    let followerY = mouseY;


    window.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;


        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

    });


    function animateCursor() {

        followerX +=
            (mouseX - followerX) * 0.12;

        followerY +=
            (mouseY - followerY) * 0.12;


        follower.style.left =
            `${followerX}px`;

        follower.style.top =
            `${followerY}px`;


        requestAnimationFrame(animateCursor);

    }


    animateCursor();


    const interactiveElements =
        document.querySelectorAll(
            "a, button, .service-card, .experience-card"
        );


    interactiveElements.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                document.body.classList.add(
                    "cursor-hover"
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                document.body.classList.remove(
                    "cursor-hover"
                );

            }
        );

    });

}


/* =========================================================
   06. SCROLL REVEAL
========================================================= */

function initScrollReveal() {

    const elements =
        document.querySelectorAll(".reveal");


    if (!elements.length) return;


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    entry.target.classList.add(
                        "visible"
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   07. ANIMATED COUNTERS
========================================================= */

function initCounters() {

    const counters =
        document.querySelectorAll(
            ".stat strong[data-count]"
        );


    if (!counters.length) return;


    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    const counter =
                        entry.target;

                    const target =
                        Number(
                            counter.dataset.count
                        );


                    animateCounter(
                        counter,
                        target,
                        1800
                    );


                    counterObserver.unobserve(
                        counter
                    );

                });

            },
            {
                threshold: 0.6
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

}


/**
 * Animate one number
 */

function animateCounter(
    element,
    target,
    duration
) {

    const startTime =
        performance.now();


    function update(time) {

        const progress =
            Math.min(
                (time - startTime) / duration,
                1
            );


        // Smooth easing

        const eased =
            1 - Math.pow(
                1 - progress,
                4
            );


        const value =
            Math.floor(
                eased * target
            );


        element.textContent =
            value.toLocaleString("en-GB");


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString("en-GB");

        }

    }


    requestAnimationFrame(update);

}


/* =========================================================
   08. REVIEW SLIDER
========================================================= */

function initReviewSlider() {

    const reviews =
        document.querySelectorAll(
            ".review-card"
        );


    const nextButton =
        document.querySelector(
            ".slider-next"
        );


    const prevButton =
        document.querySelector(
            ".slider-prev"
        );


    const progress =
        document.querySelector(
            ".slider-progress span"
        );


    if (
        !reviews.length ||
        !nextButton ||
        !prevButton
    ) return;


    let current = 0;


    function showReview(index) {

        reviews.forEach(review => {

            review.classList.remove(
                "active"
            );

        });


        reviews[index].classList.add(
            "active"
        );


        if (progress) {

            const percentage =
                ((index + 1) /
                    reviews.length) * 100;


            progress.style.width =
                `${percentage}%`;

        }

    }


    nextButton.addEventListener(
        "click",
        () => {

            current++;

            if (
                current >=
                reviews.length
            ) {

                current = 0;

            }


            showReview(current);

        }
    );


    prevButton.addEventListener(
        "click",
        () => {

            current--;

            if (current < 0) {

                current =
                    reviews.length - 1;

            }


            showReview(current);

        }
    );


    // Automatic slider

    let autoSlide =
        setInterval(() => {

            current++;

            if (
                current >=
                reviews.length
            ) {

                current = 0;

            }


            showReview(current);

        }, 7000);


    function resetAutoSlide() {

        clearInterval(autoSlide);


        autoSlide =
            setInterval(() => {

                current++;

                if (
                    current >=
                    reviews.length
                ) {

                    current = 0;

                }


                showReview(current);

            }, 7000);

    }


    nextButton.addEventListener(
        "click",
        resetAutoSlide
    );


    prevButton.addEventListener(
        "click",
        resetAutoSlide
    );


    showReview(current);

}


/* =========================================================
   09. SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect()
                        .top
                    +
                    window.scrollY
                    -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });

}


/* =========================================================
   10. ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    if (
        !sections.length ||
        !navLinks.length
    ) return;


    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    const id =
                        entry.target.id;


                    navLinks.forEach(link => {

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
                threshold: 0.25,

                rootMargin:
                    "-20% 0px -55% 0px"
            }
        );


    sections.forEach(section => {

        sectionObserver.observe(
            section
        );

    });

}


/* =========================================================
   11. HERO PARALLAX
========================================================= */

function initHeroParallax() {

    const hero =
        document.querySelector(".hero");


    const heroImage =
        document.querySelector(
            ".hero-image"
        );


    if (!hero || !heroImage) return;


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }


    function updateParallax() {

        const rect =
            hero.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        // Only animate while hero is visible

        if (
            rect.bottom < 0 ||
            rect.top > viewportHeight
        ) {

            return;

        }


        const movement =
            window.scrollY * 0.18;


        heroImage.style.transform =
            `scale(1.02) translateY(${movement}px)`;

    }


    window.addEventListener(
        "scroll",
        updateParallax,
        { passive: true }
    );


    updateParallax();

}


/* =========================================================
   12. SERVICE CARD MAGNETIC HOVER
========================================================= */

function initMagneticCards() {

    const cards =
        document.querySelectorAll(
            ".service-card"
        );


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        return;

    }


    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const moveX =
                    (x - centerX) * 0.015;


                const moveY =
                    (y - centerY) * 0.015;


                card.style.transform =
                    `translate(${moveX}px, ${moveY}px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "translate(0, 0)";

            }
        );

    });

}


/* =========================================================
   13. IMAGE TILT
========================================================= */

function initImageTilt() {

    const image =
        document.querySelector(
            ".about-image"
        );


    if (!image) return;


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        return;

    }


    image.addEventListener(
        "mousemove",
        event => {

            const rect =
                image.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateX =
                ((y / rect.height) - 0.5) * -4;


            const rotateY =
                ((x / rect.width) - 0.5) * 4;


            image.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        }
    );


    image.addEventListener(
        "mouseleave",
        () => {

            image.style.transform =
                "perspective(900px) rotateX(0) rotateY(0)";

        }
    );

}


/* =========================================================
   14. BUTTON RIPPLE EFFECT
========================================================= */

function initButtonRipple() {

    const buttons =
        document.querySelectorAll(
            ".button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const ripple =
                    document.createElement(
                        "span"
                    );


                ripple.classList.add(
                    "button-ripple"
                );


                const rect =
                    button.getBoundingClientRect();


                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );


                ripple.style.width =
                    `${size}px`;

                ripple.style.height =
                    `${size}px`;


                ripple.style.left =
                    `${event.clientX - rect.left - size / 2}px`;

                ripple.style.top =
                    `${event.clientY - rect.top - size / 2}px`;


                button.appendChild(
                    ripple
                );


                setTimeout(() => {

                    ripple.remove();

                }, 700);

            }
        );

    });

}


/* =========================================================
   15. TEXT HOVER
========================================================= */

function initTextHover() {

    const links =
        document.querySelectorAll(
            ".footer-column a, .contact-item"
        );


    links.forEach(link => {

        link.addEventListener(
            "mouseenter",
            () => {

                link.style.transition =
                    "transform .4s cubic-bezier(.22,1,.36,1)";

                link.style.transform =
                    "translateX(5px)";

            }
        );


        link.addEventListener(
            "mouseleave",
            () => {

                link.style.transform =
                    "translateX(0)";

            }
        );

    });

}


/* =========================================================
   16. INIT EXTRA EFFECTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initMagneticCards();
        initImageTilt();
        initButtonRipple();
        initTextHover();

    }
);


/* =========================================================
   17. ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;


        const mobileMenu =
            document.querySelector(
                ".mobile-menu"
            );


        const toggle =
            document.querySelector(
                ".menu-toggle"
            );


        if (
            mobileMenu &&
            mobileMenu.classList.contains("open")
        ) {

            mobileMenu.classList.remove(
                "open"
            );


            document.body.classList.remove(
                "menu-open"
            );


            if (toggle) {

                toggle.classList.remove(
                    "active"
                );

            }

        }

    }
);


/* =========================================================
   18. PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            document.body.classList.add(
                "page-hidden"
            );

        } else {

            document.body.classList.remove(
                "page-hidden"
            );

        }

    }
);