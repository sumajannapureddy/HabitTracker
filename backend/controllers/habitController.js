const db = require("../db");

// ==============================
// ADD HABIT
// ==============================
exports.addHabit = (req, res) => {
  const { user_id, name, category, frequency, start_date, notes } = req.body;

  if (!user_id || !name) {
    return res.status(400).json({ error: "User ID and habit name are required" });
  }

  const sql = `
    INSERT INTO habits (user_id, name, category, frequency, start_date, notes, streak)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(sql, [user_id, name, category, frequency, start_date, notes], (err) => {
    if (err) {
      console.error("ADD HABIT ERROR:", err);
      return res.status(500).json({ error: "Failed to add habit" });
    }

    res.json({ message: "Habit added successfully" });
  });
};

// ==============================
// GET USER HABITS
// ==============================
exports.getHabits = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT *, DATE(start_date) AS start_date, DATE(last_completed) AS last_completed
    FROM habits
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [user_id], (err, habits) => {
    if (err) {
      console.error("GET HABITS ERROR:", err);
      return res.status(500).json({ error: "Failed to fetch habits" });
    }

    res.json(habits);
  });
};

// ==============================
// COMPLETE HABIT (CORRECT STREAK LOGIC)
// ==============================
exports.completeHabit = (req, res) => {
  const habit_id = req.params.id;

  // Step 1 — Get habit data
  db.query("SELECT streak, DATE(last_completed) as last_completed FROM habits WHERE id = ?", [habit_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: "Habit not found" });
    }

    const habit = results[0];
    const today = new Date().toISOString().slice(0, 10);

    let updatedStreak = 1;

    if (habit.last_completed === today) {
      // Already completed today — do NOT increase streak
      return res.json({ message: "Already completed today!" });
    }

    // Check yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (habit.last_completed === yesterday) {
      updatedStreak = habit.streak + 1;
    }

    // Step 2 — Update habit
    const updateSql = `
      UPDATE habits
      SET streak = ?, last_completed = CURDATE()
      WHERE id = ?
    `;

    db.query(updateSql, [updatedStreak, habit_id], (err2) => {
      if (err2) {
        console.error("COMPLETE HABIT ERROR:", err2);
        return res.status(500).json({ error: "Failed to update habit" });
      }

      // Step 3 — Insert log (prevent duplicates)
      const logSql = `
        INSERT INTO habit_logs (habit_id, log_date)
        SELECT ?, CURDATE()
        FROM dual
        WHERE NOT EXISTS (
          SELECT 1 FROM habit_logs WHERE habit_id = ? AND log_date = CURDATE()
        )
      `;

      db.query(logSql, [habit_id, habit_id], () => {
        res.json({ message: "Habit completed today!", streak: updatedStreak });
      });
    });
  });
};

// ==============================
// DELETE HABIT
// ==============================
exports.deleteHabit = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM habits WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("DELETE HABIT ERROR:", err);
      return res.status(500).json({ error: "Failed to delete habit" });
    }

    res.json({ message: "Habit deleted" });
  });
};

// ==============================
// ANALYTICS
// ==============================
exports.analytics = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM habits WHERE user_id = ?) AS total_habits,
      (SELECT COUNT(*) FROM habit_logs hl 
        JOIN habits h ON h.id = hl.habit_id
       WHERE h.user_id = ?
       AND hl.log_date = CURDATE()) AS completed_today,
      (SELECT IFNULL(MAX(streak), 0) FROM habits WHERE user_id = ?) AS best_streak,
      (SELECT IFNULL(SUM(streak), 0) FROM habits WHERE user_id = ?) AS total_streak
  `;

  db.query(sql, [user_id, user_id, user_id, user_id], (err, result) => {
    if (err) {
      console.error("ANALYTICS ERROR:", err);
      return res.status(500).json({ error: "Analytics error" });
    }

    res.json(result[0]);
  });
};

// ==============================
// ADMIN: GET ALL HABITS
// ==============================
exports.getAllHabits = (req, res) => {
  db.query(
    "SELECT * FROM habits ORDER BY id DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};
