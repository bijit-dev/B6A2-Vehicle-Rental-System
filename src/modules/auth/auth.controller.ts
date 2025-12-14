import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
    try {
        const { role, password } = req.body;
        const roles = ["admin", "customer"];

        if (!roles.includes(role) || password.length < 6) {
            res.status(400).json({
                success: false,
                role_error: `roles can only be -> ${roles.join(",")}`,
                password_error: `password cannot be less than 6 characters`,
            });
            return;
        }

        const result = await authService.signup(req.body);
        res.status(201).json({
            success: true,
            status: 201,
            message: "User registered successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const signin = async (req: Request, res: Response) => {
    try {
        const result = await authService.signin(req.body);

        if (!result.token) {
            return res.status(401).json({
                success: false,
                message: result.message,
            });
        }

        res.status(201).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const authController = {
    signup,
    signin,
};
