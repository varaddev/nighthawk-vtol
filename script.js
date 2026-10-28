/* =========================================
   NIGHTHAWK VTOL
   Scroll and interaction effects
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // 1. SCROLL REVEAL ANIMATIONS

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        // Fallback for older browsers

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    // 2. AIRCRAFT MOVEMENT ON SCROLL

    const hero = document.querySelector(".hero");
    const drone = document.querySelector(".drone-image");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (hero && drone && !reducedMotion) {

        let animationFrameRequested = false;

        function updateAircraft() {

            const rect = hero.getBoundingClientRect();

            const viewportHeight = window.innerHeight;

            const progress = Math.max(
                0,
                Math.min(
                    1,
                    (viewportHeight - rect.top) /
                    (viewportHeight + rect.height)
                )
            );

            const movementX = (progress - 0.5) * 18;
            const rotation = (progress - 0.5) * 3;

            drone.style.marginLeft = `${movementX}px`;
            drone.style.filter =
                `drop-shadow(0 ${25 + progress * 5}px 20px rgba(38, 41, 33, 0.15))`;

            drone.style.setProperty(
                "--scroll-rotation",
                `${rotation}deg`
            );

            animationFrameRequested = false;

        }

        window.addEventListener(
            "scroll",
            () => {

                if (!animationFrameRequested) {

                    window.requestAnimationFrame(updateAircraft);

                    animationFrameRequested = true;

                }

            },
            { passive: true }
        );

    }


    // 3. SMOOTH NAVIGATION

    const navigationLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    navigationLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start"
                });

            }

        });

    });


    // 4. COMPONENT IMAGE FALLBACK

    const componentImages = document.querySelectorAll(
        ".component-image img"
    );

    componentImages.forEach((img) => {

        img.addEventListener("error", () => {

            img.style.display = "none";

            const parent = img.closest(".component-image");

            if (parent && !parent.querySelector(".image-error")) {

                const fallback = document.createElement("div");

                fallback.className = "image-error";

                fallback.innerHTML = `
                    <span>IMAGE</span>
                    <small>ADD YOUR COMPONENT PHOTO</small>
                `;

                parent.appendChild(fallback);

            }

        });

    });


    // 5. CURRENT YEAR

    const footerYear = document.querySelector(".site-footer");

    if (footerYear) {

        const yearText = footerYear.querySelector("span:last-child");

        if (yearText) {
            yearText.textContent = `© ${new Date().getFullYear()}`;
        }

    }


    // 6. PAGE READY

    document.body.classList.add("page-ready");

    console.log(
        "NIGHTHAWK VTOL presentation loaded successfully."
    );

});