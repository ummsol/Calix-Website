document.addEventListener("DOMContentLoaded", function () {
    const openingElements = document.querySelectorAll(
        ".products-heading p, " +
        ".products-heading h1, " +
        ".products-heading span"
    );

    openingElements.forEach(function (element, index) {
        element.classList.add("products-opening");
        element.style.animationDelay = (index * 0.15) + "s";
    });

    const textElements = document.querySelectorAll(
        ".products-heading span"
    );

    textElements.forEach(function (element) {
        element.classList.add("products-text");
    });

    const cardContainer = document.querySelector(".product-card-container");

    if (cardContainer) {
        const cards = cardContainer.querySelectorAll(".product-card");

        let currentRow = [];
        let currentTop = null;
        const rows = [];

        cards.forEach(function (card) {
            const top = card.offsetTop;

            if (currentTop === null) {
                currentTop = top;
            }

            if (Math.abs(top - currentTop) > 10) {
                rows.push(currentRow);
                currentRow = [];
                currentTop = top;
            }

            currentRow.push(card);
        });

        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        rows.forEach(function (row) {
            row.forEach(function (card) {
                card.classList.add("products-row");
            });
        });
    }

    const footer = document.querySelector(".calix-footer");

    if (footer) {
        footer.classList.add("products-footer");
    }
});