$(function () {
    "use strict";

    const catalog = CalixApp.PRODUCT_CATALOG || {};

    const modalHtml = `
        <div class="modal fade product-reference-modal" id="productsReferenceModal" tabindex="-1" aria-labelledby="productsReferenceTitle" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <p class="reference-photo-kicker mb-1">CALIX PROJECT REFERENCE</p>
                            <h2 class="modal-title fs-4" id="productsReferenceTitle">Reference Installation</h2>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="reference-photo-stage product-list-reference-stage">
                            <img data-products-reference-image alt="" loading="lazy">
                        </div>
                        <p class="reference-photo-note mb-0"><strong>For reference, not the actual design.</strong> Final dimensions, layout, glass, finish, hardware, and installation details are confirmed during quotation and site measurement.</p>
                    </div>
                </div>
            </div>
        </div>`;

    if (!$("#productsReferenceModal").length) {
        $("body").append(modalHtml);
    }

    $(".products-page .product-card").each(function () {
        const $card = $(this);
        const name = $card.find("h3").first().text().trim();
        const item = catalog[name];

        if (!item) return;

        const $imageWrap = $card.find(".product-image").first();
        const $image = $imageWrap.find("img").first();
        $image.attr({
            src: `../Assets/${item.modelPreviewFile}`,
            alt: `3D model preview of ${name}`
        });

        if (!$imageWrap.find(".model-preview-badge").length) {
            $imageWrap.append('<span class="model-preview-badge">3D model preview</span>');
        }

        const $info = $card.find(".product-info").first();
        const $description = $info.find("p").first();
        const priceText = item.startingPrice
            ? `Starts around ${CalixApp.formatCurrency(item.startingPrice)}*`
            : "Price upon quotation";

        if (!$info.find(".product-card-price").length) {
            $("<p>", { class: "product-card-price", text: priceText }).insertAfter($description);
        }

        const $details = $info.find(".product-button").first();
        if (!$info.find(".reference-card-button").length) {
            const $actions = $('<div class="product-card-actions"></div>');
            $details.before($actions);
            $actions.append($details);
            $actions.append(
                $("<button>", {
                    type: "button",
                    class: "reference-card-button",
                    text: "View Reference Installation",
                    "data-reference-product": name
                })
            );
        }
    });

    if (!$(".products-heading .price-disclaimer").length) {
        $(".products-heading span").after(
            '<p class="price-disclaimer">*Starting estimates are for planning only. Final price may vary per contract agreement, approved specifications, site measurement, materials, hardware, and installation conditions.</p>'
        );
    }

    $(document).on("click", "[data-reference-product]", function () {
        const name = $(this).data("referenceProduct");
        const item = catalog[name];
        if (!item) return;

        const $modal = $("#productsReferenceModal");
        $modal.find("#productsReferenceTitle").text(name);
        $modal.find("[data-products-reference-image]").attr({
            src: `../Assets/${item.referenceImageFile}`,
            alt: `Reference installation image for ${name}`
        });
        bootstrap.Modal.getOrCreateInstance($modal[0]).show();
    });
});
