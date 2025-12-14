import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUser();
        res.status(200).json({
            success: true,
            message: "Users retrieved Successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
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
                message: "Forbidden! You can only update your own profile.",
            });
        }

        const result = await userServices.updateUser(
            req.body,
            userToUpdate as string
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const loggedInUser = req.user;

        if (!loggedInUser || loggedInUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden! Only admin can delete users.",
            });
        }

        const result = await userServices.deleteUser(req.params.userId as string);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const usersController = {
    getAllUser,
    updateUser,
    deleteUser,
};
