import { Request, Response } from "express";
import { userServices } from "./users.service";

const createUser = async (req: Request, res: Response) => {
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

        const result = await userServices.createUser(req.body);
        res.status(201).json({
            success: true,
            msg: "User Created successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUser();
        res.status(200).json({
            success: true,
            msg: "All Users Fetched Successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const loggedInUser = req.user;
        if (
            loggedInUser?.role !== "admin" &&
            loggedInUser?.id !== Number(req.params.userId)
        ) {
            return res.status(403).json({
                success: false,
                msg: "Forbidden! You can only view your own profile.",
            });
        }

        const result = await userServices.getSingleUser(
            req.params.userId as string
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "User Not Found",
            });
        }
        res.status(200).json({
            success: true,
            msg: "User Fetched Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const loggedInUser = req.user;
        const userToUpdate = req.params.userId;

        if (loggedInUser?.role === "customer" && loggedInUser.id != Number(userToUpdate)) {
            return res.status(403).json({
                success: false,
                msg: "Forbidden! You can only update your own profile.",
            });
        }

        const result = await userServices.updateUser(
            req.body,
            userToUpdate as string
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "User Not Found",
            });
        }

        res.status(200).json({
            success: true,
            msg: "User Updated Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const loggedInUser = req.user;

        if (!loggedInUser || loggedInUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                msg: "Forbidden! Only admin can delete users.",
            });
        }

        const result = await userServices.deleteUser(req.params.userId as string);

        if (!result.success) {
            res.status(400).json({
                success: false,
                msg: result.msg,
            });
        }

        res.status(200).json({
            success: true,
            msg: "User Deleted Successfully",
            data: result.data,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

export const usersController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
};