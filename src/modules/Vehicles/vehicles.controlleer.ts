import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const postVehicle = async (req: Request, res: Response) => {
    try {
        const { type, availability_status, daily_rent_price } = req.body;
        const types = ["car", "bike", "van", "SUV"];
        const status = ["available", "booked"];

        if (
            !types.includes(type) ||
            !status.includes(availability_status.toLowerCase()) ||
            daily_rent_price <= 0
        ) {
            res.status(400).json({
                success: false,
                type_error: `types can only be: ${types.join(", ")}`,
                status_error: `status can only be: ${status.join(", ")}`,
                rent_error: "Rent cannot be less then 0 (negetive)!",
            });
            return;
        }

        const result = await vehicleServices.postVehicle(req.body);
        res.status(201).json({
            success: true,
            msg: "Vehicle created successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicles();
        
        if (result.rows.length === 0) {
            res.status(200).json({
            success: true,
            "message": "No vehicles found",
            data: result.rows,
        });
        }
        
        res.status(200).json({
            success: true,
            msg: "All Vehicles Fetched Successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getSingleVehicle(
            req.params.vehicleId as string
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "Vehicle Not Found",
            });
        }
        res.status(200).json({
            success: true,
            msg: "Vehicle Fetched Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.deleteVehicle(
            req.params.vehicleId as string
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                msg: result.msg,
            });
        }

        res.status(200).json({
            success: true,
            msg: "Vehicle deleted Successfully"
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.updateVehicle(
            req.body,
            req.params.vehicleId as string
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "Vehicle Not Found",
            });
        }

        res.status(200).json({
            success: true,
            msg: "Vehicle Updated Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
};

export const vehicleControllers = {
    postVehicle,
    getAllVehicles,
    getSingleVehicle,
    deleteVehicle,
    updateVehicle,
};
