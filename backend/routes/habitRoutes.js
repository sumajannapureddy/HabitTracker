const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");

// Add Habit
router.post("/add", habitController.addHabit);

// Delete Habit
router.delete("/delete/:id", habitController.deleteHabit);

// Mark Habit Completed
router.post("/complete/:id", habitController.completeHabit);

// Habit Analytics
router.get("/analytics/:user_id", habitController.analytics);

// Get Habits for a User (KEEP LAST)
router.get("/:user_id", habitController.getHabits);

module.exports = router;
