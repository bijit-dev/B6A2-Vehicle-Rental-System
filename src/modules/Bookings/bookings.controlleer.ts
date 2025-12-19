import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, msg: "You must be logged in" });
        }

        if (req.user.role !== "admin" && req.user.role !== "customer") {
            return res.status(403).json({ success: false, msg: "Forbidden" });
        }

        const result = await bookingService.createBooking(req.body);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                msg: result.msg,
            });
        }

        res.status(201).json({
            success: true,
            msg: "Booking Created successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "You must be logged in",
            });
        }

        const result = await bookingService.getBookings(user);

        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You must be logged in",
            });
        }

        const { status } = req.body;

        const result = await bookingService.updateBooking(
            req.params.bookingId as string,
            req.user,
            status
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.msg,
            });
        }

        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const bookingController = {
    createBooking,
    getBookings,
    updateBooking,
};
