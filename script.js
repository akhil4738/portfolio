/* =========================================================
   AKHIL.IN — PREMIUM MAIN JAVASCRIPT
   ---------------------------------------------------------
   Vanilla JavaScript + Three.js
   GitHub Pages compatible
   ========================================================= */

"use strict";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initRevealAnimations();
    initCursor();
    initSkillFilters();
    initProjectFilters();
    initNavigation();
    initMobileMenu();
    initMagneticElements();
    initContactForm();
    initHeroVideo();
    initThreeBackground();
    initNavbarScroll();
    initImageFallback();
    initYear();

});


/* =========================================================
   REDUCED MOTION
========================================================= */

const prefersReducedMotion = () =>
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initRevealAnimations() {

    const elements = $$(".reveal");

    if (!elements.length) return;


    /*
     * Respect accessibility preferences.
     */

    if (prefersReducedMotion()) {

        elements.forEach(element => {

            element.classList.add("visible");

        });

        return;

    }


    /*
     * Fallback for older browsers.
     */

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add("visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


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
                    "0px 0px -50px 0px"
            }

        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   CUSTOM CURSOR
========================================================= */

function initCursor() {

    const cursor = $("#cursor");
    const ring = $("#ring");


    /*
     * No custom cursor on touch devices.
     */

    if (
        !cursor ||
        !ring ||
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        return;

    }


    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;


    let animationFrame;


    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

        },
        {
            passive: true
        }
    );


    function animateCursor() {

        ringX +=
            (mouseX - ringX) *
            0.15;

        ringY +=
            (mouseY - ringY) *
            0.15;


        cursor.style.left =
            `${mouseX}px`;

        cursor.style.top =
            `${mouseY}px`;


        ring.style.left =
            `${ringX}px`;

        ring.style.top =
            `${ringY}px`;


        animationFrame =
            requestAnimationFrame(
                animateCursor
            );

    }


    animateCursor();


    /*
     * Interactive cursor state.
     */

    const interactiveElements =
        $$(
            "a, button, input, textarea, select, .glass, .project"
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


    /*
     * Cleanup.
     */

    window.addEventListener(
        "beforeunload",
        () => {

            cancelAnimationFrame(
                animationFrame
            );

        }
    );

}


/* =========================================================
   HERO VIDEO
========================================================= */

function initHeroVideo() {

    const video =
        $(".hero-video");


    if (!video) return;


    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;


    /*
     * Attempt autoplay.
     */

    const playVideo = () => {

        video.muted = true;


        const promise =
            video.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(() => {

                /*
                 * Browser may block autoplay.
                 * We retry after interaction.
                 */

            });

        }

    };


    playVideo();


    /*
     * Retry once after user interaction.
     */

    const resumeVideo = () => {

        if (video.paused) {

            playVideo();

        }

    };


    document.addEventListener(
        "click",
        resumeVideo,
        {
            once: true,
            passive: true
        }
    );


    document.addEventListener(
        "touchstart",
        resumeVideo,
        {
            once: true,
            passive: true
        }
    );


    video.addEventListener(
        "error",
        () => {

            console.warn(
                "Hero video could not be loaded. Check assets/hero.mp4"
            );

        }
    );

}


/* =========================================================
   SKILL FILTER
========================================================= */

function initSkillFilters() {

    const buttons =
        $$(".skill-filter button");

    const skills =
        $$(".skill");


    if (
        !buttons.length ||
        !skills.length
    ) {

        return;

    }


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;


                /*
                 * Update active button.
                 */

                buttons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                    item.setAttribute(
                        "aria-selected",
                        "false"
                    );

                });


                button.classList.add(
                    "active"
                );


                button.setAttribute(
                    "aria-selected",
                    "true"
                );


                /*
                 * Filter skills.
                 */

                skills.forEach(skill => {

                    const category =
                        skill.dataset.cat;


                    const shouldShow =
                        filter === "all" ||
                        category === filter;


                    if (shouldShow) {

                        skill.style.display =
                            "";


                        requestAnimationFrame(
                            () => {

                                skill.classList.add(
                                    "visible"
                                );

                            }
                        );

                    } else {

                        skill.classList.remove(
                            "visible"
                        );


                        skill.style.display =
                            "none";

                    }

                });

            }
        );

    });

}


/* =========================================================
   PROJECT FILTER
========================================================= */

function initProjectFilters() {

    const buttons =
        $$(".project-filter button");

    const projects =
        $$(".project");


    if (
        !buttons.length ||
        !projects.length
    ) {

        return;

    }


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.projectFilter;


                /*
                 * Active filter.
                 */

                buttons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                    item.setAttribute(
                        "aria-selected",
                        "false"
                    );

                });


                button.classList.add(
                    "active"
                );


                button.setAttribute(
                    "aria-selected",
                    "true"
                );


                /*
                 * Filter projects.
                 */

                projects.forEach(project => {

                    const category =
                        project.dataset.projectCategory;


                    /*
                     * Projects without an explicit
                     * category remain visible under ALL.
                     */

                    const shouldShow =
                        filter === "all" ||
                        category === filter;


                    if (shouldShow) {

                        project.style.display =
                            "";


                        project.classList.remove(
                            "project-hidden"
                        );


                        requestAnimationFrame(
                            () => {

                                project.classList.add(
                                    "visible"
                                );

                            }
                        );

                    } else {

                        project.classList.add(
                            "project-hidden"
                        );


                        project.style.display =
                            "none";

                    }

                });

            }
        );

    });

}


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation() {

    const links =
        $$("a[href^='#']");


    if (!links.length) return;


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetID =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    return;

                }


                const target =
                    $(targetID);


                if (!target) return;


                /*
                 * Let browser handle external/
                 * special links normally.
                 */

                event.preventDefault();


                const nav =
                    $(".nav");


                const navHeight =
                    nav
                        ? nav.offsetHeight
                        : 0;


                const position =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navHeight;


                window.scrollTo({

                    top:
                        Math.max(
                            position,
                            0
                        ),

                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth"

                });


                /*
                 * Close mobile menu if open.
                 */

                closeMobileMenu();

            }
        );

    });

}


/* =========================================================
   MOBILE MENU
========================================================= */

let mobileMenuOpen = false;


function initMobileMenu() {

    const toggle =
        $(".menu-toggle");

    const menu =
        $("#mobileMenu");

    const close =
        $(".menu-close");


    if (!toggle || !menu) {

        return;

    }


    toggle.addEventListener(
        "click",
        () => {

            if (mobileMenuOpen) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );


    if (close) {

        close.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    /*
     * Close when clicking a menu link.
     */

    $(
        "a",
        menu
    ).forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    /*
     * Escape closes menu.
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                mobileMenuOpen
            ) {

                closeMobileMenu();

            }

        }
    );


    /*
     * Resize safety.
     */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900 &&
                mobileMenuOpen
            ) {

                closeMobileMenu();

            }

        },
        {
            passive: true
        }
    );

}


function openMobileMenu() {

    const toggle =
        $(".menu-toggle");

    const menu =
        $("#mobileMenu");


    if (!toggle || !menu) return;


    mobileMenuOpen = true;


    document.body.classList.add(
        "menu-open"
    );


    menu.classList.add(
        "open"
    );


    toggle.classList.add(
        "active"
    );


    toggle.setAttribute(
        "aria-expanded",
        "true"
    );


    menu.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMobileMenu() {

    const toggle =
        $(".menu-toggle");

    const menu =
        $("#mobileMenu");


    if (!toggle || !menu) return;


    mobileMenuOpen = false;


    document.body.classList.remove(
        "menu-open"
    );


    menu.classList.remove(
        "open"
    );


    toggle.classList.remove(
        "active"
    );


    toggle.setAttribute(
        "aria-expanded",
        "false"
    );


    menu.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   MAGNETIC ELEMENTS
========================================================= */

function initMagneticElements() {

    if (
        prefersReducedMotion() ||
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        return;

    }


    const elements =
        $$(".magnetic");


    if (!elements.length) return;


    elements.forEach(element => {

        element.addEventListener(
            "mousemove",
            event => {

                const rect =
                    element.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;


                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                const strength =
                    0.12;


                element.style.transform =
                    `translate(
                        ${x * strength}px,
                        ${y * strength}px
                    )`;

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                element.style.transform =
                    "";

            }
        );

    });

}


/* =========================================================
   CONTACT FORM
========================================================= */

function initContactForm() {

    const form =
        $("#contactForm");

    const status =
        $("#formStatus");


    if (!form) return;


    const button =
        form.querySelector(
            "button[type='submit']"
        );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /*
             * Native validation.
             */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            /*
             * GitHub Pages is static.
             *
             * This interface currently provides
             * visual confirmation only.
             */

            if (status) {

                status.hidden = false;

                status.textContent =
                    "TRANSMISSION REGISTERED ✓";

            }


            if (button) {

                const originalText =
                    button.innerHTML;


                button.innerHTML =
                    "MESSAGE REGISTERED ✓";


                button.disabled = true;


                setTimeout(
                    () => {

                        button.innerHTML =
                            originalText;

                        button.disabled =
                            false;

                    },
                    4000
                );

            }


            /*
             * Reset after confirmation.
             */

            setTimeout(
                () => {

                    form.reset();

                },
                1500
            );

        }
    );

}


/* =========================================================
   THREE.JS BACKGROUND
========================================================= */

function initThreeBackground() {

    const canvas =
        $("#three-bg");


    if (!canvas) return;


    /*
     * Reduced motion:
     * completely disable WebGL.
     */

    if (prefersReducedMotion()) {

        canvas.style.display =
            "none";

        return;

    }


    /*
     * Three.js is loaded with defer.
     * DOMContentLoaded can occur before it in
     * some loading situations, so retry on load.
     */

    if (
        typeof THREE === "undefined"
    ) {

        window.addEventListener(
            "load",
            () => {

                if (
                    typeof THREE !==
                    "undefined"
                ) {

                    createThreeScene(
                        canvas
                    );

                }

            },
            {
                once: true
            }
        );

        return;

    }


    createThreeScene(canvas);

}


/* =========================================================
   THREE.JS SCENE
========================================================= */

function createThreeScene(canvas) {

    if (
        !canvas ||
        typeof THREE ===
        "undefined"
    ) {

        return;

    }


    /*
     * Prevent duplicate initialization.
     */

    if (
        canvas.dataset.initialized ===
        "true"
    ) {

        return;

    }


    canvas.dataset.initialized =
        "true";


    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(

            55,

            window.innerWidth /
            window.innerHeight,

            0.1,

            100

        );


    camera.position.z =
        7;


    /*
     * Renderer.
     */

    let renderer;


    try {

        renderer =
            new THREE.WebGLRenderer({

                canvas,

                alpha: true,

                antialias: true,

                powerPreference:
                    "high-performance"

            });

    } catch (error) {

        console.warn(
            "WebGL is unavailable.",
            error
        );

        return;

    }


    renderer.setPixelRatio(

        Math.min(

            window.devicePixelRatio ||
            1,

            1.5

        )

    );


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );


    /*
     * Particle count.
     */

    const isMobile =
        window.innerWidth < 768;


    const particleCount =
        isMobile
            ? 220
            : 600;


    const positions =
        new Float32Array(
            particleCount * 3
        );


    /*
     * Generate particles.
     */

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            2 +
            Math.random() *
            9;


        positions[
            i * 3
        ] =
            Math.cos(angle) *
            distance;


        positions[
            i * 3 + 1
        ] =
            (Math.random() - 0.5) *
            8;


        positions[
            i * 3 + 2
        ] =
            (Math.random() - 0.5) *
            5;

    }


    /*
     * Geometry.
     */

    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )

    );


    /*
     * Particle material.
     */

    const material =
        new THREE.PointsMaterial({

            color: 0xd4af37,

            size:
                isMobile
                    ? 0.025
                    : 0.018,

            transparent: true,

            opacity: 0.48,

            depthWrite: false

        });


    /*
     * Particle system.
     */

    const particles =
        new THREE.Points(

            geometry,

            material

        );


    scene.add(
        particles
    );


    /*
     * Mouse influence.
     */

    let mouseX = 0;
    let mouseY = 0;


    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                (
                    event.clientX /
                    window.innerWidth
                ) *
                2 -
                1;


            mouseY =
                (
                    event.clientY /
                    window.innerHeight
                ) *
                2 -
                1;

        },
        {
            passive: true
        }
    );


    /*
     * Animation.
     */

    let animationID;


    const animate = () => {

        animationID =
            requestAnimationFrame(
                animate
            );


        particles.rotation.y +=
            0.00035;


        particles.rotation.x +=
            0.00006;


        particles.rotation.y +=
            mouseX * 0.00008;


        particles.rotation.x +=
            mouseY * 0.00003;


        renderer.render(
            scene,
            camera
        );

    };


    animate();


    /*
     * Resize.
     */

    const resize =
        () => {

            const width =
                window.innerWidth;

            const height =
                window.innerHeight;


            camera.aspect =
                width / height;


            camera.updateProjectionMatrix();


            renderer.setSize(
                width,
                height
            );


            renderer.setPixelRatio(

                Math.min(

                    window.devicePixelRatio ||
                    1,

                    1.5

                )

            );

        };


    window.addEventListener(
        "resize",
        resize,
        {
            passive: true
        }
    );


    /*
     * Cleanup.
     */

    window.addEventListener(
        "beforeunload",
        () => {

            cancelAnimationFrame(
                animationID
            );


            geometry.dispose();

            material.dispose();

            renderer.dispose();

        }
    );

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function initNavbarScroll() {

    const nav =
        $(".nav");


    if (!nav) return;


    const updateNavbar =
        () => {

            if (
                window.scrollY >
                40
            ) {

                nav.classList.add(
                    "scrolled"
                );

            } else {

                nav.classList.remove(
                    "scrolled"
                );

            }

        };


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function initImageFallback() {

    document.addEventListener(
        "error",
        event => {

            const element =
                event.target;


            if (
                element.tagName !==
                "IMG"
            ) {

                return;

            }


            element.classList.add(
                "image-error"
            );


            console.warn(
                `Image failed to load: ${element.src}`
            );

        },
        true
    );

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Escape closes the mobile menu.
         */

        if (
            event.key ===
            "Escape"
        ) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   PAGE LOAD STATE
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);


/* =========================================================
   FOOTER YEAR
========================================================= */

function initYear() {

    const year =
        $("#year");


    if (!year) return;


    year.textContent =
        new Date().getFullYear();

}


/* =========================================================
   END OF AKHIL.IN SCRIPT
========================================================= */
