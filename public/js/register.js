document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("userRegisterForm");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const full_name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        if (!full_name || !email || !password) {
            alert("All fields required");
            return;
        }

        const success = await registerUser(full_name, email, password);

        if (success) {
            alert("Registered Successfully!");
            window.location.href = "/login";
        }
    });

});
