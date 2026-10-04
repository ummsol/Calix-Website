(function (window, $) {
    "use strict";

    const KEYS = {
        accounts: "calixAccounts",
        currentUser: "calixCurrentUser",
        quoteItems: "calixQuoteItems",
        quoteRequests: "calixQuoteRequests"
    };

    const PRODUCT_CATALOG = {
        "Sliding Glass Door": {
            modelPreviewFile: "ModelPreviews/sliding-glass-door.png",
            referenceImageFile: "pc1.jfif",
            startingPrice: 28000
        },
        "Glass Window": {
            modelPreviewFile: "ModelPreviews/glass-window.png",
            referenceImageFile: "window.jfif",
            startingPrice: 8500
        },
        "Aluminum Door": {
            modelPreviewFile: "ModelPreviews/aluminum-door.png",
            referenceImageFile: "pc2.jfif",
            startingPrice: 15500
        },
        "Glass Stair Railing": {
            modelPreviewFile: "ModelPreviews/glass-stair-railing.png",
            referenceImageFile: "glass-stair-railing.png",
            startingPrice: 18000
        },
        "Frameless Shower Enclosure": {
            modelPreviewFile: "ModelPreviews/frameless-shower-enclosure.png",
            referenceImageFile: "frameless-shower-enclosure.png",
            startingPrice: 18000
        },
        "Frosted Sliding Door": {
            modelPreviewFile: "ModelPreviews/frosted-sliding-door.png",
            referenceImageFile: "frosted-sliding-door.png",
            startingPrice: 22000
        },
        "Black Aluminum Sliding Door": {
            modelPreviewFile: "ModelPreviews/black-aluminum-sliding-door.png",
            referenceImageFile: "black-aluminum-sliding-door.jpg",
            startingPrice: 32000
        },
        "Awning Window": {
            modelPreviewFile: "ModelPreviews/awning-window.png",
            referenceImageFile: "awning-window.jpg",
            startingPrice: 7500
        },
        "Sliding Aluminum Window": {
            modelPreviewFile: "ModelPreviews/sliding-aluminum-window.png",
            referenceImageFile: "sliding-aluminum-window.jpg",
            startingPrice: 9500
        }
    };

    function formatCurrency(value) {
        const amount = Number(value) || 0;
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0
        }).format(amount);
    }

    function safeParse(value, fallback) {
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    function getAccounts() {
        return safeParse(localStorage.getItem(KEYS.accounts) || "{}", {});
    }

    function saveAccounts(accounts) {
        localStorage.setItem(KEYS.accounts, JSON.stringify(accounts));
    }

    function getCurrentUser() {
        return safeParse(sessionStorage.getItem(KEYS.currentUser) || "null", null);
    }

    function setCurrentUser(user) {
        sessionStorage.setItem(KEYS.currentUser, JSON.stringify(user));
        sessionStorage.setItem("customerLogin", user.email || user.username || "");
        sessionStorage.setItem("userRole", user.role || "Customer");
    }

    function signOut() {
        [KEYS.currentUser, "customerLogin", "userRole"].forEach((key) => sessionStorage.removeItem(key));
    }

    function getQuoteItems() {
        return safeParse(localStorage.getItem(KEYS.quoteItems) || "[]", []);
    }

    function saveQuoteItems(items) {
        localStorage.setItem(KEYS.quoteItems, JSON.stringify(items));
        updateQuoteBadge();
        window.dispatchEvent(new CustomEvent("calix:quote-updated", { detail: items }));
    }

    function addQuoteItem(item) {
        const items = getQuoteItems();
        items.push({
            id: item.id || `qi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            addedAt: item.addedAt || new Date().toISOString(),
            quantity: Number(item.quantity) || 1,
            ...item
        });
        saveQuoteItems(items);
        return items;
    }

    function removeQuoteItem(id) {
        const items = getQuoteItems().filter((item) => item.id !== id);
        saveQuoteItems(items);
        return items;
    }

    function clearQuoteItems() {
        saveQuoteItems([]);
    }

    function getQuoteRequests() {
        return safeParse(localStorage.getItem(KEYS.quoteRequests) || "[]", []);
    }

    function saveQuoteRequest(request) {
        const requests = getQuoteRequests();
        requests.unshift(request);
        localStorage.setItem(KEYS.quoteRequests, JSON.stringify(requests));
        return requests;
    }


    function getQuoteRequest(reference) {
        return getQuoteRequests().find((request) => request.reference === reference) || null;
    }

    function updateQuoteRequest(reference, changes) {
        const requests = getQuoteRequests();
        const index = requests.findIndex((request) => request.reference === reference);
        if (index < 0) return null;

        const current = requests[index];
        const next = typeof changes === "function"
            ? changes({ ...current })
            : { ...current, ...changes };

        requests[index] = { ...next, updatedAt: new Date().toISOString() };
        localStorage.setItem(KEYS.quoteRequests, JSON.stringify(requests));
        window.dispatchEvent(new CustomEvent("calix:transaction-updated", { detail: requests[index] }));
        return requests[index];
    }

    function createReference(prefix) {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
        return `CALIX-${prefix}-${date}-${suffix}`;
    }

    function isValidEmail(email) {
        return /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(String(email || "").trim());
    }

    function formatFileSize(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
        if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function relativeHtml(name) {
        return window.location.pathname.includes("/ProductsViewDetails/") ? `../${name}` : name;
    }

    function relativeAsset(name) {
        return window.location.pathname.includes("/ProductsViewDetails/") ? `../../Assets/${name}` : `../Assets/${name}`;
    }

    function ensureMotionSection() {
        const $footer = $("footer.calix-footer").first();
        if (!$footer.length || $(".product-video-section").length) return;

        const poster = relativeAsset("sliding-aluminum-window.jpg");
        const section = `
            <section class="product-video-section" aria-labelledby="calixMotionTitle">
                <div class="container">
                    <div class="row g-4 g-lg-5 align-items-center">
                        <div class="col-lg-5">
                            <div class="product-video-copy">
                                <p class="section-kicker">Built in the real world</p>
                                <h2 id="calixMotionTitle">See CALIX<br><em>in motion.</em></h2>
                                <p>Watch a short look at CALIX fabrication and installation work.</p>
                            </div>
                        </div>
                        <div class="col-lg-7">
                            <div class="product-video-frame">
                                <video controls muted playsinline preload="metadata" poster="${poster}">
                                    <source src="https://raw.githubusercontent.com/CALIX-GlassAndAluminum/CALIX/main/assets/CALIXAD.mp4" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;

        $footer.before(section);
    }

    function updateQuoteBadge() {
        const count = getQuoteItems().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

        $(".calix-navbar .quote-nav-link").each(function () {
            const $link = $(this);
            $link
                .empty()
                .append(
                    $("<span>", { class: "quote-label", text: "Get a quote" }),
                    $("<span>", { class: "quote-separator", "aria-hidden": "true", text: "/" }),
                    $("<span>", { class: "quote-count", "aria-hidden": "true", text: count })
                )
                .toggleClass("has-items", count > 0)
                .attr("aria-label", `Get a quote, ${count} ${count === 1 ? "item" : "items"} selected`);
        });
    }

    function updateAccountNavigation() {
        const user = getCurrentUser();

        $(".login-nav-link").each(function () {
            const $login = $(this);
            const $item = $login.closest(".nav-item");
            let $profile = $item.siblings(".profile-nav-item");

            if (!$profile.length) {
                $profile = $('<li class="nav-item profile-nav-item"><a class="nav-link profile-nav-link">Profile</a></li>');
                $item.after($profile);
            }

            $profile.find("a").attr("href", relativeHtml("Profile.html"));
            $item.toggle(!user);
            $profile.toggle(Boolean(user));
        });
    }

    function showToast(message) {
        let $host = $(".calix-toast");
        if (!$host.length) {
            $host = $('<div class="calix-toast" aria-live="polite" aria-atomic="true"></div>').appendTo("body");
        }

        const $toast = $('<div class="toast" role="status"><div class="d-flex"><div class="toast-body"></div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>');
        $toast.find(".toast-body").text(message);
        $host.empty().append($toast);
        bootstrap.Toast.getOrCreateInstance($toast[0], { delay: 2400 }).show();
    }

    window.CalixApp = {
        KEYS,
        PRODUCT_CATALOG,
        formatCurrency,
        getAccounts,
        saveAccounts,
        getCurrentUser,
        setCurrentUser,
        signOut,
        getQuoteItems,
        addQuoteItem,
        removeQuoteItem,
        clearQuoteItems,
        getQuoteRequests,
        getQuoteRequest,
        saveQuoteRequest,
        updateQuoteRequest,
        createReference,
        isValidEmail,
        formatFileSize,
        ensureMotionSection,
        updateQuoteBadge,
        updateAccountNavigation,
        showToast
    };

    $(function () {
        $(".calix-navbar .quote-nav-link").attr("href", relativeHtml("QuoteRequest.html"));
        ensureMotionSection();
        updateQuoteBadge();
        updateAccountNavigation();
    });
})(window, jQuery);
