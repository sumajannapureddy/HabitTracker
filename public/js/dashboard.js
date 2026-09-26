(function () {

  // Use global API from config.js
  const API = window.API || "http://localhost:5000";

  // Get session
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Strong auth check
  if (!user || !token) {
    window.location.href = "/login";
    return;
  }

  // DOM references
  const elTotal = document.getElementById("stats-total");
  const elCompleted = document.getElementById("stats-completed");
  const elBest = document.getElementById("stats-best");
  const elTodayText = document.getElementById("today-habits-text");

  // Helper: format date as YYYY-MM-DD
  function toYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const todayStr = toYMD(new Date());

  // ===============================
  // Load Analytics (with Token)
  // ===============================
  async function loadAnalytics() {
    try {
      const res = await fetch(`${API}/habits/analytics/${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) return;
      const stats = await res.json();

      elTotal.innerText = stats.total_habits ?? 0;
      elCompleted.innerText = stats.completed_today ?? 0;
      elBest.innerText = stats.best_streak ?? 0;
    } catch (err) {
      console.error("Analytics error:", err);
    }
  }

  // ===============================
  // Load Habits (with Token)
  // ===============================
  async function loadHabitsAndRenderToday() {
    try {
      const res = await fetch(`${API}/habits/${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        elTodayText.innerText = "Failed to load habits.";
        return [];
      }

      const habits = await res.json();

      const todays = habits.filter(h => {
        if (!h.start_date) return true;
        const s = String(h.start_date).slice(0, 10);
        return s <= todayStr;
      });

      renderTodayList(todays);
      return habits;

    } catch (err) {
      console.error("Load habits error:", err);
      elTodayText.innerText = "Server error.";
      return [];
    }
  }

  // ===============================
  // Render Today's Habits
  // ===============================
  function renderTodayList(todays) {
    if (!todays || todays.length === 0) {
      elTodayText.innerHTML = "No habits for today.";
      return;
    }

    const container = document.createElement("div");
    container.className = "today-list";

    todays.forEach(h => {
      const card = document.createElement("div");
      card.className = "today-item card";

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
          <div style="flex:1">
            <h3 style="margin:0 0 6px 0;font-size:18px;">${escapeHtml(h.name)}</h3>
            <div style="color:#6b7280;font-size:14px;">${escapeHtml(h.category)} • ${escapeHtml(h.frequency)}</div>
            ${h.notes ? `<div style="color:#7b7b7b;margin-top:6px;font-size:13px;">${escapeHtml(h.notes)}</div>` : ""}
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn primary btn-complete" data-id="${h.id}">✓</button>
            <button class="btn secondary btn-delete" data-id="${h.id}">🗑</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    elTodayText.innerHTML = "";
    elTodayText.appendChild(container);

    // Complete buttons
    document.querySelectorAll(".btn-complete").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Mark completed today?")) return;
        await completeHabit(id);
      });
    });

    // Delete buttons
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Delete habit?")) return;
        await deleteHabit(id);
      });
    });
  }

  // Escape HTML
  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ===============================
  // Complete Habit (POST)
  // ===============================
  async function completeHabit(id) {
    try {
      const res = await fetch(`${API}/habits/complete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      refreshAll();

    } catch (err) {
      console.error("Complete error:", err);
    }
  }

  // ===============================
  // Delete Habit (DELETE)
  // ===============================
  async function deleteHabit(id) {
    try {
      const res = await fetch(`${API}/habits/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      refreshAll();

    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // Refresh dashboard
  async function refreshAll() {
    await Promise.all([loadAnalytics(), loadHabitsAndRenderToday()]);
  }

  // Initial load
  refreshAll();

})();
