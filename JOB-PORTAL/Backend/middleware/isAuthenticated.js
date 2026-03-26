import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }
    const jwtSecret = process.env.JWT_SECRET || "dev-change-me";
    const decoded = jwt.verify(token, jwtSecret);
    req.id = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default authenticateToken;