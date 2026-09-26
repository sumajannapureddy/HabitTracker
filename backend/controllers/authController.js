// backend/controllers/authController.js

const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key_here";

// ==============================
// USER REGISTER
// ==============================
exports.register = (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) return res.status(500).json({ error: "Hash failed" });

      db.query(
        "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
        [full_name, email, hashed],
        (err) => {
          if (err) return res.status(500).json({ error: "Registration failed" });

          return res.json({ message: "Registered successfully" });
        }
      );
    });
  });
};


// ==============================
// USER LOGIN
// ==============================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  // ❗❗ IMPORTANT — LOGIN MUST CHECK 'users' TABLE, NOT 'admins'
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const user = rows[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: "Password check failed" });

      if (!match) return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign(
        {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          is_admin: 0
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          is_admin: 0
        }
      });
    });
  });
};
