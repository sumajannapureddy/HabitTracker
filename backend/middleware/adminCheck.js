const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key_here"; // Move to .env later

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  // No token
  if (!header) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  // Check format: "Bearer <token>"
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(400).json({ error: "Invalid authorization format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // MUST be admin
    if (!decoded.is_admin) {
      return res.status(403).json({ error: "Admin access only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
