import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "dev-access-token-secret";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.status(401).json({ error: "Invalid or expired access token" });
        (req as any).user = user;
        next();
    });
};
