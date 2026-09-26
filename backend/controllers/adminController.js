const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key_here";

// REGISTER ADMIN
exports.registerAdmin = (req, res) => {
  const { name, email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], (err, exists) => {
    if (exists?.length > 0)
      return res.status(400).json({ error: "Admin already exists" });

    bcrypt.hash(password, 10, (err, hash) => {
      db.query(
        "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash],
        () => res.json({ message: "Admin registered successfully" })
      );
    });
  });
};

// LOGIN ADMIN
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], (err, result) => {
    if (result.length === 0)
      return res.status(400).json({ error: "Admin not found" });

    const admin = result[0];

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(401).json({ error: "Wrong password" });

      const token = jwt.sign(
        {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          is_admin: 1
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        admin: { id: admin.id, name: admin.name, email: admin.email, is_admin: 1 }
      });
    });
  });
};

// GET USERS
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, full_name, email FROM users", (err, users) => {
    res.json(users);
  });
};

// GET HABITS
exports.getAllHabits = (req, res) => {
  db.query("SELECT * FROM habits", (err, habits) => {
    res.json(habits);
  });
};

// DELETE USER
exports.deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], () =>
    res.json({ message: "User deleted" })
  );
};

// DELETE HABIT
exports.deleteHabit = (req, res) => {
  db.query("DELETE FROM habits WHERE id = ?", [req.params.id], () =>
    res.json({ message: "Habit deleted" })
  );
};
