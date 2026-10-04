document.addEventListener("DOMContentLoaded", function () {
    const openingElements = document.querySelectorAll(
        ".hero-subtitle, " +
        ".hero-inner h1, " +
        ".hero-description, " +
        ".hero-buttons"
    );

    openingElements.forEach(function (element, index) {
        element.classList.add("landing-opening");
        element.style.animationDelay = (index * 0.15) + "s";
    });

    const textElements = document.querySelectorAll(
        ".preview-section .section-kicker, " +
        ".preview-section h2, " +
        ".preview-section .section-copy"
    );

    textElements.forEach(function (element) {
        element.classList.add("landing-text");
    });

    const cards = document.querySelectorAll(
        ".preview-product-card, " +
        ".service-plan-card"
    );

    cards.forEach(function (card) {
        card.classList.add("landing-card");
    });

    const motionElements = document.querySelectorAll(
        ".see-calix-motion, " +
        ".calix-motion, " +
        ".motion-section, " +
        ".motion-content, " +
        ".motion-video, " +
        ".video-section, " +
        ".video-container"
    );

    motionElements.forEach(function (element) {
        element.classList.add("landing-motion");
    });

    const footer = document.querySelector(".calix-footer");

    if (footer) {
        footer.classList.add("landing-footer");
    }
});