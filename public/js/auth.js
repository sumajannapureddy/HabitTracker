// ============================
// API BASE URL
// ============================
const API = window.API_URL || "http://localhost:5000";


// ============================
// USER REGISTER
// ============================
async function registerUser(full_name, email, password) {
    try {
        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, password })
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || "Registration failed");
            return false;
        }

        return true;

    } catch (err) {
        console.log("Register error:", err);
        alert("Something went wrong");
        return false;
    }
}



// ============================
// USER LOGIN
// ============================
async function loginUser(email, password) {
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Invalid login");
            return false;
        }

        // Store user session
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return true;

    } catch (err) {
        console.log("Login error:", err);
        alert("Something went wrong");
        return false;
    }
}




// ============================
// ADMIN LOGIN  (CORRECT ROUTE)
// ============================
async function adminLogin(email, password) {
    try {
        const res = await fetch(`${API}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Admin login failed");
            return false;
        }

        // Store admin session separately
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));

        return true;

    } catch (err) {
        console.log("Admin login error:", err);
        alert("Something went wrong");
        return false;
    }
}




// ============================
// LOGOUT (USER)
// ============================
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
}



// ============================
// LOGOUT (ADMIN)
// ============================
function logoutAdmin() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
}
