
"use strict";

// ==========================================
// CONFIGURATION
// ==========================================

const CLIENTS_PATH = "assets/data/clients.json";

// ==========================================
// APPLICATION STATE
// ==========================================

let clients = [];
let currentClient = null;

// ==========================================
// DOM ELEMENTS
// ==========================================

const loginScreen = document.getElementById("loginScreen");
const portalContent = document.getElementById("portalContent");

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const loginButton = document.getElementById("loginButton");

const logoutButton = document.getElementById("logoutButton");

const navigationLinks = document.querySelectorAll("[data-section]");

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", initializePortal);

async function initializePortal() {
    // Always start at the login screen.
    loginScreen.hidden = false;
    portalContent.hidden = true;

    // Load client records.
    await loadClients();

    // Attach event listeners.
    loginForm.addEventListener("submit", handleLogin);
    logoutButton.addEventListener("click", handleLogout);

    navigationLinks.forEach(link => {
        link.addEventListener("click", handleNavigation);
    });
}

// ==========================================
// LOAD CLIENTS
// ==========================================

async function loadClients() {
    loginButton.disabled = true;
    loginButton.querySelector("span").textContent = "Loading...";

    try {
        const response = await fetch(CLIENTS_PATH, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Could not load clients.json (${response.status})`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.clients)) {
            throw new Error("Invalid clients.json format.");
        }

        clients = data.clients;

        loginButton.disabled = false;
        loginButton.querySelector("span").textContent = "Sign in";

    } catch (error) {
        console.error("Client portal loading error:", error);

        loginError.textContent =
            "Unable to connect to the client portal. Please try again later.";

        loginButton.querySelector("span").textContent = "Unavailable";
    }
}

// ==========================================
// LOGIN
// ==========================================

function handleLogin(event) {
    event.preventDefault();

    loginError.textContent = "";

    if (clients.length === 0) {
        loginError.textContent =
            "Client information could not be loaded. Please refresh the page.";
        return;
    }

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    const client = clients.find(item => {
        return (
            typeof item.email === "string" &&
            item.email.toLowerCase() === email &&
            item.password === password &&
            item.active === true
        );
    });

    if (!client) {
        loginError.textContent = "Incorrect email or password.";
        loginPassword.value = "";
        loginPassword.focus();
        return;
    }

    currentClient = client;

    // Hide login and show portal.
    loginScreen.hidden = true;
    portalContent.hidden = false;

    loginForm.reset();

    // Render all client information.
    renderPortal();

    // Start at dashboard.
    showSection("dashboard");

    window.scrollTo(0, 0);
}

// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {
    currentClient = null;

    // Hide portal and show login.
    portalContent.hidden = true;
    loginScreen.hidden = false;

    // Reset login form.
    loginForm.reset();
    loginError.textContent = "";

    // Reset navigation.
    showSection("dashboard");

    window.scrollTo(0, 0);
}

// ==========================================
// RENDER PORTAL
// ==========================================

function renderPortal() {
    if (!currentClient) return;

    renderClientInfo();
    renderDashboard();
    renderProject();
    renderFiles();
    renderInvoices();
}

// ==========================================
// CLIENT INFORMATION
// ==========================================

function renderClientInfo() {
    setText("clientName", currentClient.name);
    setText("clientEmail", currentClient.email);

    const avatar = document.getElementById("clientAvatar");

    if (avatar) {
        avatar.textContent = (currentClient.name || "C")
            .trim()
            .charAt(0)
            .toUpperCase();
    }

    setText("dashboardClientName", currentClient.name);
}

// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {
    const project = currentClient.project || {};

    setText("dashboardProjectName", project.name || "No project");
    setText("dashboardProjectStatus", project.status || "Not started");
    setText("dashboardDeliveryDate", formatDate(project.deliveryDate));

    const progress = getProgress(project.progress);

    setText("dashboardProgress", `${progress}%`);
    setProgressBar("dashboardProgressBar", progress);

    renderRecentUpdates();
}

// ==========================================
// RECENT UPDATES
// ==========================================

function renderRecentUpdates() {
    const container = document.getElementById("recentUpdates");
    if (!container) return;

    container.replaceChildren();

    const updates = [...(currentClient.updates || [])];

    updates.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    if (updates.length === 0) {
        container.appendChild(createEmptyMessage("No updates available yet."));
        return;
    }

    updates.forEach(update => {
        const item = document.createElement("article");
        item.className = "update-item";

        const marker = document.createElement("span");
        marker.className = "update-marker";

        const content = document.createElement("div");
        content.className = "update-content";

        const title = document.createElement("h3");
        title.textContent = update.title || "Project update";

        const description = document.createElement("p");
        description.textContent = update.description || "";

        const date = document.createElement("span");
        date.className = "update-date";
        date.textContent = formatDate(update.date);

        content.append(title, description, date);
        item.append(marker, content);

        container.appendChild(item);
    });
}

// ==========================================
// PROJECT
// ==========================================

function renderProject() {
    const project = currentClient.project || {};

    setText("projectId", project.id || "—");
    setText("projectName", project.name || "No project");
    setText("projectDescription", project.description || "");
    setText("projectType", project.type || "—");
    setText("projectStatus", project.status || "Not started");

    setText("projectStartDate", formatDate(project.startDate));
    setText("projectDeliveryDate", formatDate(project.deliveryDate));

    const progress = getProgress(project.progress);

    setText("projectProgress", `${progress}%`);
    setProgressBar("projectProgressBar", progress);

    renderTimeline();
}

// ==========================================
// PROJECT TIMELINE
// ==========================================

function renderTimeline() {
    const container = document.getElementById("projectTimeline");
    if (!container) return;

    container.replaceChildren();

    const timeline = currentClient.timeline || [];

    if (timeline.length === 0) {
        container.appendChild(createEmptyMessage("No milestones available yet."));
        return;
    }

    timeline.forEach(step => {
        const item = document.createElement("article");

        item.className = step.completed
            ? "timeline-item completed"
            : "timeline-item";

        const marker = document.createElement("div");
        marker.className = "timeline-marker";

        const content = document.createElement("div");
        content.className = "timeline-content";

        const title = document.createElement("h3");
        title.textContent = step.title || "Project milestone";

        const description = document.createElement("p");
        description.textContent = step.description || "";

        const date = document.createElement("span");
        date.className = "timeline-date";
        date.textContent = formatDate(step.date);

        const status = document.createElement("span");
        status.className = "timeline-status";
        status.textContent = step.completed ? "Completed" : "Upcoming";

        content.append(title, description, date, status);
        item.append(marker, content);

        container.appendChild(item);
    });
}

// ==========================================
// FILES
// ==========================================

function renderFiles() {
    const container = document.getElementById("filesList");
    if (!container) return;

    container.replaceChildren();

    const files = currentClient.files || [];

    if (files.length === 0) {
        container.appendChild(createEmptyMessage("No files available yet."));
        return;
    }

    files.forEach(file => {
        const item = document.createElement("article");
        item.className = "file-item";

        const icon = document.createElement("div");
        icon.className = "file-icon";
        icon.textContent = "▤";

        const info = document.createElement("div");
        info.className = "file-info";

        const name = document.createElement("h3");
        name.textContent = file.name || "Unnamed file";

        const details = document.createElement("span");
        details.textContent = [
            file.type || "File",
            formatDate(file.date)
        ].filter(Boolean).join(" · ");

        info.append(name, details);
        item.append(icon, info);

        if (file.url) {
            const link = document.createElement("a");
            link.className = "file-action";
            link.href = file.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View file →";

            item.appendChild(link);
        }

        container.appendChild(item);
    });
}

// ==========================================
// INVOICES
// ==========================================

function renderInvoices() {
    const container = document.getElementById("invoicesList");
    if (!container) return;

    container.replaceChildren();

    const invoices = currentClient.invoices || [];

    if (invoices.length === 0) {
        container.appendChild(createEmptyMessage("No invoices available yet."));
        return;
    }

    invoices.forEach(invoice => {
        const item = document.createElement("article");
        item.className = "invoice-item";

        const info = document.createElement("div");
        info.className = "invoice-info";

        const number = document.createElement("h3");
        number.textContent = invoice.number || "Invoice";

        const date = document.createElement("span");
        date.textContent = formatDate(invoice.date);

        const amount = document.createElement("strong");
        amount.textContent = formatCurrency(invoice.amount);

        info.append(number, date, amount);

        const status = document.createElement("span");
        const isPaid = String(invoice.status).toLowerCase() === "paid";

        status.className = isPaid
            ? "invoice-status paid"
            : "invoice-status unpaid";

        status.textContent = isPaid ? "Paid" : "Unpaid";

        item.append(info, status);

        if (invoice.url) {
            const link = document.createElement("a");
            link.className = "invoice-action";
            link.href = invoice.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View invoice →";

            item.appendChild(link);
        }

        container.appendChild(item);
    });
}

// ==========================================
// NAVIGATION
// ==========================================

function handleNavigation(event) {
    event.preventDefault();

    if (!currentClient) return;

    const section = event.currentTarget.dataset.section;

    showSection(section);
}

function showSection(sectionName) {
    const validSections = [
        "dashboard",
        "project",
        "files",
        "invoices"
    ];

    if (!validSections.includes(sectionName)) {
        sectionName = "dashboard";
    }

    document.querySelectorAll(".portal-section").forEach(section => {
        section.classList.toggle(
            "active",
            section.id === `${sectionName}Section`
        );
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionName
        );
    });

    // Update URL hash without reloading the page.
    history.replaceState(null, "", `#${sectionName}`);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}

function getProgress(value) {
    const progress = Number(value);

    if (!Number.isFinite(progress)) return 0;

    return Math.min(100, Math.max(0, progress));
}

function setProgressBar(id, progress) {
    const element = document.getElementById(id);

    if (element) {
        element.style.width = `${progress}%`;
    }
}

function formatDate(dateString) {
    if (!dateString) return "Not specified";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function formatCurrency(amount) {
    const number = Number(amount);

    if (!Number.isFinite(number)) {
        return "Amount not specified";
    }

    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "EUR"
    }).format(number);
}

function createEmptyMessage(message) {
    const element = document.createElement("p");
    element.className = "empty-message";
    element.textContent = message;

    return element;
}
