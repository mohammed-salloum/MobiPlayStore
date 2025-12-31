import jwt from "jsonwebtoken";

// Secret key for signing and verifying JWT tokens
// Ideally, this should be set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * Middleware to protect routes that require authentication.
 * Checks for a valid JWT token in the Authorization header.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function requireAuth(req, res, next) {
  // Get the Authorization header (expected format: "Bearer <token>")
  const auth = req.headers.authorization;

  if (!auth) {
    // If no token is provided, return 401 Unauthorized
    return res.status(401).json({ message: "No token" });
  }

  // Extract token from "Bearer <token>" format
  const token = auth.split(" ")[1];

  try {
    // Verify token and store decoded user info in req.user
    req.user = jwt.verify(token, JWT_SECRET); 
    next(); // Proceed to the next middleware or route handler
  } catch {
    // If token is invalid or expired, return 401 Unauthorized
    res.status(401).json({ message: "Invalid token" });
  }
}
