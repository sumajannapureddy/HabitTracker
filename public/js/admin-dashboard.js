const adminToken = localStorage.getItem("admin_token");

// LOAD USERS
async function loadUsers() {
    const res = await fetch(`${API}/admin/users`, {
        headers: { "Authorization": `Bearer ${adminToken}` }
    });

    const data = await res.json();
    const table = document.getElementById("users-table");
    table.innerHTML = "";

    data.forEach(user => {
        table.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td><button class="btn-del" onclick="deleteUser(${user.id})">Delete</button></td>
            </tr>
        `;
    });
}

// LOAD HABITS
async function loadHabits() {
    const res = await fetch(`${API}/admin/habits`, {
        headers: { "Authorization": `Bearer ${adminToken}` }
    });

    const data = await res.json();
    const table = document.getElementById("habits-table");
    table.innerHTML = "";

    data.forEach(h => {
        table.innerHTML += `
            <tr>
                <td>${h.id}</td>
                <td>${h.user_id}</td>
                <td>${h.name}</td>
                <td>${h.category}</td>
                <td>${h.streak}</td>
                <td><button class="btn-del" onclick="deleteHabit(${h.id})">Delete</button></td>
            </tr>
        `;
    });
}

// DELETE USER
async function deleteUser(id) {
    if (!confirm("Delete user?")) return;

    await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
    });

    loadUsers();
}

// DELETE HABIT
async function deleteHabit(id) {
    if (!confirm("Delete habit?")) return;

    await fetch(`${API}/admin/habits/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
    });

    loadHabits();
}

loadUsers();
loadHabits();
