
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
// TRANSLATIONS
// ==========================================

const dynamicTranslations = {
    en: {
        loading: "Loading...",
        signIn: "Sign in",
        unavailable: "Unavailable",

        connectionError: "Unable to connect to the client portal. Please try again later.",
        loadError: "Client information could not be loaded. Please refresh the page.",
        invalidLogin: "Incorrect username or password.",

        noProject: "No project",
        notStarted: "Not started",
        notSpecified: "Not specified",
        amountNotSpecified: "Amount not specified",

        noUpdates: "No updates available yet.",
        noMilestones: "No milestones available yet.",
        noFiles: "No files available yet.",
        noInvoices: "No invoices available yet.",

        projectUpdate: "Project update",
        projectMilestone: "Project milestone",
        unnamedFile: "Unnamed file",
        file: "File",
        invoice: "Invoice",

        completed: "Completed",
        upcoming: "Upcoming",
        paid: "Paid",
        unpaid: "Unpaid",

        viewFile: "View file →",
        viewInvoice: "View invoice →",

        statuses: {
            "In progress": "In progress",
            "Not started": "Not started",
            "Completed": "Completed",
            "On hold": "On hold",
            "Pending": "Pending"
        },

        types: {
            "Website Development": "Website Development"
        },

        content: {
            "Project started": "Project started",
            "Website structure completed": "Website structure completed",
            "Design and development": "Design and development",
            "Website structure": "Website structure",
            "Final review": "Final review",
            "Project delivery": "Project delivery",

            "The initial project setup and planning have been completed.":
                "The initial project setup and planning have been completed.",

            "The main website structure and page layouts have been completed.":
                "The main website structure and page layouts have been completed.",

            "The website design and development are currently in progress.":
                "The website design and development are currently in progress.",

            "Initial project setup and planning.":
                "Initial project setup and planning.",

            "Creating the website layout and main sections.":
                "Creating the website layout and main sections.",

            "Building and refining the website.":
                "Building and refining the website.",

            "Testing, feedback and final adjustments.":
                "Testing, feedback and final adjustments.",

            "Final website delivery and handover.":
                "Final website delivery and handover.",

            "Design and development of the official DK VISUALS website.":
                "Design and development of the official DK VISUALS website."
        }
    },

    nl: {
        loading: "Laden...",
        signIn: "Inloggen",
        unavailable: "Niet beschikbaar",

        connectionError: "Kan geen verbinding maken met het klantenportaal. Probeer het later opnieuw.",
        loadError: "Klantgegevens konden niet worden geladen. Vernieuw de pagina.",
        invalidLogin: "Onjuiste gebruikersnaam of wachtwoord.",

        noProject: "Geen project",
        notStarted: "Nog niet gestart",
        notSpecified: "Niet opgegeven",
        amountNotSpecified: "Bedrag niet opgegeven",

        noUpdates: "Er zijn nog geen updates beschikbaar.",
        noMilestones: "Er zijn nog geen projectfasen beschikbaar.",
        noFiles: "Er zijn nog geen bestanden beschikbaar.",
        noInvoices: "Er zijn nog geen facturen beschikbaar.",

        projectUpdate: "Projectupdate",
        projectMilestone: "Projectfase",
        unnamedFile: "Naamloos bestand",
        file: "Bestand",
        invoice: "Factuur",

        completed: "Voltooid",
        upcoming: "Aankomend",
        paid: "Betaald",
        unpaid: "Onbetaald",

        viewFile: "Bestand bekijken →",
        viewInvoice: "Factuur bekijken →",

        statuses: {
            "In progress": "In uitvoering",
            "Not started": "Nog niet gestart",
            "Completed": "Voltooid",
            "On hold": "Gepauzeerd",
            "Pending": "In afwachting"
        },

        types: {
            "Website Development": "Websiteontwikkeling"
        },

        content: {
            "Project started": "Project gestart",
            "Website structure completed": "Website structuur afgerond",
            "Design and development": "Ontwerp en ontwikkeling",
            "Website structure": "Website structuur",
            "Final review": "Eindcontrole",
            "Project delivery": "Projectoplevering",

            "The initial project setup and planning have been completed.":
                "De eerste projectopzet en planning zijn afgerond.",

            "The main website structure and page layouts have been completed.":
                "De hoofdstructuur en pagina-indelingen van de website zijn afgerond.",

            "The website design and development are currently in progress.":
                "Het ontwerp en de ontwikkeling van de website zijn momenteel in uitvoering.",

            "Initial project setup and planning.":
                "Eerste projectopzet en planning.",

            "Creating the website layout and main sections.":
                "Het maken van de website-indeling en de belangrijkste onderdelen.",

            "Building and refining the website.":
                "Het bouwen en verfijnen van de website.",

            "Testing, feedback and final adjustments.":
                "Testen, feedback en de laatste aanpassingen.",

            "Final website delivery and handover.":
                "Oplevering en overdracht van de definitieve website.",

            "Design and development of the official DK VISUALS website.":
                "Ontwerp en ontwikkeling van de officiële DK VISUALS-website."
        }
    },

    tr: {
        loading: "Yükleniyor...",
        signIn: "Giriş yap",
        unavailable: "Kullanılamıyor",

        connectionError: "Müşteri portalına bağlanılamıyor. Lütfen daha sonra tekrar deneyin.",
        loadError: "Müşteri bilgileri yüklenemedi. Lütfen sayfayı yenileyin.",
        invalidLogin: "Kullanıcı adı veya şifre hatalı.",

        noProject: "Proje yok",
        notStarted: "Henüz başlamadı",
        notSpecified: "Belirtilmedi",
        amountNotSpecified: "Tutar belirtilmedi",

        noUpdates: "Henüz güncelleme bulunmuyor.",
        noMilestones: "Henüz proje aşaması bulunmuyor.",
        noFiles: "Henüz dosya bulunmuyor.",
        noInvoices: "Henüz fatura bulunmuyor.",

        projectUpdate: "Proje güncellemesi",
        projectMilestone: "Proje aşaması",
        unnamedFile: "Adsız dosya",
        file: "Dosya",
        invoice: "Fatura",

        completed: "Tamamlandı",
        upcoming: "Yaklaşan",
        paid: "Ödendi",
        unpaid: "Ödenmedi",

        viewFile: "Dosyayı görüntüle →",
        viewInvoice: "Faturayı görüntüle →",

        statuses: {
            "In progress": "Devam ediyor",
            "Not started": "Henüz başlamadı",
            "Completed": "Tamamlandı",
            "On hold": "Beklemede",
            "Pending": "Bekliyor"
        },

        types: {
            "Website Development": "Web Sitesi Geliştirme"
        },

        content: {
            "Project started": "Proje başladı",
            "Website structure completed": "Web sitesi yapısı tamamlandı",
            "Design and development": "Tasarım ve geliştirme",
            "Website structure": "Web sitesi yapısı",
            "Final review": "Son kontrol",
            "Project delivery": "Proje teslimi",

            "The initial project setup and planning have been completed.":
                "İlk proje kurulumu ve planlama tamamlandı.",

            "The main website structure and page layouts have been completed.":
                "Web sitesinin ana yapısı ve sayfa düzenleri tamamlandı.",

            "The website design and development are currently in progress.":
                "Web sitesinin tasarımı ve geliştirilmesi devam ediyor.",

            "Initial project setup and planning.":
                "İlk proje kurulumu ve planlama.",

            "Creating the website layout and main sections.":
                "Web sitesi düzeninin ve ana bölümlerinin oluşturulması.",

            "Building and refining the website.":
                "Web sitesinin oluşturulması ve geliştirilmesi.",

            "Testing, feedback and final adjustments.":
                "Testler, geri bildirimler ve son düzenlemeler.",

            "Final website delivery and handover.":
                "Web sitesinin son teslimi ve devri.",

            "Design and development of the official DK VISUALS website.":
                "DK VISUALS resmi web sitesinin tasarımı ve geliştirilmesi."
        }
    }
};

// ==========================================
// LANGUAGE HELPERS
// ==========================================

function getLanguage() {
    const language = document.documentElement.lang || "en";
    const baseLanguage = language.toLowerCase().split("-")[0];

    return dynamicTranslations[baseLanguage]
        ? baseLanguage
        : "en";
}

function translate(key) {
    const translations = dynamicTranslations[getLanguage()];

    return translations[key] ?? dynamicTranslations.en[key] ?? key;
}

function translateContent(value) {
    if (!value) return "";

    const translations = dynamicTranslations[getLanguage()];

    return translations.content[value] ?? value;
}

function translateStatus(value) {
    if (!value) return translate("notStarted");

    const translations = dynamicTranslations[getLanguage()];

    return translations.statuses[value] ?? value;
}

function translateType(value) {
    if (!value) return "—";

    const translations = dynamicTranslations[getLanguage()];

    return translations.types[value] ?? value;
}

// ==========================================
// DOM ELEMENTS
// ==========================================

const loginScreen = document.getElementById("loginScreen");
const portalContent = document.getElementById("portalContent");

const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
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
    if (!loginScreen || !portalContent || !loginForm ||
        !loginUsername || !loginPassword || !loginError ||
        !loginButton || !logoutButton) {
        console.error("Client portal HTML elements are missing.");
        return;
    }

    loginScreen.hidden = false;
    portalContent.hidden = true;

    await loadClients();

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
    loginButton.querySelector("span").textContent = translate("loading");

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
        loginButton.querySelector("span").textContent = translate("signIn");

    } catch (error) {
        console.error("Client portal loading error:", error);

        loginError.textContent = translate("connectionError");

        loginButton.querySelector("span").textContent = translate("unavailable");
    }
}

// ==========================================
// LOGIN
// ==========================================

function handleLogin(event) {
    event.preventDefault();

    loginError.textContent = "";

    if (clients.length === 0) {
        loginError.textContent = translate("loadError");
        return;
    }

    const username = loginUsername.value.trim().toLowerCase();
    const password = loginPassword.value;

    const client = clients.find(item => {
        return (
            typeof item.username === "string" &&
            item.username.trim().toLowerCase() === username &&
            item.password === password &&
            item.active === true
        );
    });

    if (!client) {
        loginError.textContent = translate("invalidLogin");
        loginPassword.value = "";
        loginPassword.focus();
        return;
    }

    currentClient = client;

    loginScreen.hidden = true;
    portalContent.hidden = false;

    loginForm.reset();

    renderPortal();
    showSection("dashboard");

    window.scrollTo(0, 0);
}

// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {
    currentClient = null;

    portalContent.hidden = true;
    loginScreen.hidden = false;

    loginForm.reset();
    loginError.textContent = "";

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

    setText("dashboardProjectName", project.name || translate("noProject"));
    setText("dashboardProjectStatus", translateStatus(project.status));
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
        container.appendChild(createEmptyMessage(translate("noUpdates")));
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
        title.textContent = translateContent(update.title || translate("projectUpdate"));

        const description = document.createElement("p");
        description.textContent = translateContent(update.description || "");

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
    setText("projectName", project.name || translate("noProject"));
    setText("projectDescription", translateContent(project.description || ""));
    setText("projectType", translateType(project.type));
    setText("projectStatus", translateStatus(project.status));

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
        container.appendChild(createEmptyMessage(translate("noMilestones")));
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
        title.textContent = translateContent(step.title || translate("projectMilestone"));

        const description = document.createElement("p");
        description.textContent = translateContent(step.description || "");

        const date = document.createElement("span");
        date.className = "timeline-date";
        date.textContent = formatDate(step.date);

        const status = document.createElement("span");
        status.className = "timeline-status";
        status.textContent = step.completed
            ? translate("completed")
            : translate("upcoming");

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
        container.appendChild(createEmptyMessage(translate("noFiles")));
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
        name.textContent = file.name || translate("unnamedFile");

        const details = document.createElement("span");
        details.textContent = [
            file.type || translate("file"),
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
            link.textContent = translate("viewFile");

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
        container.appendChild(createEmptyMessage(translate("noInvoices")));
        return;
    }

    invoices.forEach(invoice => {
        const item = document.createElement("article");
        item.className = "invoice-item";

        const info = document.createElement("div");
        info.className = "invoice-info";

        const number = document.createElement("h3");
        number.textContent = invoice.number || translate("invoice");

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

        status.textContent = isPaid
            ? translate("paid")
            : translate("unpaid");

        item.append(info, status);

        if (invoice.url) {
            const link = document.createElement("a");
            link.className = "invoice-action";
            link.href = invoice.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = translate("viewInvoice");

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
    if (!dateString) return translate("notSpecified");

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    const locales = {
        en: "en-GB",
        nl: "nl-NL",
        tr: "tr-TR"
    };

    return new Intl.DateTimeFormat(
        locales[getLanguage()],
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(date);
}

function formatCurrency(amount) {
    const number = Number(amount);

    if (!Number.isFinite(number)) {
        return translate("amountNotSpecified");
    }

    const locales = {
        en: "en-GB",
        nl: "nl-NL",
        tr: "tr-TR"
    };

    return new Intl.NumberFormat(
        locales[getLanguage()],
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(number);
}

function createEmptyMessage(message) {
    const element = document.createElement("p");
    element.className = "empty-message";
    element.textContent = message;

    return element;
}
