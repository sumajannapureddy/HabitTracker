// ========================
//  HABITFLOW — FINAL APP.JS (Index = User Dashboard)
// ========================

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const adminRoutes = require("./routes/adminRoutes");

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "../public"), { index: false }));

// ========================
// FRONTEND ROUTES
// ========================

// WELCOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "welcome.html"));
});

// ROLE SELECT PAGES
app.get("/role/user", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "user-role.html"));
});

app.get("/role/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "admin-login.html"));
});

// USER AUTH
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "register.html"));
});

// ========================
// USER DASHBOARD PAGES
// ========================

// ⭐ HERE — USER DASHBOARD IS index.html (IMPORTANT)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/add-habit", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "add-habit.html"));
});

app.get("/habits", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "habits.html"));
});

app.get("/analytics", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "analytics.html"));
});

// ========================
// ADMIN PAGES
// ========================
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "admin-login.html"));
});

app.get("/admin/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "admin-register.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "admin-dashboard.html"));
});

// ========================
// API ROUTES
// ========================
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);
app.use("/admin", adminRoutes);

// ========================
// START SERVER
// ========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
