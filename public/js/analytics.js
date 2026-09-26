document.addEventListener("DOMContentLoaded", () => {

    const API = window.API || "http://localhost:5000";

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "/login";
        return;
    }

    const elTotal = document.getElementById("a-total");
    const elToday = document.getElementById("a-today");
    const elBest = document.getElementById("a-best");

    async function loadAnalytics() {
        try {
            const res = await fetch(`${API}/habits/analytics/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Analytics error:", data);
                return;
            }

            elTotal.innerText = data.total_habits ?? 0;
            elToday.innerText = data.completed_today ?? 0;
            elBest.innerText = data.best_streak ?? 0;

        } catch (err) {
            console.error("Error loading analytics:", err);
        }
    }

    loadAnalytics();
});
