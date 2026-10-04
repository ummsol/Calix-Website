$(function () {
    "use strict";

    const $list = $("#quoteItems");
    const $count = $("#quoteItemCount");
    const $permitWrap = $("#permitUploadWrap");
    const $permitInput = $("#permitFile");
    const $permitPreview = $("#permitPreview");
    const maxPermitBytes = 1.5 * 1024 * 1024;
    let permitData = null;

    function catalogFor(item) {
        return CalixApp.PRODUCT_CATALOG[item.name] || {};
    }

    function itemSummary(item) {
        const specs = item.specs || {};
        const parts = [];
        if (specs.size) parts.push(specs.size);
        if (specs.customDimensions) parts.push(specs.customDimensions);
        if (specs.material) parts.push(specs.material);
        if (specs.finish) parts.push(specs.finish);
        return parts.join(" • ");
    }

    function estimatedItemTotal(item) {
        if (Number(item.estimatedTotal) > 0) return Number(item.estimatedTotal);
        if (Number(item.estimatedUnitPrice) > 0) return Number(item.estimatedUnitPrice) * (Number(item.quantity) || 1);
        const startingPrice = Number(catalogFor(item).startingPrice) || 0;
        return startingPrice * (Number(item.quantity) || 1);
    }

    function ensureReferenceModal() {
        if ($("#quoteReferencePhotoModal").length) return;

        $("body").append(`
            <div class="modal fade product-reference-modal" id="quoteReferencePhotoModal" tabindex="-1" aria-labelledby="quoteReferencePhotoTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div>
                                <p class="reference-photo-kicker mb-1">CALIX PROJECT REFERENCE</p>
                                <h2 class="modal-title fs-4" id="quoteReferencePhotoTitle">Reference Installation</h2>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="reference-photo-stage quote-reference-stage">
                                <img data-quote-reference-image alt="" loading="lazy">
                            </div>
                            <p class="reference-photo-note mb-0"><strong>For reference, not the actual design.</strong> Final dimensions, layout, glass or panel, finish, hardware, and installation details are confirmed during quotation and site measurement.</p>
                        </div>
                    </div>
                </div>
            </div>`);
    }

    function renderQuoteSummary(items) {
        const knownTotal = items.reduce((sum, item) => sum + estimatedItemTotal(item), 0);
        const unpricedCount = items.filter((item) => estimatedItemTotal(item) <= 0).length;
        const $bar = $(".quote-summary-bar");

        if (!items.length) {
            $bar.html('<div><span>Planning estimate</span><small>Add a product or service to begin.</small></div><strong>—</strong>');
            return;
        }

        const detail = unpricedCount
            ? `${unpricedCount} item${unpricedCount === 1 ? "" : "s"} will be priced after project review.`
            : "Final price may vary per contract agreement and approved project specifications.";

        $bar.html(`
            <div class="quote-summary-copy">
                <span>Planning estimate</span>
                <small>${detail}</small>
            </div>
            <strong>${knownTotal ? `${CalixApp.formatCurrency(knownTotal)}*` : "Price upon quotation"}</strong>`);
    }

    function renderQuote() {
        const items = CalixApp.getQuoteItems();
        const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        $count.text(`${total} item${total === 1 ? "" : "s"}`);
        $list.empty();
        $("#quoteRequestForm button[type='submit']").prop("disabled", items.length === 0);

        if (!items.length) {
            $list.html('<div class="quote-list-empty"><p class="mb-3">Your quote list is empty.</p><div class="d-flex flex-wrap justify-content-center gap-2"><a class="btn btn-sm btn-outline-secondary" href="Products.html">Browse Products</a><a class="btn btn-sm btn-outline-secondary" href="services.html">Browse Services</a></div></div>');
            renderQuoteSummary(items);
            return;
        }

        items.forEach((item) => {
            const catalog = catalogFor(item);
            const previewFile = item.modelPreviewFile || catalog.modelPreviewFile || "";
            const referenceFile = item.referenceImageFile || catalog.referenceImageFile || item.imageFile || "";
            const summary = itemSummary(item);
            const estimate = estimatedItemTotal(item);
            const image = previewFile
                ? `<div class="quote-item-image quote-model-preview"><img src="../Assets/${previewFile}" alt="3D model preview of ${item.name}"><span>3D</span></div>`
                : '<div class="quote-item-image quote-service-preview d-flex align-items-center justify-content-center"><span>CALIX</span></div>';

            const referenceButton = item.type === "Product" && referenceFile
                ? `<button class="quote-reference-button" type="button" data-quote-reference="${referenceFile}" data-reference-name="${item.name}">View Reference Installation</button>`
                : "";

            const priceLine = estimate
                ? `<p class="quote-item-price">Planning estimate: <strong>${CalixApp.formatCurrency(estimate)}*</strong></p>`
                : '<p class="quote-item-price">Price upon quotation</p>';

            const $item = $(`
                <article class="quote-item" data-id="${item.id}">
                    ${image}
                    <div class="quote-item-content">
                        <span class="quote-item-type"></span>
                        <h3></h3>
                        <p class="quote-item-summary"></p>
                        <p class="quote-item-qty"></p>
                        ${priceLine}
                        ${referenceButton}
                    </div>
                    <div class="quote-item-actions"><button class="quote-remove" type="button">Remove</button></div>
                </article>`);

            $item.find(".quote-item-type").text(item.type || "Quote item");
            $item.find("h3").text(item.name);
            $item.find(".quote-item-summary").text(summary || "Specifications will be confirmed during quotation.");
            $item.find(".quote-item-qty").text(`Quantity: ${item.quantity || 1}`);
            $list.append($item);
        });

        renderQuoteSummary(items);
    }

    function prefillAccount() {
        const user = CalixApp.getCurrentUser();
        if (!user) return;
        const account = CalixApp.getAccounts()[user.email] || {};
        $("#customerName").val(account.name || user.name || "");
        $("#customerEmail").val(user.email || "");
        $("#customerPhone").val(account.phone || "");
        $("#accountStatus").text(`Signed in as ${user.email}`);
    }

    ensureReferenceModal();

    $list.on("click", ".quote-remove", function () {
        CalixApp.removeQuoteItem($(this).closest(".quote-item").data("id"));
        renderQuote();
    });

    $list.on("click", "[data-quote-reference]", function () {
        const file = $(this).data("quoteReference");
        const name = $(this).data("referenceName") || "Product";
        const $modal = $("#quoteReferencePhotoModal");
        $modal.find("#quoteReferencePhotoTitle").text(name);
        $modal.find("[data-quote-reference-image]").attr({
            src: `../Assets/${file}`,
            alt: `Reference installation image for ${name}`
        });
        bootstrap.Modal.getOrCreateInstance($modal[0]).show();
    });

    $("input[name='permitRequired']").on("change", function () {
        const required = $("input[name='permitRequired']:checked").val() === "Yes";
        $permitWrap.toggle(required);
        $permitInput.prop("required", required);
        if (!required) {
            $permitInput.val("");
            permitData = null;
            $permitPreview.removeClass("is-visible").text("");
        }
    });

    $permitInput.on("change", function () {
        const file = this.files && this.files[0];
        permitData = null;
        $permitPreview.removeClass("is-visible").text("");
        if (!file) return;

        const allowed = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowed.includes(file.type)) {
            this.value = "";
            CalixApp.showToast("Use a PDF, JPG, or PNG permit file.");
            return;
        }
        if (file.size > maxPermitBytes) {
            this.value = "";
            CalixApp.showToast("Permit file must be 1.5 MB or smaller for this front-end prototype.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            permitData = { name: file.name, type: file.type, size: file.size, dataUrl: reader.result };
            $permitPreview.addClass("is-visible").text(`${file.name} · ${CalixApp.formatFileSize(file.size)}`);
        };
        reader.readAsDataURL(file);
    });

    $("#quoteRequestForm").on("submit", function (event) {
        event.preventDefault();
        const items = CalixApp.getQuoteItems();
        const name = $("#customerName").val().trim();
        const email = $("#customerEmail").val().trim().toLowerCase();
        const phone = $("#customerPhone").val().trim();
        const address = $("#projectAddress").val().trim();
        const permitRequired = $("input[name='permitRequired']:checked").val() || "No";

        $("#quoteFormError").text("");

        if (!items.length) {
            $("#quoteFormError").text("Add at least one product or service before requesting a quote.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!name || !CalixApp.isValidEmail(email) || !/^\+?[0-9\s-]{7,15}$/.test(phone) || !address) {
            $("#quoteFormError").text("Enter your name, a valid email, phone number, and project address.");
            return;
        }
        if (permitRequired === "Yes" && !permitData) {
            $("#quoteFormError").text("Attach the required building or condominium permit before submitting.");
            return;
        }

        const reference = CalixApp.createReference("Q");
        const user = CalixApp.getCurrentUser();
        const estimatedTotal = items.reduce((sum, item) => sum + estimatedItemTotal(item), 0);
        const request = {
            reference,
            status: "Pending Review",
            createdAt: new Date().toISOString(),
            accountEmail: user?.email || email,
            customer: { name, email, phone },
            project: {
                type: $("#projectType").val(),
                address,
                preferredVisit: $("#preferredVisit").val(),
                permitRequired,
                notes: $("#projectNotes").val().trim()
            },
            permit: permitData,
            estimatedTotal,
            approvedTotal: null,
            requiredDeposit: null,
            payment: null,
            order: null,
            timeline: [{ status: "Pending Review", at: new Date().toISOString() }],
            priceDisclaimer: "Final price may vary per contract agreement and approved project specifications.",
            items
        };

        try {
            CalixApp.saveQuoteRequest(request);
        } catch (error) {
            $("#quoteFormError").text("The request could not be saved in this browser. Try a smaller permit file or remove older saved requests.");
            return;
        }
        CalixApp.clearQuoteItems();
        $("#quoteReference").text(reference);
        const $nextLink = $("#quoteSuccessModal .modal-footer a");
        $nextLink
            .attr("href", `Transaction.html?ref=${encodeURIComponent(reference)}`)
            .text("Track request");
        bootstrap.Modal.getOrCreateInstance(document.getElementById("quoteSuccessModal")).show();
        this.reset();
        permitData = null;
        $permitWrap.hide();
        $permitPreview.removeClass("is-visible").text("");
        renderQuote();
    });

    $("#copyQuoteReference").on("click", async function () {
        const ref = $("#quoteReference").text();
        try {
            await navigator.clipboard.writeText(ref);
            CalixApp.showToast("Quote reference copied.");
        } catch {
            window.prompt("Copy your CALIX quote reference:", ref);
        }
    });

    renderQuote();
    prefillAccount();
});
