/* =========================================================
   DK VISUALS — MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   HEADER
========================================================= */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});



/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.querySelector(".menu-button");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

menuButton.addEventListener("click", () => {

    document.body.classList.toggle("menu-open");

});


mobileMenuLinks.forEach(link => {

    link.addEventListener("click", () => {

        document.body.classList.remove("menu-open");

    });

});



/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});



/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

let mouseX = 0;
let mouseY = 0;

let followerX = 0;
let followerY = 0;


window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function animateCursor() {

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;


    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;


    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;


    requestAnimationFrame(animateCursor);

}

animateCursor();



/* =========================================================
   CURSOR HOVER EFFECT
========================================================= */

const interactiveElements = document.querySelectorAll(
    "a, button, .service-item, .project-card"
);

interactiveElements.forEach(element => {

    element.addEventListener("mouseenter", () => {

        document.body.classList.add("cursor-hover");

    });

    element.addEventListener("mouseleave", () => {

        document.body.classList.remove("cursor-hover");

    });

});



/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

const magneticElements = document.querySelectorAll(".magnetic");

magneticElements.forEach(element => {

    element.addEventListener("mousemove", (event) => {

        const rect = element.getBoundingClientRect();

        const x =
            event.clientX -
            rect.left -
            rect.width / 2;

        const y =
            event.clientY -
            rect.top -
            rect.height / 2;

        element.style.transform =
            `translate(${x * 0.12}px, ${y * 0.12}px)`;

    });


    element.addEventListener("mouseleave", () => {

        element.style.transform =
            "translate(0,0)";

    });

});



/* =========================================================
   SCROLL REVEALS
========================================================= */

const revealElements = document.querySelectorAll(
    ".reveal-text, .service-item, .project-card, .process-item, .about-content"
);


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    revealObserver.observe(element);

});



/* =========================================================
   ADD INLINE REVEAL STYLE
========================================================= */

const animatedElements = document.querySelectorAll(
    ".service-item, .project-card, .process-item, .about-content"
);


animatedElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(45px)";
    element.style.transition =
        "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)";

});


const animatedObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                animatedObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);


animatedElements.forEach(element => {

    animatedObserver.observe(element);

});



/* =========================================================
   HERO VIDEO PARALLAX
========================================================= */

const heroVideo = document.querySelector(".hero-video");

window.addEventListener("scroll", () => {

    if (!heroVideo) return;

    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight) {

        heroVideo.style.transform =
            `scale(1.04) translateY(${scrollY * 0.08}px)`;

    }

});



/* =========================================================
   SERVICE HOVER NUMBER
========================================================= */

const services = document.querySelectorAll(".service-item");

services.forEach(service => {

    service.addEventListener("mouseenter", () => {

        service.querySelector(".service-number").style.color =
            "#ffffff";

    });

    service.addEventListener("mouseleave", () => {

        service.querySelector(".service-number").style.color =
            "#555";

    });

});



/* =========================================================
   PREVENT BROKEN IMAGE LAYOUT
========================================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("error", () => {

        image.style.display = "none";

    });

});