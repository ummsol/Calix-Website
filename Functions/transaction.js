$(function () {
    "use strict";

    const params = new URLSearchParams(window.location.search);
    const reference = params.get("ref") || "";
    const maxProofBytes = 1.5 * 1024 * 1024;
    let paymentProof = null;

    const stages = [
        { key: "submitted", label: "Request Submitted" },
        { key: "review", label: "CALIX Review" },
        { key: "approved", label: "Quotation Approved" },
        { key: "payment", label: "Payment" },
        { key: "confirmed", label: "Order Confirmed" },
        { key: "processing", label: "Processing" },
        { key: "installation", label: "Installation" },
        { key: "completed", label: "Completed" }
    ];

    function getRequest() {
        if (reference) return CalixApp.getQuoteRequest(reference);
        const user = CalixApp.getCurrentUser();
        const requests = CalixApp.getQuoteRequests();
        if (user) {
            return requests.find((item) => item.accountEmail === user.email || item.customer?.email === user.email) || null;
        }
        return requests[0] || null;
    }

    function currentStageIndex(request) {
        const status = String(request.status || "Pending Review");
        const map = {
            "Submitted": 1,
            "Pending Review": 1,
            "Quotation Approved": 3,
            "Payment Submitted": 3,
            "Payment Verification": 3,
            "Order Confirmed": 4,
            "Processing": 5,
            "Installation Scheduled": 6,
            "Completed": 7
        };
        return map[status] ?? 1;
    }

    function appendTimelineEntry(request, status) {
        request.timeline = Array.isArray(request.timeline) ? request.timeline : [];
        request.timeline.push({ status, at: new Date().toISOString() });
        return request;
    }

    function itemSummary(item) {
        const specs = item.specs || {};
        return [specs.size, specs.customDimensions, specs.material, specs.finish]
            .filter(Boolean)
            .join(" · ");
    }

    function itemEstimate(item) {
        if (Number(item.estimatedTotal) > 0) return Number(item.estimatedTotal);
        if (Number(item.estimatedUnitPrice) > 0) return Number(item.estimatedUnitPrice) * (Number(item.quantity) || 1);
        const price = Number(CalixApp.PRODUCT_CATALOG[item.name]?.startingPrice) || 0;
        return price * (Number(item.quantity) || 1);
    }

    function renderTimeline(request) {
        const active = currentStageIndex(request);
        const $timeline = $("#transactionTimeline").empty();

        stages.forEach((stage, index) => {
            const $item = $("<li>", { class: "transaction-stage", text: stage.label });
            if (index < active || request.status === "Completed") $item.addClass("is-complete");
            if (index === active && request.status !== "Completed") $item.addClass("is-current");
            $timeline.append($item);
        });
    }

    function renderItems(request) {
        const $items = $("#transactionItems").empty();
        (request.items || []).forEach((item) => {
            const catalog = CalixApp.PRODUCT_CATALOG[item.name] || {};
            const preview = item.modelPreviewFile || catalog.modelPreviewFile;
            const estimate = itemEstimate(item);
            const media = preview
                ? `<div class="transaction-item-media"><img src="../Assets/${preview}" alt="3D model preview of ${item.name}"></div>`
                : '<div class="transaction-item-media d-flex align-items-center justify-content-center"><span class="small text-secondary">CALIX</span></div>';

            const $row = $(`
                <article class="transaction-item">
                    ${media}
                    <div class="transaction-item-copy">
                        <h3></h3>
                        <p class="transaction-item-summary"></p>
                        <p class="transaction-item-qty"></p>
                    </div>
                    <div class="transaction-item-price"></div>
                </article>`);

            $row.find("h3").text(item.name || "Quote item");
            $row.find(".transaction-item-summary").text(itemSummary(item) || "Specifications confirmed during quotation.");
            $row.find(".transaction-item-qty").text(`Quantity: ${Number(item.quantity) || 1}`);
            $row.find(".transaction-item-price").text(estimate ? `${CalixApp.formatCurrency(estimate)}*` : "Upon quotation");
            $items.append($row);
        });
    }

    function renderProjectDetails(request) {
        const data = [
            ["Customer", request.customer?.name || "—"],
            ["Email", request.customer?.email || "—"],
            ["Phone", request.customer?.phone || "—"],
            ["Project type", request.project?.type || "—"],
            ["Project address", request.project?.address || "—"],
            ["Preferred site visit", request.project?.preferredVisit || "Not specified"],
            ["Permit required", request.project?.permitRequired || "No"],
            ["Permit file", request.permit?.name || "None attached"]
        ];

        const $grid = $("#transactionProjectDetails").empty();
        data.forEach(([label, value]) => {
            const $block = $('<div class="transaction-detail"><dt></dt><dd></dd></div>');
            $block.find("dt").text(label);
            $block.find("dd").text(value);
            $grid.append($block);
        });
    }

    function renderPayment(request) {
        const approved = Number(request.approvedTotal) > 0;
        const payment = request.payment || null;
        const required = Number(request.requiredDeposit) || 0;

        $("#paymentLocked").prop("hidden", approved);
        $("#paymentContent").prop("hidden", !approved);
        $("#requiredPaymentAmount").text(required ? CalixApp.formatCurrency(required) : "Amount set by CALIX");

        if (!approved) return;

        if (payment) {
            $("#paymentForm").prop("hidden", true);
            $("#paymentSubmittedState")
                .prop("hidden", false)
                .html(`<strong>${payment.status || "Submitted for verification"}</strong><br>${payment.method || "Payment"}${payment.reference ? ` · Reference: ${payment.reference}` : ""}`);
        } else {
            $("#paymentForm").prop("hidden", false);
            $("#paymentSubmittedState").prop("hidden", true).empty();
        }
    }

    function renderPrototypeControls(request) {
        const approved = Number(request.approvedTotal) > 0;
        const payment = request.payment || null;
        const order = request.order || null;

        $("#prototypeApprovalControls").prop("hidden", approved);
        $("#prototypePaymentControls").prop("hidden", !approved || !payment || payment.status === "Verified");
        $("#prototypeOrderControls").prop("hidden", !order);

        const estimate = Number(request.estimatedTotal) || 0;
        if (!approved) {
            $("#prototypeApprovedTotal").val(estimate || "");
            $("#prototypeDeposit").val(estimate ? Math.round(estimate * 0.5) : "");
        }
    }

    function renderOrder(request) {
        const order = request.order || null;
        $("#orderConfirmation").prop("hidden", !order);
        if (!order) return;
        $("#orderReference").text(order.reference || "—");
    }

    function statusClass(status) {
        if (["Order Confirmed", "Processing", "Installation Scheduled", "Completed"].includes(status)) return "is-positive";
        if (["Quotation Approved", "Payment Submitted", "Payment Verification"].includes(status)) return "is-warning";
        return "";
    }

    function render() {
        const request = getRequest();
        if (!request) {
            $("#transactionEmpty").prop("hidden", false);
            $("#transactionContent").prop("hidden", true);
            return;
        }

        if (!reference) {
            const url = new URL(window.location.href);
            url.searchParams.set("ref", request.reference);
            window.history.replaceState({}, "", url);
        }

        $("#transactionEmpty").prop("hidden", true);
        $("#transactionContent").prop("hidden", false);
        $("#transactionReference").text(request.reference);
        $("#transactionStatus, #transactionStatusBadge").text(request.status || "Pending Review");
        $("#transactionStatusBadge").attr("class", `transaction-status-badge ${statusClass(request.status)}`.trim());
        $("#transactionCreatedAt").text(new Date(request.createdAt).toLocaleString());
        $("#transactionEstimate").text(Number(request.estimatedTotal) > 0 ? `${CalixApp.formatCurrency(request.estimatedTotal)}*` : "Upon quotation");
        $("#transactionApprovedTotal").text(Number(request.approvedTotal) > 0 ? CalixApp.formatCurrency(request.approvedTotal) : "Pending review");

        renderTimeline(request);
        renderItems(request);
        renderProjectDetails(request);
        renderPayment(request);
        renderOrder(request);
        renderPrototypeControls(request);
    }

    function updateRequest(mutator) {
        const request = getRequest();
        if (!request) return null;
        try {
            const updated = CalixApp.updateQuoteRequest(request.reference, mutator);
            render();
            return updated;
        } catch (error) {
            CalixApp.showToast("This transaction could not be saved in this browser. Try a smaller attachment or clear older prototype records.");
            return null;
        }
    }

    $("input[name='paymentMethod']").on("change", function () {
        const cash = $(this).val() === "Cash / On-site";
        $("#digitalPaymentFields").toggle(!cash);
        $("#paymentReference, #paymentProof").prop("required", !cash);
        $("#paymentFormError").text("");
    });

    $("#paymentProof").on("change", function () {
        const file = this.files && this.files[0];
        paymentProof = null;
        $("#paymentProofPreview").removeClass("is-visible").text("");
        if (!file) return;

        const allowed = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowed.includes(file.type)) {
            this.value = "";
            CalixApp.showToast("Use a PDF, JPG, or PNG payment proof.");
            return;
        }
        if (file.size > maxProofBytes) {
            this.value = "";
            CalixApp.showToast("Payment proof must be 1.5 MB or smaller for this prototype.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            paymentProof = { name: file.name, type: file.type, size: file.size, dataUrl: reader.result };
            $("#paymentProofPreview").addClass("is-visible").text(`${file.name} · ${CalixApp.formatFileSize(file.size)}`);
        };
        reader.readAsDataURL(file);
    });

    $("#paymentForm").on("submit", function (event) {
        event.preventDefault();
        const request = getRequest();
        if (!request || !Number(request.approvedTotal)) return;

        const method = $("input[name='paymentMethod']:checked").val();
        const cash = method === "Cash / On-site";
        const paymentReference = $("#paymentReference").val().trim();
        $("#paymentFormError").text("");

        if (!cash && (!paymentReference || !paymentProof)) {
            $("#paymentFormError").text("Enter the payment reference and attach proof of payment.");
            return;
        }

        const updated = updateRequest((current) => {
            current.status = "Payment Submitted";
            current.payment = {
                method,
                amount: Number(current.requiredDeposit) || Number(current.approvedTotal) || 0,
                reference: cash ? "" : paymentReference,
                proof: cash ? null : paymentProof,
                status: cash ? "Pending receipt verification" : "Submitted for verification",
                submittedAt: new Date().toISOString()
            };
            return appendTimelineEntry(current, "Payment Submitted");
        });

        if (!updated) return;
        this.reset();
        paymentProof = null;
        $("#paymentProofPreview").removeClass("is-visible").text("");
        CalixApp.showToast("Payment submitted for verification.");
    });

    $("#prototypeApproveQuote").on("click", function () {
        const total = Number($("#prototypeApprovedTotal").val());
        const deposit = Number($("#prototypeDeposit").val());
        if (!(total > 0) || !(deposit > 0) || deposit > total) {
            CalixApp.showToast("Enter a valid approved total and required payment amount.");
            return;
        }

        updateRequest((current) => {
            current.status = "Quotation Approved";
            current.approvedTotal = total;
            current.requiredDeposit = deposit;
            current.approvedAt = new Date().toISOString();
            return appendTimelineEntry(current, "Quotation Approved");
        });
        CalixApp.showToast("Quotation approved for prototype demonstration.");
    });

    $("#prototypeVerifyPayment").on("click", function () {
        const request = getRequest();
        if (!request?.payment) return;

        updateRequest((current) => {
            current.status = "Order Confirmed";
            current.payment.status = "Verified";
            current.payment.verifiedAt = new Date().toISOString();
            current.order = current.order || {
                reference: CalixApp.createReference("O"),
                status: "Order Confirmed",
                confirmedAt: new Date().toISOString()
            };
            return appendTimelineEntry(current, "Order Confirmed");
        });
        CalixApp.showToast("Payment verified and order confirmed.");
    });

    $("#prototypeUpdateOrderStatus").on("click", function () {
        const nextStatus = $("#prototypeOrderStatus").val();
        updateRequest((current) => {
            if (!current.order) return current;
            current.status = nextStatus;
            current.order.status = nextStatus;
            current.order.updatedAt = new Date().toISOString();
            return appendTimelineEntry(current, nextStatus);
        });
        CalixApp.showToast(`Order status updated to ${nextStatus}.`);
    });

    render();
});
