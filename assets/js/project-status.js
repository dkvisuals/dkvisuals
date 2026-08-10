/* =========================================================
   DK VISUALS — PROJECT PORTAL
   project-status.js
========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginSection =
        document.getElementById("project-login");

    const dashboardSection =
        document.getElementById("project-dashboard");

    const loginForm =
        document.getElementById("project-login-form");

    const projectNumberInput =
        document.getElementById("project-number");

    const projectCodeInput =
        document.getElementById("project-code");

    const loginButton =
        loginForm?.querySelector(".project-login-button");

    const errorMessage =
        document.getElementById("project-error");

    const logoutButton =
        document.getElementById("project-logout");


    /* =====================================================
       DASHBOARD ELEMENTS
    ===================================================== */

    const dashboardProjectTitle =
        document.getElementById("dashboard-project-title");

    const dashboardClient =
        document.getElementById("dashboard-client");

    const dashboardNumber =
        document.getElementById("dashboard-number");

    const dashboardStartDate =
        document.getElementById("dashboard-start-date");

    const dashboardDeadline =
        document.getElementById("dashboard-deadline");

    const dashboardProgress =
        document.getElementById("dashboard-progress");

    const dashboardProgressBar =
        document.getElementById("dashboard-progress-bar");

    const dashboardStatus =
        document.getElementById("dashboard-status");

    const projectPhasesContainer =
        document.getElementById("project-phases");

    const projectUpdatesContainer =
        document.getElementById("project-updates-list");

    const dashboardNextStepTitle =
        document.getElementById("dashboard-next-step-title");

    const dashboardNextStepDescription =
        document.getElementById("dashboard-next-step-description");

    const dashboardType =
        document.getElementById("dashboard-type");

    const dashboardPages =
        document.getElementById("dashboard-pages");

    const dashboardLanguage =
        document.getElementById("dashboard-language");

    const dashboardLastUpdated =
        document.getElementById("dashboard-last-updated");


    /* =====================================================
       CONFIG
    ===================================================== */

    const PROJECTS_FILE =
        "assets/data/projects.json";

    const SESSION_KEY =
        "dkvisuals_active_project";


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    loginForm?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            clearError();


            const projectNumber =
                projectNumberInput.value
                    .trim()
                    .toUpperCase();

            const accessCode =
                projectCodeInput.value
                    .trim();


            if (
                !projectNumber ||
                !accessCode
            ) {

                showError(
                    "Vul je projectnummer en toegangscode in."
                );

                return;

            }


            setLoadingState(true);


            try {

                const projects =
                    await loadProjects();


                const project =
                    findProject(
                        projects,
                        projectNumber,
                        accessCode
                    );


                if (!project) {

                    showError(
                        "Projectnummer of toegangscode is onjuist."
                    );

                    setLoadingState(false);

                    return;

                }


                saveSession(project);


                openProject(project);


            } catch (error) {

                console.error(
                    "Project portal error:",
                    error
                );


                showError(
                    "Het project kon niet worden geladen. Probeer het later opnieuw."
                );


                setLoadingState(false);

            }

        }
    );


    /* =====================================================
       LOAD PROJECT JSON
    ===================================================== */

    async function loadProjects() {

        const response =
            await fetch(
                PROJECTS_FILE,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Projects JSON kon niet worden geladen: ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
            Ondersteunt beide:

            {
                "projects": [...]
            }

            OF:

            [...]
        */


        if (Array.isArray(data)) {

            return data;

        }


        if (
            data &&
            Array.isArray(data.projects)
        ) {

            return data.projects;

        }


        throw new Error(
            "Ongeldige projects.json structuur."
        );

    }


    /* =====================================================
       FIND PROJECT
    ===================================================== */

    function findProject(
        projects,
        projectNumber,
        accessCode
    ) {

        return projects.find(project => {

            if (!project) return false;


            const storedNumber =
                String(
                    project.projectNumber || ""
                )
                    .trim()
                    .toUpperCase();


            const storedCode =
                String(
                    project.accessCode || ""
                )
                    .trim();


            return (
                storedNumber === projectNumber &&
                storedCode === accessCode
            );

        });

    }


    /* =====================================================
       OPEN PROJECT
    ===================================================== */

    function openProject(project) {

        fillDashboard(project);


        setLoadingState(false);


        if (loginSection) {

            loginSection.classList.add(
                "portal-leaving"
            );

        }


        window.setTimeout(
            () => {

                if (loginSection) {

                    loginSection.hidden = true;

                    loginSection.classList.remove(
                        "portal-leaving"
                    );

                }


                if (dashboardSection) {

                    dashboardSection.hidden = false;

                    dashboardSection.classList.add(
                        "portal-entering"
                    );

                }


                dashboardSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                window.setTimeout(
                    () => {

                        dashboardSection?.classList.remove(
                            "portal-entering"
                        );

                    },
                    850
                );


                animateProgress(
                    normalizeProgress(
                        project.progress
                    )
                );

            },
            500
        );

    }


    /* =====================================================
       FILL DASHBOARD
    ===================================================== */

    function fillDashboard(project) {


        setText(
            dashboardProjectTitle,
            project.title
        );


        setText(
            dashboardClient,
            project.client
        );


        setText(
            dashboardNumber,
            project.projectNumber
        );


        setText(
            dashboardStartDate,
            formatDate(
                project.startDate
            )
        );


        setText(
            dashboardDeadline,
            formatDate(
                project.deadline
            )
        );


        setText(
            dashboardStatus,
            project.status
        );


        setText(
            dashboardType,
            project.type
        );


        setText(
            dashboardPages,
            formatPages(
                project.pages
            )
        );


        setText(
            dashboardLanguage,
            formatLanguages(
                project.language
            )
        );


        setText(
            dashboardLastUpdated,
            formatDate(
                project.lastUpdated
            )
        );


        /* NEXT STEP */

        const nextStep =
            project.nextStep || {};


        setText(
            dashboardNextStepTitle,
            nextStep.title
        );


        setText(
            dashboardNextStepDescription,
            nextStep.description
        );


        /* PROGRESS */

        const progress =
            normalizeProgress(
                project.progress
            );


        if (dashboardProgress) {

            dashboardProgress.textContent =
                "0";

        }


        if (dashboardProgressBar) {

            dashboardProgressBar.style.width =
                "0%";

        }


        /* PHASES */

        renderPhases(
            project.phases
        );


        /* UPDATES */

        renderUpdates(
            project.updates
        );

    }


    /* =====================================================
       PROJECT PHASES
    ===================================================== */

    function renderPhases(phases) {

        if (!projectPhasesContainer) {

            return;

        }


        projectPhasesContainer.innerHTML =
            "";


        if (
            !Array.isArray(phases) ||
            phases.length === 0
        ) {

            projectPhasesContainer.innerHTML = `
                <div class="project-phase">

                    <span class="project-phase-number">
                        —
                    </span>

                    <h3 class="project-phase-title">
                        Nog geen projectfases
                    </h3>

                    <p class="project-phase-description">
                        De planning van dit project wordt binnenkort toegevoegd.
                    </p>

                </div>
            `;

            return;

        }


        phases.forEach(
            (phase, index) => {

                const phaseElement =
                    document.createElement(
                        "article"
                    );


                const status =
                    normalizePhaseStatus(
                        phase.status
                    );


                phaseElement.className =
                    `project-phase ${status}`;


                const number =
                    String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    );


                phaseElement.innerHTML = `

                    <div class="project-phase-number">
                        ${escapeHTML(number)}
                    </div>


                    <h3 class="project-phase-title">
                        ${escapeHTML(
                            phase.title ||
                            "Projectfase"
                        )}
                    </h3>


                    <p class="project-phase-description">
                        ${escapeHTML(
                            phase.description ||
                            ""
                        )}
                    </p>


                    <div class="project-phase-status">
                        ${escapeHTML(
                            getPhaseStatusLabel(
                                status
                            )
                        )}
                    </div>

                `;


                projectPhasesContainer.appendChild(
                    phaseElement
                );

            }
        );

    }


    /* =====================================================
       PHASE STATUS
    ===================================================== */

    function normalizePhaseStatus(status) {

        const value =
            String(status || "")
                .trim()
                .toLowerCase();


        if (
            value === "completed" ||
            value === "done" ||
            value === "afgerond"
        ) {

            return "completed";

        }


        if (
            value === "active" ||
            value === "current" ||
            value === "bezig" ||
            value === "in-progress"
        ) {

            return "active";

        }


        return "upcoming";

    }


    function getPhaseStatusLabel(status) {

        switch (status) {

            case "completed":

                return "Afgerond";


            case "active":

                return "In uitvoering";


            default:

                return "Gepland";

        }

    }


    /* =====================================================
       PROJECT UPDATES
    ===================================================== */

    function renderUpdates(updates) {

        if (!projectUpdatesContainer) {

            return;

        }


        projectUpdatesContainer.innerHTML =
            "";


        if (
            !Array.isArray(updates) ||
            updates.length === 0
        ) {

            projectUpdatesContainer.innerHTML = `

                <div class="project-update">

                    <div class="project-update-date">
                        —
                    </div>


                    <div class="project-update-content">

                        <h3>
                            Nog geen updates
                        </h3>


                        <p>
                            Zodra er een nieuwe ontwikkeling is,
                            verschijnt deze hier.
                        </p>

                    </div>

                </div>

            `;

            return;

        }


        /*
            Nieuwste update eerst
        */

        const sortedUpdates =
            [...updates].sort(
                (a, b) => {

                    const dateA =
                        parseDateValue(
                            a.date
                        );

                    const dateB =
                        parseDateValue(
                            b.date
                        );


                    return dateB - dateA;

                }
            );


        sortedUpdates.forEach(
            update => {

                const updateElement =
                    document.createElement(
                        "article"
                    );


                updateElement.className =
                    "project-update";


                updateElement.innerHTML = `

                    <div class="project-update-date">

                        ${escapeHTML(
                            formatDate(
                                update.date
                            )
                        )}

                    </div>


                    <div class="project-update-content">

                        <h3>

                            ${escapeHTML(
                                update.title ||
                                "Projectupdate"
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                update.description ||
                                ""
                            )}

                        </p>

                    </div>

                `;


                projectUpdatesContainer.appendChild(
                    updateElement
                );

            }
        );

    }


    /* =====================================================
       PROGRESS ANIMATION
    ===================================================== */

    function animateProgress(progress) {

        const duration =
            1200;

        const startTime =
            performance.now();


        function frame(currentTime) {

            const elapsed =
                currentTime -
                startTime;


            const percentage =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
                easeOutQuart
            */

            const eased =
                1 -
                Math.pow(
                    1 - percentage,
                    4
                );


            const currentProgress =
                Math.round(
                    progress * eased
                );


            if (dashboardProgress) {

                dashboardProgress.textContent =
                    currentProgress;

            }


            if (percentage < 1) {

                requestAnimationFrame(
                    frame
                );

            }

        }


        requestAnimationFrame(
            frame
        );


        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        if (
                            dashboardProgressBar
                        ) {

                            dashboardProgressBar.style.width =
                                `${progress}%`;

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       NORMALIZE PROGRESS
    ===================================================== */

    function normalizeProgress(value) {

        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {

            return 0;

        }


        return Math.min(
            100,
            Math.max(
                0,
                Math.round(number)
            )
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutButton?.addEventListener(
        "click",
        () => {

            clearSession();


            if (dashboardSection) {

                dashboardSection.hidden =
                    true;

            }


            if (loginSection) {

                loginSection.hidden =
                    false;

            }


            if (projectNumberInput) {

                projectNumberInput.value =
                    "";

            }


            if (projectCodeInput) {

                projectCodeInput.value =
                    "";

            }


            clearError();


            dashboardSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            window.setTimeout(
                () => {

                    projectNumberInput?.focus();

                },
                400
            );

        }
    );


    /* =====================================================
       SESSION
    ===================================================== */

    function saveSession(project) {

        /*
            Alleen projectnummer opslaan.

            De toegangscode wordt bewust NIET
            in localStorage opgeslagen.
        */

        try {

            sessionStorage.setItem(
                SESSION_KEY,
                String(
                    project.projectNumber
                )
            );

        } catch (error) {

            console.warn(
                "Session kon niet worden opgeslagen.",
                error
            );

        }

    }


    function clearSession() {

        try {

            sessionStorage.removeItem(
                SESSION_KEY
            );

        } catch (error) {

            console.warn(
                "Session kon niet worden verwijderd.",
                error
            );

        }

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError(message) {

        if (!errorMessage) {

            return;

        }


        errorMessage.textContent =
            message;


        errorMessage.classList.add(
            "active"
        );


        projectNumberInput?.setAttribute(
            "aria-invalid",
            "true"
        );


        projectCodeInput?.setAttribute(
            "aria-invalid",
            "true"
        );

    }


    function clearError() {

        if (errorMessage) {

            errorMessage.classList.remove(
                "active"
            );

        }


        projectNumberInput?.removeAttribute(
            "aria-invalid"
        );


        projectCodeInput?.removeAttribute(
            "aria-invalid"
        );

    }


    projectNumberInput?.addEventListener(
        "input",
        clearError
    );


    projectCodeInput?.addEventListener(
        "input",
        clearError
    );


    /* =====================================================
       BUTTON LOADING STATE
    ===================================================== */

    function setLoadingState(active) {

        if (!loginButton) {

            return;

        }


        loginButton.classList.toggle(
            "loading",
            active
        );


        loginButton.disabled =
            active;


        const text =
            loginButton.querySelector(
                "span"
            );


        if (!text) {

            return;

        }


        text.textContent =
            active
                ? "Project laden..."
                : "Project bekijken";

    }


    /* =====================================================
       DATE FORMATTING
    ===================================================== */

    function formatDate(value) {

        if (!value) {

            return "—";

        }


        const date =
            parseDate(value);


        if (
            !date ||
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return new Intl.DateTimeFormat(
            "nl-NL",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(date);

    }


    function parseDate(value) {

        /*
            Voor JSON raad ik aan:

            YYYY-MM-DD

            bijvoorbeeld:

            2026-08-10
        */


        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(
                value
            )
        ) {

            const [
                year,
                month,
                day
            ] =
                value
                    .split("-")
                    .map(Number);


            return new Date(
                year,
                month - 1,
                day
            );

        }


        return new Date(value);

    }


    function parseDateValue(value) {

        const date =
            parseDate(value);


        if (
            !date ||
            Number.isNaN(
                date.getTime()
            )
        ) {

            return 0;

        }


        return date.getTime();

    }


    /* =====================================================
       FORMAT PAGES
    ===================================================== */

    function formatPages(value) {

        if (
            Array.isArray(value)
        ) {

            if (
                value.length === 0
            ) {

                return "—";

            }


            return `${value.length} pagina${
                value.length === 1
                    ? ""
                    : "'s"
            }`;

        }


        if (
            typeof value === "number"
        ) {

            return `${value} pagina${
                value === 1
                    ? ""
                    : "'s"
            }`;

        }


        return value || "—";

    }


    /* =====================================================
       FORMAT LANGUAGE
    ===================================================== */

    function formatLanguages(value) {

        if (
            Array.isArray(value)
        ) {

            return value.join(
                " · "
            );

        }


        return value || "—";

    }


    /* =====================================================
       SAFE TEXT
    ===================================================== */

    function setText(
        element,
        value
    ) {

        if (!element) {

            return;

        }


        element.textContent =
            value ||
            "—";

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        const string =
            String(
                value ?? ""
            );


        return string
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


});