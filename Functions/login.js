$(function () {
    "use strict";

    const $login = $("#loginForm");
    const $register = $("#registerForm");
    const $user = $("#user");
    const $password = $("#password");
    const $loginError = $("#loginError");
    const $registerError = $("#registerError");

    const defaultAccount = { name: "CALIX Customer", password: "customer123", role: "Customer", email: "customer" };

    function accountsWithDemo() {
        return { customer: defaultAccount, ...CalixApp.getAccounts() };
    }

    function showRegister(show) {
        $login.prop("hidden", show);
        $("#signupPrompt").prop("hidden", show);
        $register.prop("hidden", !show);
        $("#loginTitle").text(show ? "Create Account" : "Sign In!");
        $("#loginDescription").text(
            show
                ? "Create an account to browse products, request quotations, and manage your transactions."
                : "Browse our products and services, request quotations, and keep your transactions in one simple place."
        );
        $(show ? "#registerName" : "#user").trigger("focus");
    }

    function loginError(message, userInvalid = false, passwordInvalid = false) {
        $loginError.text(message);
        $user.toggleClass("invalid", userInvalid);
        $password.toggleClass("invalid", passwordInvalid);
    }

    $login.on("submit", function (event) {
        event.preventDefault();
        const username = $user.val().trim().toLowerCase();
        const password = $password.val();
        const account = accountsWithDemo()[username];

        if (!username || !password) {
            loginError("Please enter your email/username and password.", !username, !password);
            return;
        }

        if (!account || account.password !== password) {
            loginError("The email/username or password you entered is incorrect.", true, true);
            return;
        }

        const email = account.email || username;
        CalixApp.setCurrentUser({ name: account.name || username, email, role: account.role || "Customer" });

        const returnTo = new URLSearchParams(window.location.search).get("return");
        window.location.href = returnTo && /^[A-Za-z0-9_./-]+\.html(?:\?.*)?$/.test(returnTo) ? returnTo : "calix_landing_page.html";
    });

    $register.on("submit", function (event) {
        event.preventDefault();
        const name = $("#registerName").val().trim();
        const email = $("#registerEmail").val().trim().toLowerCase();
        const password = $("#registerPassword").val();
        const confirmPassword = $("#confirmPassword").val();
        const accounts = accountsWithDemo();

        if (!name || !CalixApp.isValidEmail(email)) {
            $registerError.text("Enter your full name and a valid email address.");
            $(name ? "#registerEmail" : "#registerName").addClass("invalid").trigger("focus");
            return;
        }

        if (accounts[email]) {
            $registerError.text("An account with this email already exists.");
            $("#registerEmail").addClass("invalid").trigger("focus");
            return;
        }

        if (password.length < 8) {
            $registerError.text("Your password must be at least 8 characters.");
            $("#registerPassword").addClass("invalid").trigger("focus");
            return;
        }

        if (password !== confirmPassword) {
            $registerError.text("The passwords do not match.");
            $("#confirmPassword").addClass("invalid").trigger("focus");
            return;
        }

        const savedAccounts = CalixApp.getAccounts();
        savedAccounts[email] = { name, email, password, role: "Customer", phone: "", createdAt: new Date().toISOString() };
        CalixApp.saveAccounts(savedAccounts);
        this.reset();
        showRegister(false);
        $user.val(email);
        $loginError.text("Account created. Sign in with your new account.");
    });

    $login.on("input", () => loginError(""));
    $register.on("input", function () {
        $registerError.text("");
        $(this).find(".invalid").removeClass("invalid");
    });

    $("#togglePassword").on("click", function () {
        const show = $password.attr("type") === "password";
        $password.attr("type", show ? "text" : "password");
        $(this)
            .attr("aria-label", show ? "Hide password" : "Show password")
            .find("i")
            .attr("class", show ? "bi bi-eye-slash" : "bi bi-eye");
    });

    $("#createAccountButton").on("click", () => showRegister(true));
    $("#backToLoginButton").on("click", () => showRegister(false));
});
