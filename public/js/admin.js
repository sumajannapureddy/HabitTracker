async function loadAdminData() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.is_admin !== 1) {
        alert("Admin login required!");
        window.location.href = "/admin/login";
        return;
    }

    // -------------------------
    // LOAD USERS
    // -------------------------
    const usersRes = await fetch(`${window.API}/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const users = await usersRes.json();
    console.log("Users:", users);

    const usersTable = document.getElementById("users-table");
    usersTable.innerHTML = "";

    users.forEach(u => {
        usersTable.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.full_name || u.name}</td>
                <td>${u.email}</td>
                <td><button class="btn secondary" onclick="deleteUser(${u.id})">Delete</button></td>
            </tr>
        `;
    });

    // -------------------------
    // LOAD HABITS
    // -------------------------
    const habitsRes = await fetch(`${window.API}/admin/habits`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const habits = await habitsRes.json();
    console.log("Habits:", habits);

    const habitsTable = document.getElementById("habits-table");
    habitsTable.innerHTML = "";

    habits.forEach(h => {
        habitsTable.innerHTML += `
            <tr>
                <td>${h.id}</td>
                <td>${h.user_id}</td>
                <td>${h.name}</td>
                <td>${h.category}</td>
                <td>${h.streak}</td>
                <td><button class="btn secondary" onclick="deleteHabit(${h.id})">Delete</button></td>
            </tr>
        `;
    });
}

async function deleteUser(id) {
    const token = localStorage.getItem("token");

    await fetch(`${window.API}/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    alert("User deleted.");
    loadAdminData();
}

async function deleteHabit(id) {
    const token = localStorage.getItem("token");

    await fetch(`${window.API}/admin/habits/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    alert("Habit deleted.");
    loadAdminData();
}

loadAdminData();
