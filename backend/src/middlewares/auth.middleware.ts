import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Access Denied. Authorization Bearer token missing." });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Execute the jsonwebtoken verification algorithm pass
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Bind context to runtime thread memory
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res
      .status(403)
      .json({ error: "Access Denied. Token is invalid or has expired." });
  }
}
