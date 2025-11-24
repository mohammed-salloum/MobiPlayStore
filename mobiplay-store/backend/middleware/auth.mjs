import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: "No token" });
  }

  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET); // ✅ يخزن بيانات المستخدم في req.user
    next(); // يكمل إلى الراوت التالي
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
