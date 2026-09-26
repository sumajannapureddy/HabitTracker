const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// AUTH
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);

// PROTECTED ROUTES
router.get("/users", adminAuth, adminController.getAllUsers);
router.get("/habits", adminAuth, adminController.getAllHabits);

router.delete("/users/:id", adminAuth, adminController.deleteUser);
router.delete("/habits/:id", adminAuth, adminController.deleteHabit);

module.exports = router;
