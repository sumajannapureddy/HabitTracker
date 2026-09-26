// Strong authentication check
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!user || !token) {
  window.location.href = "/login";
}

// Escape HTML (avoid XSS)
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadHabits() {
  try {
    const res = await fetch(`${API}/habits/${user.id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const habits = await res.json();

    const list = document.getElementById("habits-list");
    const empty = document.getElementById("empty-message");

    if (!habits || habits.length === 0) {
      empty.style.display = "block";
      return;
    }

    list.innerHTML = "";

    habits.forEach((h) => {
      const card = document.createElement("div");
      card.className = "habit-card";

      card.innerHTML = `
        <h3>${escapeHtml(h.name)}</h3>
        <p>Category: ${escapeHtml(h.category)}</p>
        <p>Frequency: ${escapeHtml(h.frequency)}</p>

        <button class="btn primary" data-id="${h.id}" onclick="completeHabit(${h.id})">
          Complete
        </button>

        <button class="btn secondary" data-id="${h.id}" onclick="deleteHabit(${h.id})">
          Delete
        </button>
      `;

      list.appendChild(card);
    });
  } catch (err) {
    console.error("Load Habits Error:", err);
    alert("Unable to load habits.");
  }
}

async function deleteHabit(id) {
  if (!confirm("Delete this habit?")) return;

  try {
    const res = await fetch(`${API}/habits/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    alert("Habit deleted");
    window.location.reload();

  } catch (err) {
    console.error("Delete Error:", err);
    alert("Error deleting habit.");
  }
}

async function completeHabit(id) {
  if (!confirm("Mark as completed today?")) return;

  try {
    const res = await fetch(`${API}/habits/complete/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    alert("Habit marked as completed!");
    window.location.reload();

  } catch (err) {
    console.error("Complete Error:", err);
    alert("Error marking habit.");
  }
}

loadHabits();
