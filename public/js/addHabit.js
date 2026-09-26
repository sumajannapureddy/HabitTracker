document.addEventListener("DOMContentLoaded", () => {

    const user_id = requireLogin();

    const form = document.getElementById("add-habit-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("habit-name").value.trim();
        const category = document.getElementById("habit-category").value;
        const frequency = document.getElementById("habit-frequency").value;
        const start_date = document.getElementById("habit-start-date").value;
        const notes = document.getElementById("habit-notes").value.trim();

        const res = await fetch("/habits/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id,
                name,
                category,
                frequency,
                start_date,
                notes
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed to add habit");
            return;
        }

        alert("Habit added successfully!");
        window.location.href = "/habits";
    });

});
