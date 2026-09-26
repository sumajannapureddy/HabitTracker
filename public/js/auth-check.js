function requireLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "/login";
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id; // return user_id
    } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return null;
    }
}
