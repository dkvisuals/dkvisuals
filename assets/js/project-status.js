/* =========================================================
   DK VISUALS — PROJECT PORTAL
   project-status.js

   Supports:
   - project-nl.html
   - project.html
   - multilingual projects.json
   - live project demo iframe
========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       LANGUAGE
    ===================================================== */

    const LANGUAGE =
        document.documentElement.lang === "nl"
            ? "nl"
            : "en";


    /* =====================================================
       TRANSLATIONS
    ===================================================== */

    const translations = {

        nl: {

            required:
                "Vul je projectnummer en toegangscode in.",

            incorrect:
                "Projectnummer of toegangscode is onjuist.",

            loadError:
                "Het project kon niet worden geladen. Probeer het later opnieuw.",

            loading:
                "Project laden...",

            loginButton:
                "Project bekijken",

            completed:
                "Afgerond",

            active:
                "In uitvoering",

            upcoming:
                "Gepland",

            noPhasesTitle:
                "Nog geen projectfases",

            noPhasesDescription:
                "De planning van dit project wordt binnenkort toegevoegd.",

            noUpdatesTitle:
                "Nog geen updates",

            noUpdatesDescription:
                "Zodra er een nieuwe ontwikkeling is, verschijnt deze hier.",

            defaultPhase:
                "Projectfase",

            defaultUpdate:
                "Projectupdate",

            page:
                "pagina",

            pages:
                "pagina's"

        },


        en: {

            required:
                "Enter your project number and access code.",

            incorrect:
                "Project number or access code is incorrect.",

            loadError:
                "The project could not be loaded. Please try again later.",

            loading:
                "Loading project...",

            loginButton:
                "View project",

            completed:
                "Completed",

            active:
                "In progress",

            upcoming:
                "Planned",

            noPhasesTitle:
                "No project phases yet",

            noPhasesDescription:
                "The planning for this project will be added soon.",

            noUpdatesTitle:
                "No updates yet",

            noUpdatesDescription:
                "New project updates will appear here.",

            defaultPhase:
                "Project phase",

            defaultUpdate:
                "Project update",

            page:
                "page",

            pages:
                "pages"

        }

    };


    const t =
        translations[LANGUAGE];


    /* =====================================================
       LOGIN ELEMENTS
    ===================================================== */

    const loginSection =
        document.getElementById(
            "project-login"
        );

    const dashboardSection =
        document.getElementById(
            "project-dashboard"
        );

    const loginForm =
        document.getElementById(
            "project-login-form"
        );

    const projectNumberInput =
        document.getElementById(
            "project-number"
        );

    const projectCodeInput =
        document.getElementById(
            "project-code"
        );

    const loginButton =
        loginForm?.querySelector(
            ".project-login-button"
        );

    const errorMessage =
        document.getElementById(
            "project-error"
        );

    const logoutButton =
        document.getElementById(
            "project-logout"
        );


    /* =====================================================
       DASHBOARD ELEMENTS
    ===================================================== */

    const dashboardProjectTitle =
        document.getElementById(
            "dashboard-project-title"
        );

    const dashboardClient =
        document.getElementById(
            "dashboard-client"
        );

    const dashboardNumber =
        document.getElementById(
            "dashboard-number"
        );

    const dashboardStartDate =
        document.getElementById(
            "dashboard-start-date"
        );

    const dashboardDeadline =
        document.getElementById(
            "dashboard-deadline"
        );

    const dashboardProgress =
        document.getElementById(
            "dashboard-progress"
        );

    const dashboardProgressBar =
        document.getElementById(
            "dashboard-progress-bar"
        );

    const dashboardStatus =
        document.getElementById(
            "dashboard-status"
        );

    const projectPhasesContainer =
        document.getElementById(
            "project-phases"
        );

    const projectUpdatesContainer =
        document.getElementById(
            "project-updates-list"
        );

    const dashboardNextStepTitle =
        document.getElementById(
            "dashboard-next-step-title"
        );

    const dashboardNextStepDescription =
        document.getElementById(
            "dashboard-next-step-description"
        );

    const dashboardType =
        document.getElementById(
            "dashboard-type"
        );

    const dashboardPages =
        document.getElementById(
            "dashboard-pages"
        );

    const dashboardLanguage =
        document.getElementById(
            "dashboard-language"
        );

    const dashboardLastUpdated =
        document.getElementById(
            "dashboard-last-updated"
        );


    /* =====================================================
       PROJECT DEMO ELEMENTS
    ===================================================== */

    const projectDemoSection =
        document.getElementById(
            "project-demo-section"
        );

    const projectDemoIframe =
        document.getElementById(
            "project-demo-iframe"
        );

    const projectDemoUrl =
        document.getElementById(
            "project-demo-url"
        );

    const projectDemoOpen =
        document.getElementById(
            "project-demo-open"
        );


    /* =====================================================
       CONFIG
    ===================================================== */

    const PROJECTS_FILE =
        "assets/data/projects.json";

    const SESSION_KEY =
        "dkvisuals_active_project";


    /* =====================================================
       LOGIN
    ===================================================== */

    loginForm?.addEventListener(
        "submit",
        async event => {

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
                    t.required
                );

                return;

            }


            setLoadingState(
                true
            );


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
                        t.incorrect
                    );

                    setLoadingState(
                        false
                    );

                    return;

                }


                saveSession(
                    project
                );


                openProject(
                    project
                );

            }

            catch (error) {

                console.error(
                    "DK VISUALS PROJECT PORTAL:",
                    error
                );


                showError(
                    t.loadError
                );


                setLoadingState(
                    false
                );

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
                `projects.json error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            Array.isArray(data)
        ) {

            return data;

        }


        if (
            data &&
            Array.isArray(
                data.projects
            )
        ) {

            return data.projects;

        }


        throw new Error(
            "Invalid projects.json structure."
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

        return projects.find(
            project => {

                if (!project) {

                    return false;

                }


                const storedNumber =
                    String(
                        project.projectNumber ||
                        ""
                    )
                        .trim()
                        .toUpperCase();


                const storedCode =
                    String(
                        project.accessCode ||
                        ""
                    )
                        .trim();


                return (
                    storedNumber ===
                        projectNumber &&

                    storedCode ===
                        accessCode
                );

            }
        );

    }


    /* =====================================================
       LOCALIZED VALUE
    ===================================================== */

    function getLocalizedValue(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        /* NORMAL STRING / NUMBER */

        if (
            typeof value !== "object"
        ) {

            return value;

        }


        /* ARRAY */

        if (
            Array.isArray(value)
        ) {

            return value;

        }


        /* CURRENT LANGUAGE */

        if (
            Object.prototype.hasOwnProperty.call(
                value,
                LANGUAGE
            )
        ) {

            return value[
                LANGUAGE
            ];

        }


        /* FALLBACK NL */

        if (
            Object.prototype.hasOwnProperty.call(
                value,
                "nl"
            )
        ) {

            return value.nl;

        }


        /* FALLBACK EN */

        if (
            Object.prototype.hasOwnProperty.call(
                value,
                "en"
            )
        ) {

            return value.en;

        }


        return "";

    }


    /* =====================================================
       OPEN PROJECT
    ===================================================== */

    function openProject(
        project
    ) {

        fillDashboard(
            project
        );


        setLoadingState(
            false
        );


        loginSection?.classList.add(
            "portal-leaving"
        );


        window.setTimeout(
            () => {

                if (
                    loginSection
                ) {

                    loginSection.hidden =
                        true;

                    loginSection.classList.remove(
                        "portal-leaving"
                    );

                }


                if (
                    dashboardSection
                ) {

                    dashboardSection.hidden =
                        false;

                    dashboardSection.classList.add(
                        "portal-entering"
                    );

                }


                /* SCROLL TO DASHBOARD */

                dashboardSection?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                window.setTimeout(
                    () => {

                        dashboardSection
                            ?.classList
                            .remove(
                                "portal-entering"
                            );

                    },
                    750
                );


                animateProgress(
                    normalizeProgress(
                        project.progress
                    )
                );

            },
            350
        );

    }


    /* =====================================================
       FILL DASHBOARD
    ===================================================== */

    function fillDashboard(
        project
    ) {


        /* =================================================
           BASIC INFORMATION
        ================================================= */

        setText(
            dashboardProjectTitle,
            getLocalizedValue(
                project.title
            )
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
            getLocalizedValue(
                project.status
            )
        );


        setText(
            dashboardType,
            getLocalizedValue(
                project.type
            )
        );


        setText(
            dashboardPages,
            formatPages(
                getLocalizedValue(
                    project.pages
                )
            )
        );


        setText(
            dashboardLanguage,
            formatLanguages(
                getLocalizedValue(
                    project.language
                )
            )
        );


        setText(
            dashboardLastUpdated,
            formatDate(
                project.lastUpdated
            )
        );


        /* =================================================
           NEXT STEP
        ================================================= */

        const nextStep =
            project.nextStep ||
            {};


        setText(
            dashboardNextStepTitle,
            getLocalizedValue(
                nextStep.title
            )
        );


        setText(
            dashboardNextStepDescription,
            getLocalizedValue(
                nextStep.description
            )
        );


        /* =================================================
           RESET PROGRESS
        ================================================= */

        if (
            dashboardProgress
        ) {

            dashboardProgress.textContent =
                "0";

        }


        if (
            dashboardProgressBar
        ) {

            dashboardProgressBar.style.width =
                "0%";

        }


        /* =================================================
           PHASES
        ================================================= */

        renderPhases(
            project.phases
        );


        /* =================================================
           UPDATES
        ================================================= */

        renderUpdates(
            project.updates
        );


        /* =================================================
           LIVE DEMO
        ================================================= */

        renderDemo(
            project.demo
        );

    }


    /* =====================================================
       PROJECT PHASES
    ===================================================== */

    function renderPhases(
        phases
    ) {

        if (
            !projectPhasesContainer
        ) {

            return;

        }


        projectPhasesContainer.innerHTML =
            "";


        if (
            !Array.isArray(phases) ||
            phases.length === 0
        ) {

            projectPhasesContainer.innerHTML = `

                <article class="project-phase">

                    <div class="project-phase-number">
                        —
                    </div>


                    <h3 class="project-phase-title">

                        ${escapeHTML(
                            t.noPhasesTitle
                        )}

                    </h3>


                    <p class="project-phase-description">

                        ${escapeHTML(
                            t.noPhasesDescription
                        )}

                    </p>

                </article>

            `;


            return;

        }


        phases.forEach(
            (
                phase,
                index
            ) => {

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
                    )
                        .padStart(
                            2,
                            "0"
                        );


                const title =
                    getLocalizedValue(
                        phase.title
                    ) ||
                    t.defaultPhase;


                const description =
                    getLocalizedValue(
                        phase.description
                    );


                phaseElement.innerHTML = `

                    <div class="project-phase-number">

                        ${escapeHTML(
                            number
                        )}

                    </div>


                    <h3 class="project-phase-title">

                        ${escapeHTML(
                            title
                        )}

                    </h3>


                    <p class="project-phase-description">

                        ${escapeHTML(
                            description
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


                projectPhasesContainer
                    .appendChild(
                        phaseElement
                    );

            }
        );

    }


    /* =====================================================
       PHASE STATUS
    ===================================================== */

    function normalizePhaseStatus(
        status
    ) {

        const value =
            String(
                status ||
                ""
            )
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


    function getPhaseStatusLabel(
        status
    ) {

        if (
            status === "completed"
        ) {

            return t.completed;

        }


        if (
            status === "active"
        ) {

            return t.active;

        }


        return t.upcoming;

    }


    /* =====================================================
       PROJECT UPDATES
    ===================================================== */

    function renderUpdates(
        updates
    ) {

        if (
            !projectUpdatesContainer
        ) {

            return;

        }


        projectUpdatesContainer.innerHTML =
            "";


        if (
            !Array.isArray(updates) ||
            updates.length === 0
        ) {

            projectUpdatesContainer.innerHTML = `

                <article class="project-update">

                    <div class="project-update-date">
                        —
                    </div>


                    <div class="project-update-content">

                        <h3>

                            ${escapeHTML(
                                t.noUpdatesTitle
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                t.noUpdatesDescription
                            )}

                        </p>

                    </div>

                </article>

            `;


            return;

        }


        /* NEWEST FIRST */

        const sortedUpdates =
            [...updates]
                .sort(
                    (
                        a,
                        b
                    ) => {

                        return (
                            parseDateValue(
                                b.date
                            ) -
                            parseDateValue(
                                a.date
                            )
                        );

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


                const title =
                    getLocalizedValue(
                        update.title
                    ) ||
                    t.defaultUpdate;


                const description =
                    getLocalizedValue(
                        update.description
                    );


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
                                title
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                description
                            )}

                        </p>

                    </div>

                `;


                projectUpdatesContainer
                    .appendChild(
                        updateElement
                    );

            }
        );

    }


    /* =====================================================
       PROJECT LIVE DEMO
    ===================================================== */

    function renderDemo(
        demo
    ) {

        if (
            !projectDemoSection ||
            !projectDemoIframe ||
            !projectDemoUrl ||
            !projectDemoOpen
        ) {

            return;

        }


        /* =================================================
           NO DEMO AVAILABLE
        ================================================= */

        if (
            !demo ||
            demo.enabled !== true ||
            !demo.url
        ) {

            projectDemoSection.hidden =
                true;


            projectDemoIframe.src =
                "";


            projectDemoOpen.href =
                "#";


            projectDemoUrl.textContent =
                "—";


            return;

        }


        /* =================================================
           DEMO AVAILABLE
        ================================================= */

        const demoUrl =
            String(
                demo.url
            ).trim();


        projectDemoSection.hidden =
            false;


        projectDemoIframe.src =
            demoUrl;


        projectDemoOpen.href =
            demoUrl;


        projectDemoUrl.textContent =
            formatDemoUrl(
                demoUrl
            );

    }


    /* =====================================================
       FORMAT DEMO URL
    ===================================================== */

    function formatDemoUrl(
        url
    ) {

        try {

            const parsedUrl =
                new URL(
                    url
                );


            const pathname =
                parsedUrl.pathname === "/"
                    ? ""
                    : parsedUrl.pathname;


            return (
                parsedUrl.hostname +
                pathname
            );

        }

        catch {

            return url;

        }

    }


    /* =====================================================
       PROGRESS ANIMATION
    ===================================================== */

    function animateProgress(
        progress
    ) {

        const duration =
            1200;


        const startTime =
            performance.now();


        function frame(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const percentage =
                Math.min(
                    elapsed /
                    duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - percentage,
                    4
                );


            const currentProgress =
                Math.round(
                    progress *
                    eased
                );


            if (
                dashboardProgress
            ) {

                dashboardProgress.textContent =
                    currentProgress;

            }


            if (
                percentage < 1
            ) {

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

                            dashboardProgressBar
                                .style
                                .width =
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

    function normalizeProgress(
        value
    ) {

        const number =
            Number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
        ) {

            return 0;

        }


        return Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    number
                )
            )
        );

    }


    /* =====================================================
       LOGOUT / ANOTHER PROJECT
    ===================================================== */

    logoutButton?.addEventListener(
        "click",
        () => {

            clearSession();


            if (
                dashboardSection
            ) {

                dashboardSection.hidden =
                    true;

            }


            if (
                loginSection
            ) {

                loginSection.hidden =
                    false;

            }


            /* CLEAR DEMO */

            if (
                projectDemoIframe
            ) {

                projectDemoIframe.src =
                    "";

            }


            if (
                projectNumberInput
            ) {

                projectNumberInput.value =
                    "";

            }


            if (
                projectCodeInput
            ) {

                projectCodeInput.value =
                    "";

            }


            clearError();


            loginSection?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            window.setTimeout(
                () => {

                    projectNumberInput
                        ?.focus();

                },
                400
            );

        }
    );


    /* =====================================================
       SESSION
    ===================================================== */

    function saveSession(
        project
    ) {

        try {

            sessionStorage.setItem(
                SESSION_KEY,
                String(
                    project.projectNumber
                )
            );

        }

        catch (error) {

            console.warn(
                "Could not save project session.",
                error
            );

        }

    }


    function clearSession() {

        try {

            sessionStorage.removeItem(
                SESSION_KEY
            );

        }

        catch (error) {

            console.warn(
                "Could not remove project session.",
                error
            );

        }

    }


    /* =====================================================
       ERROR MESSAGE
    ===================================================== */

    function showError(
        message
    ) {

        if (
            !errorMessage
        ) {

            return;

        }


        errorMessage.textContent =
            message;


        errorMessage.classList.add(
            "active"
        );


        projectNumberInput
            ?.setAttribute(
                "aria-invalid",
                "true"
            );


        projectCodeInput
            ?.setAttribute(
                "aria-invalid",
                "true"
            );

    }


    function clearError() {

        errorMessage
            ?.classList
            .remove(
                "active"
            );


        projectNumberInput
            ?.removeAttribute(
                "aria-invalid"
            );


        projectCodeInput
            ?.removeAttribute(
                "aria-invalid"
            );

    }


    projectNumberInput
        ?.addEventListener(
            "input",
            clearError
        );


    projectCodeInput
        ?.addEventListener(
            "input",
            clearError
        );


    /* =====================================================
       LOADING STATE
    ===================================================== */

    function setLoadingState(
        active
    ) {

        if (
            !loginButton
        ) {

            return;

        }


        loginButton
            .classList
            .toggle(
                "loading",
                active
            );


        loginButton.disabled =
            active;


        const buttonText =
            loginButton
                .querySelector(
                    "span"
                );


        if (
            !buttonText
        ) {

            return;

        }


        buttonText.textContent =
            active
                ? t.loading
                : t.loginButton;

    }


    /* =====================================================
       DATE FORMATTING
    ===================================================== */

    function formatDate(
        value
    ) {

        if (
            !value
        ) {

            return "—";

        }


        const date =
            parseDate(
                value
            );


        if (
            !date ||
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(
                value
            );

        }


        return new Intl.DateTimeFormat(
            LANGUAGE === "nl"
                ? "nl-NL"
                : "en-GB",
            {
                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"
            }
        ).format(
            date
        );

    }


    function parseDate(
        value
    ) {

        if (
            typeof value ===
                "string" &&

            /^\d{4}-\d{2}-\d{2}$/
                .test(
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
                    .map(
                        Number
                    );


            return new Date(
                year,
                month - 1,
                day
            );

        }


        return new Date(
            value
        );

    }


    function parseDateValue(
        value
    ) {

        const date =
            parseDate(
                value
            );


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

    function formatPages(
        value
    ) {

        if (
            Array.isArray(
                value
            )
        ) {

            const count =
                value.length;


            if (
                count === 0
            ) {

                return "—";

            }


            return (
                count === 1
                    ? `1 ${t.page}`
                    : `${count} ${t.pages}`
            );

        }


        if (
            typeof value ===
                "number"
        ) {

            return (
                value === 1
                    ? `1 ${t.page}`
                    : `${value} ${t.pages}`
            );

        }


        return (
            value ||
            "—"
        );

    }


    /* =====================================================
       FORMAT LANGUAGES
    ===================================================== */

    function formatLanguages(
        value
    ) {

        if (
            Array.isArray(
                value
            )
        ) {

            return value.join(
                " · "
            );

        }


        return (
            value ||
            "—"
        );

    }


    /* =====================================================
       SET TEXT
    ===================================================== */

    function setText(
        element,
        value
    ) {

        if (
            !element
        ) {

            return;

        }


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            element.textContent =
                "—";

            return;

        }


        element.textContent =
            String(
                value
            );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ??
            ""
        )
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