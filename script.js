/* =========================================================================
   Kieron's Site — script.js
   Vanilla JS, no build step, no dependencies.
   ========================================================================= */
import { Application } from 'https://unpkg.com/@splinetool/runtime@latest/build/runtime.js';

const canvas = document.getElementById('canvas3d');

if (canvas) {
    const app = new Application(canvas, { htmlContentMode: 'inline' });
    
    app.load('flipper.splinecode')
        .then(() => {
            console.log("Clean Flipper 3D model loaded successfully!");
        })
        .catch(error => {
            console.error("Error loading local scene:", error);
        });

    // Shadow DOM Watermark Eraser
    const nukeSplineBadge = () => {
        // Target canvas parent and any web components
        const heroVisual = document.getElementById('heroVisual');
        if (!heroVisual) return;

        // Search both light DOM and any attached Shadow DOM roots
        const allElements = [heroVisual, ...heroVisual.querySelectorAll('*')];
        
        allElements.forEach(el => {
            // Check if element has a shadow root attached
            const root = el.shadowRoot || el;
            
            // Find any link/pill containing Spline watermark refs or logos
            const badge = root.querySelector('a[href*="spline"], .spline-watermark, #logo, #badge');
            if (badge) {
                badge.remove();
            }

            // Fallback for container divs holding watermark text
            root.querySelectorAll('div, a').forEach(node => {
                if (node.textContent && node.textContent.includes('Built with Spline')) {
                    node.style.display = 'none';
                    node.style.opacity = '0';
                    node.remove();
                }
            });
        });
    };

    // Run clean up repeatedly to capture deferred mounting
    const badgeInterval = setInterval(nukeSplineBadge, 50);
    setTimeout(() => clearInterval(badgeInterval), 5000); // Stop polling after 5s
}

// Bulletproof Runtime Badge Remover
const obliterateSplineBadge = () => {
    document.querySelectorAll('a, div, span').forEach(el => {
        if (
            (el.href && el.href.includes('spline.design')) ||
            (el.textContent && el.textContent.includes('Built with Spline'))
        ) {
            // Target the outer pill container and strip it from the DOM
            let target = el;
            for (let i = 0; i < 4; i++) {
                if (target && target.parentElement && target.parentElement !== document.body && target.parentElement !== document.documentElement) {
                    target = target.parentElement;
                }
            }
            if (target) target.remove();
            el.remove();
        }
    });
};

// Run instantly and check every 20ms to catch runtime injection
setInterval(obliterateSplineBadge, 20);

(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- 1. Mobile navigation toggle -------------------------------- */
    var navToggle = document.getElementById("navToggle");
    var primaryNav = document.getElementById("primaryNav");

    function closeNav() {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    }
    function openNav() {
        primaryNav.classList.add("is-open");
        navToggle.setAttribute("aria-expanded", "true");
    }
    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", function () {
            var isOpen = primaryNav.classList.contains("is-open");
            if (isOpen) { closeNav(); } else { openNav(); }
        });
        primaryNav.querySelectorAll(".nav-link").forEach(function (link) {
            link.addEventListener("click", closeNav);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { closeNav(); }
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 900) { closeNav(); }
        });
    }

    /* ---------- 2. Dark / light theme toggle ------------------------------- */
    var THEME_KEY = "kieron-portfolio-theme";
    var themeToggle = document.getElementById("themeToggle");
    var memoryTheme = null;

    function getStoredTheme() {
        try { return window.localStorage.getItem(THEME_KEY); }
        catch (e) { return memoryTheme; }
    }
    function storeTheme(value) {
        memoryTheme = value;
        try { window.localStorage.setItem(THEME_KEY, value); }
        catch (e) {}
    }
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(theme === "light"));
            themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
        }
    }

    var systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var currentTheme = getStoredTheme() || (systemPrefersLight ? "light" : "dark");
    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            currentTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(currentTheme);
            storeTheme(currentTheme);
        });
    }

    /* ---------- 3. Accessible tabs ------------------------------------------ */
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll(".tab-links"));
    var tabPanels = Array.prototype.slice.call(document.querySelectorAll(".tab-contents"));

    function activateTab(button) {
        tabButtons.forEach(function (btn) {
            var isActive = btn === button;
            btn.classList.toggle("active-link", isActive);
            btn.setAttribute("aria-selected", String(isActive));
            btn.tabIndex = isActive ? 0 : -1;
        });
        tabPanels.forEach(function (panel) {
            var isActive = panel.id === button.getAttribute("data-tab");
            panel.classList.toggle("active-tab", isActive);
            panel.hidden = !isActive;
        });
    }

    tabButtons.forEach(function (btn, index) {
        btn.addEventListener("click", function () { activateTab(btn); });
        btn.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                var dir = e.key === "ArrowRight" ? 1 : -1;
                var nextIndex = (index + dir + tabButtons.length) % tabButtons.length;
                tabButtons[nextIndex].focus();
                activateTab(tabButtons[nextIndex]);
            }
        });
    });

    /* ---------- 4. Active nav-link highlighting on scroll ------------------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var trackedSections = Array.prototype.slice.call(document.querySelectorAll("main section[id], header#home"));

    if ("IntersectionObserver" in window && trackedSections.length) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id;
                    navLinks.forEach(function (link) {
                        link.classList.toggle("active-nav-link", link.getAttribute("href") === "#" + id);
                    });
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        trackedSections.forEach(function (section) { navObserver.observe(section); });
    }

    /* ---------- 5. Scroll-reveal animation ---------------------------------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("in-view"); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- 6. Scroll-to-top button -------------------------------------- */
    var scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", function () {
            scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
    }

    /* ---------- 7. Project filtering ------------------------------------------ */
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
    var filterEmptyMsg = document.getElementById("filterEmpty");

    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterButtons.forEach(function (b) {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");

            var filter = btn.getAttribute("data-filter");
            var visibleCount = 0;
            projectCards.forEach(function (card) {
                var show = filter === "all" || card.getAttribute("data-category") === filter;
                card.style.display = show ? "" : "none";
                if (show) { visibleCount += 1; }
            });
            if (filterEmptyMsg) { filterEmptyMsg.hidden = visibleCount !== 0; }
        });
    });

    /* ---------- 8. Contact form: validation + submit (Web3Forms Workaround) --- */
    var form = document.getElementById("contactForm");
    var formStatus = document.getElementById("formStatus");

    var validators = {
        name: function (value) { return value.trim().length >= 2 || "Please enter your name (2+ characters)."; },
        email: function (value) {
            var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(value.trim()) || "Please enter a valid email address.";
        },
        message: function (value) { return value.trim().length >= 10 || "Message should be at least 10 characters."; }
    };

    function validateField(field) {
        var rule = validators[field.name];
        if (!rule) { return true; }
        var result = rule(field.value);
        var errorEl = document.getElementById(field.name + "Error");
        if (result === true) {
            field.removeAttribute("aria-invalid");
            if (errorEl) { errorEl.textContent = ""; }
            return true;
        }
        field.setAttribute("aria-invalid", "true");
        if (errorEl) { errorEl.textContent = result; }
        return false;
    }

    if (form) {
        var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));

        fields.forEach(function (field) {
            field.addEventListener("blur", function () { validateField(field); });
            field.addEventListener("input", function () {
                if (field.getAttribute("aria-invalid") === "true") { validateField(field); }
            });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var allValid = fields.map(validateField).every(Boolean);
            if (!allValid) {
                if (formStatus) {
                    formStatus.textContent = "Please fix the highlighted fields.";
                    formStatus.className = "form-status form-status-error";
                }
                return;
            }

            if (formStatus) {
                formStatus.textContent = "Sending message...";
                formStatus.className = "form-status";
            }

            var formData = new FormData(form);
            
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    if (formStatus) {
                        formStatus.textContent = "Message sent successfully! Thanks for reaching out.";
                        formStatus.className = "form-status form-status-success";
                    }
                    form.reset();
                } else {
                    if (formStatus) {
                        formStatus.textContent = data.message || "Something went wrong. Please try again.";
                        formStatus.className = "form-status form-status-error";
                    }
                }
            })
            .catch(function () {
                if (formStatus) {
                    formStatus.textContent = "Network error. Please email me directly at kieronlim06@gmail.com";
                    formStatus.className = "form-status form-status-error";
                }
            });
        });
    }

    /* ---------- 9. Footer year -------------------------------------------------- */
    var yearEl = document.getElementById("year");
    if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

    /* ---------- 12. Custom Cursor, Click Splash & Typing Effect ---------- */
    function initDynamicAnimations() {
        // Respect user motion preferences
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

        // 1. Custom Smooth Cursor & Click Splash
        var dot = document.createElement("div");
        dot.className = "custom-cursor-dot";
        var ring = document.createElement("div");
        ring.className = "custom-cursor-ring";
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mouseX = 0, mouseY = 0;
        var ringX = 0, ringY = 0;

        window.addEventListener("mousemove", function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px) translate(-50%, -50%)";
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform = "translate(" + ringX + "px, " + ringY + "px) translate(-50%, -50%)";
            requestAnimationFrame(animateRing);
        }
        requestAnimationFrame(animateRing);

        // Click splash ripple effect
        window.addEventListener("mousedown", function (e) {
            var splash = document.createElement("div");
            splash.className = "cursor-splash";
            splash.style.left = e.clientX + "px";
            splash.style.top = e.clientY + "px";
            document.body.appendChild(splash);
            setTimeout(function () {
                splash.remove();
            }, 600);

            ring.style.width = "26px";
            ring.style.height = "26px";
            setTimeout(function () {
                ring.style.width = "36px";
                ring.style.height = "36px";
            }, 180);
        });

        document.querySelectorAll("a, button, input, textarea").forEach(function (el) {
            el.addEventListener("mouseenter", function () {
                ring.style.width = "52px";
                ring.style.height = "52px";
                ring.style.borderColor = "var(--color-accent-warm)";
            });
            el.addEventListener("mouseleave", function () {
                ring.style.width = "36px";
                ring.style.height = "36px";
                ring.style.borderColor = "var(--color-accent)";
            });
        });

        // 2. Typing Animation for "KIERON LIM" (Using isolated variable name)
        var highlightSpan = document.querySelector(".banner h1 .highlight-name");
        if (highlightSpan) {
            var textToType = highlightSpan.textContent;
            highlightSpan.textContent = "";
            var cursor = document.createElement("span");
            cursor.className = "typing-cursor";
            highlightSpan.parentNode.insertBefore(cursor, highlightSpan.nextSibling);

            var charIndexName = 0;
            function typeWriter() {
                if (charIndexName < textToType.length) {
                    highlightSpan.textContent += textToType.charAt(charIndexName);
                    charIndexName++;
                    setTimeout(typeWriter, 100);
                }
            }
            setTimeout(typeWriter, 400);
        }

        // 3. Accented Blinking Cursors on Section Headers
        document.querySelectorAll(".sub-title").forEach(function (heading) {
            if (!heading.querySelector(".typing-cursor")) {
                var sectionCursor = document.createElement("span");
                sectionCursor.className = "typing-cursor";
                heading.appendChild(sectionCursor);
            }
        });

        // 4. Terminal Handshake Animation & Clean Dissolve
        var terminalEl = document.getElementById("terminalPrompt");
        if (terminalEl) {
            var handshakeText = terminalEl.textContent;
            var finalTagText = "Cybersecurity & Digital Forensics";
            terminalEl.textContent = "";
            
            var charIndexTerminal = 0;
            function typeTerminal() {
                if (charIndexTerminal < handshakeText.length) {
                    terminalEl.textContent += handshakeText.charAt(charIndexTerminal);
                    charIndexTerminal++;
                    setTimeout(typeTerminal, 35);
                } else {
                    // Pause for 800ms after typing, then smoothly dissolve and switch to clean subtitle
                    setTimeout(function() {
                        terminalEl.style.transition = "opacity 0.4s ease";
                        terminalEl.style.opacity = "0";
                        setTimeout(function() {
                            terminalEl.textContent = finalTagText;
                            terminalEl.style.opacity = "1";
                        }, 400);
                    }, 800);
                }
            }
            setTimeout(typeTerminal, 300);
        }
    }

    initDynamicAnimations();

    /* ---------- 13. Magnetic Buttons & Card Spotlight ---------- */
    function initAdvancedInteractions() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

        // Magnetic Pull Effect on Buttons
        document.querySelectorAll(".btn, .nav-link").forEach(function (btn) {
            btn.addEventListener("mousemove", function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = "translate(" + (x * 0.25) + "px, " + (y * 0.25) + "px)";
            });

            btn.addEventListener("mouseleave", function () {
                btn.style.transform = "translate(0px, 0px)";
            });
        });

        // Mouse Spotlight Coordinates for Cards
        document.querySelectorAll(".project-card, .exp-card").forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", x + "px");
                card.style.setProperty("--mouse-y", y + "px");
            });
        });
    }

    initAdvancedInteractions();

/* =========================================================================
   Extras: stats count-up, copy-email button, contact popup.
   ========================================================================= */
(function () {
    "use strict";

    /* ---------- Stats count-up ------------------------------------------- */
    function initStatCounters() {
        var RESPECT_REDUCED_MOTION = true;   // set to false to always count up (handy for testing)

        var group = document.querySelector(".stats");
        var counters = Array.prototype.slice.call(document.querySelectorAll(".stat-number"));
        if (!group || !counters.length) { return; }

        var reduceMotion = RESPECT_REDUCED_MOTION &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion || !("IntersectionObserver" in window)) { return; }   // keeps the final numbers written in the HTML

        function show(el, value) {
            var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
            el.textContent = value.toFixed(decimals);
        }

        function run(el) {
            var target = parseFloat(el.getAttribute("data-target"));
            if (isNaN(target)) { return; }
            var duration = 1600;
            var startTime = null;

            function frame(now) {
                if (startTime === null) { startTime = now; }
                var progress = Math.min((now - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);   // fast start, gentle finish
                show(el, target * eased);
                if (progress < 1) { window.requestAnimationFrame(frame); }
            }
            window.requestAnimationFrame(frame);
        }

        counters.forEach(function (el) { show(el, 0); });

        var observer = new IntersectionObserver(function (entries, obs) {
            if (entries[0].isIntersecting) {
                counters.forEach(run);
                obs.disconnect();
            }
        }, { threshold: 0.35 });

        observer.observe(group);
    }

    /* ---------- Copy-email button ---------------------------------------- */
    function initCopyEmail() {
        var btn = document.getElementById("copyEmailBtn");
        var status = document.getElementById("copyStatus");
        if (!btn) { return; }

        function say(message) {
            if (!status) { return; }
            status.textContent = message;
            window.setTimeout(function () { status.textContent = ""; }, 3000);
        }

        btn.addEventListener("click", function () {
            var email = btn.getAttribute("data-email");
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(function () { say("Email copied to clipboard."); })
                    .catch(function () { say("Couldn't copy automatically. My email is " + email); });
            } else {
                say("Couldn't copy automatically. My email is " + email);
            }
        });
    }

    /* ---------- Contact popup -------------------------------------------- */
    function initContactModal() {
        var modal = document.getElementById("contactModal");
        var openBtn = document.getElementById("openContactBtn");
        var closeBtn = document.getElementById("closeContactBtn");
        var form = document.getElementById("contactForm");
        var formStatus = document.getElementById("formStatus");
        if (!modal || !openBtn || typeof modal.showModal !== "function") { return; }

        function clearValidation() {
            if (!form) { return; }
            form.querySelectorAll("[aria-invalid]").forEach(function (f) { f.removeAttribute("aria-invalid"); });
            form.querySelectorAll(".field-error").forEach(function (p) { p.textContent = ""; });
            if (formStatus) { formStatus.textContent = ""; formStatus.className = "form-status"; }
        }

        function openModal() {
            document.documentElement.classList.add("modal-open");
            modal.showModal();
        }

        function closeModal() {
            if (!modal.open || modal.classList.contains("is-closing")) { return; }
            var panel = modal.querySelector(".modal-panel");
            var finished = false;

            function finish() {
                if (finished) { return; }
                finished = true;
                modal.classList.remove("is-closing");
                modal.close();
                document.documentElement.classList.remove("modal-open");
                clearValidation();
            }

            modal.classList.add("is-closing");
            panel.addEventListener("animationend", finish, { once: true });
            window.setTimeout(finish, 350);   // safety net if animationend never fires
        }

        openBtn.addEventListener("click", openModal);
        if (closeBtn) { closeBtn.addEventListener("click", closeModal); }

        // Esc key: play the exit animation instead of snapping shut
        modal.addEventListener("cancel", function (e) {
            e.preventDefault();
            closeModal();
        });

        // Click on the dimmed backdrop closes it (ignores drags that start inside the panel)
        var pressedOnBackdrop = false;
        modal.addEventListener("pointerdown", function (e) { pressedOnBackdrop = (e.target === modal); });
        modal.addEventListener("click", function (e) {
            if (pressedOnBackdrop && e.target === modal) { closeModal(); }
        });

        // After a valid submit, the form handler earlier in this file sets the success class; close shortly after
        if (form) {
            form.addEventListener("submit", function () {
                if (formStatus && formStatus.classList.contains("form-status-success")) {
                    window.setTimeout(closeModal, 1800);
                }
            });
        }
    }

    initStatCounters();
    initCopyEmail();
    initContactModal();
})();

})();