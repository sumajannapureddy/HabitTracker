const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "suma2403a51294",  // move to .env later
  database: "habitdb"
});

// Test Connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

module.exports = db;
