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
            data: result.data?.rows[0],
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

        res.status(200).json({
            success: true,
            msg: "Booking Fetched successfully",
            data: result.rows,
        });
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
                msg: "You must be logged in",
            });
        }

        const result = await bookingService.updateBooking(
            req.params.bookingId as string,
            req.user as any
        );

        if (!result.success) {
            res.status(404).json({
                success: false,
                msg: "Booking Not Found",
            });
        }

        res.status(200).json({
            success: true,
            msg: "Vehicle Fetched Successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

export const bookingController = {
    createBooking,
    getBookings,
    updateBooking,
};
