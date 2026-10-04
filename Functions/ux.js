(function ($) {
    "use strict";

    $(function () {
        const currentFile = window.location.pathname.split("/").pop() || "calix_landing_page.html";
        const productDetailPage = window.location.pathname.includes("/ProductsViewDetails/");

        $(".calix-navbar .nav-link").each(function () {
            const $link = $(this);
            const href = ($link.attr("href") || "").split("?")[0].split("#")[0];
            const hrefFile = href.split("/").pop();
            const active = Boolean(hrefFile) && (hrefFile === currentFile || (productDetailPage && hrefFile === "Products.html"));

            $link.toggleClass("ux-current", active);
            if (active) $link.attr("aria-current", "page");
            else $link.removeAttr("aria-current");
        });

        $(".calix-navbar .navbar-collapse .nav-link").on("click", function () {
            const collapse = document.querySelector(".calix-navbar .navbar-collapse.show");
            if (collapse && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        });

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

        const elements = [...document.querySelectorAll([
            ".preview-product-card",
            ".service-plan-card",
            ".product-card",
            ".product-video-frame",
            ".about-value-card",
            ".footer-card"
        ].join(","))];

        elements.forEach((element) => element.classList.add("ux-reveal"));

        const observer = new IntersectionObserver((entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("ux-visible");
                activeObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

        elements.forEach((element) => observer.observe(element));
    });
})(jQuery);
