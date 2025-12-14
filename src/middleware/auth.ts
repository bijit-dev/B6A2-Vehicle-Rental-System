import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import envConfigs from "../config";

const authMiddleware = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization;
            if (!token) {
                return res
                    .status(401)
                    .json({ message: "No TOKEN!!! You are not allowed!!" });
            }

            if (token.startsWith("Bearer ")) {
                token = token.split(" ")[1];
            }

            const decoded = jwt.verify(
                token as string,
                envConfigs.jwtSecret as string
            ) as {
                id: number;
                name: string;
                email: string;
                role: "admin" | "customer";
            };
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    error: "unauthorized!!!",
                });
            }

            next();
        } catch (err: any) {
            res.status(401).json({
                success: false,
                msg: err.message,
            });
        }
    };
};

export default authMiddleware;