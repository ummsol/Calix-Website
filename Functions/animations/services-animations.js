document.addEventListener("DOMContentLoaded", function () {
    const openingElements = document.querySelectorAll(
        ".services-hero h1, " +
        ".services-hero h2, " +
        ".services-hero p, " +
        ".services-hero .hero-subtitle, " +
        ".services-hero .hero-description, " +
        ".services-hero .hero-buttons, " +
        ".services-heading h1, " +
        ".services-heading p"
    );

    openingElements.forEach(function (element, index) {
        element.classList.add("services-opening");
        element.style.animationDelay = (index * 0.15) + "s";
    });

    const textElements = document.querySelectorAll(
        ".services-section h2, " +
        ".services-section h3, " +
        ".services-section p, " +
        ".services-intro h2, " +
        ".services-intro p, " +
        ".services-heading span"
    );

    textElements.forEach(function (element) {
        element.classList.add("services-text");
    });

    const cards = document.querySelectorAll(
        ".service-card, " +
        ".service-plan-card, " +
        ".services-card, " +
        ".service-item"
    );

    cards.forEach(function (card) {
        card.classList.add("services-card");
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
        element.classList.add("services-motion");
    });

    const footer = document.querySelector(".calix-footer");

    if (footer) {
        footer.classList.add("services-footer");

        const footerCards = footer.querySelectorAll(".footer-card");

        footerCards.forEach(function (card) {
            card.classList.add("services-card");
        });
    }
});