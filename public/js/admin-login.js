document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("adminLoginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("admin-email").value.trim();
        const password = document.getElementById("admin-password").value.trim();

        if (!email || !password) {
            alert("Email & password required");
            return;
        }

        // call adminLogin() from auth.js
        const success = await adminLogin(email, password);

        if (success) {
            alert("Admin login successful!");
            window.location.href = "/admin/dashboard";
        }
    });
});
