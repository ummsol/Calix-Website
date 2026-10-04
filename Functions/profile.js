$(function () {
    "use strict";

    const user = CalixApp.getCurrentUser();
    if (!user) {
        window.location.replace("LoginPage.html?return=Profile.html");
        return;
    }

    function getAccount() {
        return CalixApp.getAccounts()[user.email] || { name: user.name || user.email, email: user.email, role: user.role || "Customer", phone: "" };
    }

    function renderProfile() {
        const account = getAccount();
        const initials = (account.name || user.email).split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
        $("#profileAvatar").text(initials || "C");
        $("#profileNameDisplay").text(account.name || user.email);
        $("#profileEmailDisplay").text(user.email);
        $("#profileRoleDisplay").text(account.role || "Customer");
        $("#profileMemberSince").text(account.createdAt ? new Date(account.createdAt).toLocaleDateString() : "Current session");
        $("#profileName").val(account.name || "");
        $("#profilePhone").val(account.phone || "");
        $("#profileEmail").val(user.email);
        $("#profileQuoteCount").text(CalixApp.getQuoteItems().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0));
    }

    function renderHistory() {
        const requests = CalixApp.getQuoteRequests().filter((request) => request.accountEmail === user.email || request.customer?.email === user.email);
        const $history = $("#quoteHistory").empty();
        if (!requests.length) {
            $history.html('<p class="text-secondary mb-0">No submitted quote requests yet.</p>');
            return;
        }
        requests.forEach((request) => {
            const itemCount = (request.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
            const permitText = request.permit?.name ? ` · Permit: ${request.permit.name}` : "";
            const orderText = request.order?.reference ? ` · Order: ${request.order.reference}` : "";
            const $item = $(
                '<div class="history-item">' +
                    '<div class="d-flex flex-column flex-sm-row justify-content-between gap-3">' +
                        '<div><strong></strong><p></p></div>' +
                        '<div class="history-actions"><span class="badge text-bg-light"></span><a class="btn btn-sm btn-outline-secondary">Track transaction</a></div>' +
                    '</div>' +
                '</div>'
            );
            $item.find("strong").text(request.reference);
            $item.find(".badge").text(request.status || "Pending Review");
            $item.find("a").attr("href", `Transaction.html?ref=${encodeURIComponent(request.reference)}`);
            const estimateText = Number(request.estimatedTotal) > 0 ? ` · Planning estimate: ${CalixApp.formatCurrency(request.estimatedTotal)}*` : "";
            $item.find("p").text(`${new Date(request.createdAt).toLocaleString()} · ${itemCount} quote item${itemCount === 1 ? "" : "s"}${estimateText}${permitText}${orderText}`);
            $history.append($item);
        });
    }

    $("#profileForm").on("submit", function (event) {
        event.preventDefault();
        const name = $("#profileName").val().trim();
        const phone = $("#profilePhone").val().trim();
        if (!name || (phone && !/^\+?[0-9\s-]{7,15}$/.test(phone))) {
            $("#profileMessage").text("Enter your name and a valid phone number.");
            return;
        }
        const accounts = CalixApp.getAccounts();
        const account = accounts[user.email] || (user.email === "customer" ? { ...getAccount(), password: "customer123" } : getAccount());
        accounts[user.email] = { ...account, name, phone, email: user.email, role: account.role || "Customer", createdAt: account.createdAt || new Date().toISOString() };
        CalixApp.saveAccounts(accounts);
        CalixApp.setCurrentUser({ ...user, name });
        $("#profileMessage").text("Account details saved.");
        renderProfile();
    });

    $("#signOutButton").on("click", function () {
        CalixApp.signOut();
        window.location.href = "calix_landing_page.html";
    });

    renderProfile();
    renderHistory();
});
