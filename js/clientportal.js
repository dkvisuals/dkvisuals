
/* ========================================
   DK VISUALS — CLIENT PORTAL
   Project Tracking & Timeline Functionality
======================================== */


/* ========================================
   01. CONFIGURATION
======================================== */

const CLIENTS_FILE = "assets/data/clients.json";
const STORAGE_KEY = "dkvisuals_project_session";


/* ========================================
   02. DOM ELEMENTS
======================================== */

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const projectNumberInput = document.getElementById("projectNumber");

const logoutButton = document.getElementById("logoutButton");

const navigationLinks = document.querySelectorAll(".portal-nav-link");
const portalViews = document.querySelectorAll(".portal-view");

const currentPageTitle = document.getElementById("currentPageTitle");

const projectTimeline = document.getElementById("projectTimeline");
const dashboardTimelinePreview = document.getElementById("dashboardTimelinePreview");

let clients = [];
let currentClient = null;


/* ========================================
   03. LOAD PROJECT DATA
======================================== */

async function loadClients() {
    try {
        const response = await fetch(CLIENTS_FILE, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Unable to load project data.");
        }

        clients = await response.json();

        if (!Array.isArray(clients)) {
            throw new Error("Invalid project data format.");
        }

        return true;

    } catch (error) {
        console.error("Project data error:", error);

        if (loginError) {
            loginError.textContent =
                "Unable to load the client portal. Please try again later.";
        }

        return false;
    }
}


/* ========================================
   04. PROJECT NUMBER
======================================== */

function normalizeProjectNumber(value) {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/^DK-/, "")
        .replace(/\s/g, "");
}


function getFullProjectNumber(value) {
    return "DK-" + normalizeProjectNumber(value);
}


function findProject(projectNumber) {
    return clients.find(function (client) {
        const storedNumber =
            client.projectNumber ||
            client.project?.number ||
            "";

        return normalizeProjectNumber(storedNumber) ===
            normalizeProjectNumber(projectNumber);
    });
}


/* ========================================
   05. LOGIN
======================================== */

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginError.textContent = "";

    const enteredNumber = normalizeProjectNumber(
        projectNumberInput.value
    );

    if (!enteredNumber) {
        loginError.textContent = "Please enter your project number.";
        return;
    }

    const submitButton = loginForm.querySelector(".login-button");

    submitButton.disabled = true;
    submitButton.innerHTML = "Loading...";

    const loaded = await loadClients();

    if (!loaded) {
        resetLoginButton();
        return;
    }

    const client = findProject(enteredNumber);

    if (!client) {
        loginError.textContent =
            "No project was found with this project number.";

        resetLoginButton();
        return;
    }

    currentClient = client;

    const fullProjectNumber = getFullProjectNumber(
        client.projectNumber || client.project?.number
    );

    sessionStorage.setItem(
        STORAGE_KEY,
        fullProjectNumber
    );

    showDashboard();
    renderDashboard(client);

    loginForm.reset();

    resetLoginButton();
});


function resetLoginButton() {
    const submitButton = loginForm.querySelector(".login-button");

    submitButton.disabled = false;
    submitButton.innerHTML = 'Continue <span>↗</span>';
}


/* ========================================
   06. SHOW / HIDE PAGES
======================================== */

function showDashboard() {
    loginPage.hidden = true;
    dashboardPage.hidden = false;

    navigateTo("dashboard");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showLogin() {
    dashboardPage.hidden = true;
    loginPage.hidden = false;

    currentClient = null;

    sessionStorage.removeItem(STORAGE_KEY);

    if (loginError) {
        loginError.textContent = "";
    }

    if (projectNumberInput) {
        projectNumberInput.value = "";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ========================================
   07. NAVIGATION
======================================== */

function navigateTo(section) {
    const validSections = [
        "dashboard",
        "project"
    ];

    if (!validSections.includes(section)) {
        section = "dashboard";
    }

    navigationLinks.forEach(function (link) {
        const isActive = link.dataset.section === section;

        link.classList.toggle("active", isActive);
    });

    portalViews.forEach(function (view) {
        view.classList.remove("active");
    });

    const activeView = document.getElementById(
        section + "View"
    );

    if (activeView) {
        activeView.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        project: "My Project"
    };

    if (currentPageTitle) {
        currentPageTitle.textContent = titles[section];
    }

    history.replaceState(null, "", "#" + section);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        navigateTo(link.dataset.section);
    });
});


/* ========================================
   08. DASHBOARD NAVIGATION BUTTONS
======================================== */

document.querySelectorAll("[data-navigate]").forEach(function (button) {
    button.addEventListener("click", function () {
        navigateTo(button.dataset.navigate);
    });
});


/* ========================================
   09. RENDER DASHBOARD
======================================== */

function renderDashboard(client) {
    if (!client) return;

    const project = client.project || {};

    const projectNumber = getFullProjectNumber(
        client.projectNumber || project.number
    );

    const firstName = client.name
        ? client.name.trim().split(" ")[0]
        : "Client";


    /* Client information */

    setText("sidebarName", client.name || "Client");
    setText("sidebarAvatar", firstName.charAt(0).toUpperCase());

    setText("sidebarProjectNumber", projectNumber);
    setText("welcomeName", firstName);


    /* Dashboard project status */

    setText(
        "dashboardStatus",
        project.status || "Not started"
    );


    /* Project progress */

    const progress = getValidProgress(project.progress);

    /* Dashboard progress */

    setText("dashboardProgress", progress + "%");
    setProgress("dashboardProgressBar", progress);

    /* Project page progress */

    setText("projectPageProgress", progress + "%");
    setProgress("projectPageProgressBar", progress);


    /* Dashboard expected delivery */

    setText(
        "dashboardExpectedDelivery",
        project.endDate || "—"
    );


    /* Project page information */

    setText(
        "projectPageName",
        project.name || "No project assigned"
    );

    setText(
        "projectPageDescription",
        project.description || "No project description available."
    );

    setText("projectPageNumber", projectNumber);
    setText("projectPageStatus", project.status || "Not started");
    setText("projectPageStart", project.startDate || "—");
    setText("projectPageEnd", project.endDate || "—");


    /* Project timeline */

    const timeline = Array.isArray(project.timeline)
        ? project.timeline
        : [];

    renderProjectTimeline(timeline);
    renderDashboardTimeline(timeline);
}


/* ========================================
   10. PROJECT TIMELINE
======================================== */

/*
   Expected status values:

   completed
   current
   upcoming

   Timeline data is loaded from clients.json.
*/


function normalizeTimelineStatus(status) {
    const value = String(status || "").toLowerCase().trim();

    if (["completed", "complete", "done"].includes(value)) {
        return "completed";
    }

    if (["current", "in progress", "in-progress", "active"].includes(value)) {
        return "current";
    }

    return "upcoming";
}


/* ========================================
   CREATE TIMELINE ITEM
======================================== */

function createTimelineItem(phase, index) {
    const status = normalizeTimelineStatus(phase.status);

    const item = document.createElement("article");
    item.className = "timeline-item timeline-" + status;

    const marker = document.createElement("div");
    marker.className = "timeline-marker";

    const markerIcon = document.createElement("span");
    markerIcon.className = "timeline-marker-icon";

    if (status === "completed") {
        markerIcon.textContent = "✓";

    } else if (status === "current") {
        markerIcon.textContent = "●";

    } else {
        markerIcon.textContent = String(index + 1).padStart(2, "0");
    }

    marker.appendChild(markerIcon);


    /* Timeline content */

    const content = document.createElement("div");
    content.className = "timeline-content";


    /* Timeline header */

    const header = document.createElement("div");
    header.className = "timeline-item-header";


    const title = document.createElement("h3");
    title.className = "timeline-item-title";
    title.textContent = phase.title || "Project phase";


    /* Status badge */

    const badge = document.createElement("span");
    badge.className = "timeline-status timeline-status-" + status;

    const statusLabels = {
        completed: "Completed",
        current: "In progress",
        upcoming: "Upcoming"
    };

    badge.textContent = statusLabels[status];


    header.appendChild(title);
    header.appendChild(badge);


    /* Description */

    const description = document.createElement("p");
    description.className = "timeline-item-description";

    description.textContent =
        phase.description || "No additional information available.";


    content.appendChild(header);
    content.appendChild(description);


    /* Date */

    if (phase.date) {
        const date = document.createElement("span");
        date.className = "timeline-item-date";
        date.textContent = phase.date;

        content.appendChild(date);
    }


    item.appendChild(marker);
    item.appendChild(content);

    return item;
}


/* ========================================
   RENDER FULL TIMELINE
======================================== */

function renderProjectTimeline(timeline) {
    if (!projectTimeline) return;

    projectTimeline.replaceChildren();

    if (!Array.isArray(timeline) || timeline.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "timeline-empty";
        emptyMessage.textContent =
            "The project timeline has not been added yet.";

        projectTimeline.appendChild(emptyMessage);
        return;
    }

    timeline.forEach(function (phase, index) {
        const item = createTimelineItem(phase, index);

        projectTimeline.appendChild(item);
    });
}


/* ========================================
   RENDER DASHBOARD TIMELINE PREVIEW
======================================== */

function renderDashboardTimeline(timeline) {
    if (!dashboardTimelinePreview) return;

    dashboardTimelinePreview.replaceChildren();

    if (!Array.isArray(timeline) || timeline.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "timeline-empty";
        emptyMessage.textContent =
            "The project timeline has not been added yet.";

        dashboardTimelinePreview.appendChild(emptyMessage);
        return;
    }

    /*
       Only display the latest timeline update.
       The latest update is expected to be the
       last item in the clients.json timeline array.
    */

    const latestIndex = timeline.length - 1;
    const latestPhase = timeline[latestIndex];

    const latestItem = createTimelineItem(
        latestPhase,
        latestIndex
    );

    latestItem.classList.add("timeline-preview-current");

    dashboardTimelinePreview.appendChild(latestItem);
}


/* ========================================
   11. HELPER FUNCTIONS
======================================== */

function setText(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent =
            value !== undefined && value !== null && value !== ""
                ? value
                : "—";
    }
}


function getValidProgress(value) {
    const progress = Number(value);

    if (!Number.isFinite(progress)) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round(progress)));
}


function setProgress(elementId, progress) {
    const element = document.getElementById(elementId);

    if (element) {
        element.style.width = progress + "%";
    }
}


/* ========================================
   12. LOGOUT
======================================== */

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        showLogin();
    });
}


/* ========================================
   13. RESTORE SESSION
======================================== */

async function restoreSession() {
    const sessionNumber = sessionStorage.getItem(STORAGE_KEY);

    if (!sessionNumber) return;

    const loaded = await loadClients();

    if (!loaded) return;

    const client = findProject(sessionNumber);

    if (!client) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
    }

    currentClient = client;

    showDashboard();
    renderDashboard(client);
}


/* ========================================
   14. INITIALIZATION
======================================== */

function initializePortal() {
    setText("currentYear", new Date().getFullYear());

    restoreSession();
}


initializePortal();
