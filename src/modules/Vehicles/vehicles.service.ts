import { pool } from "../../config/db";

const postVehicle = async (payLoad: Record<string, unknown>) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payLoad;

    const availabilityStatus = String(availability_status).toLocaleLowerCase();

    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
        [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availabilityStatus,
        ]
    );
    return result;
};

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};

const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return result;
};

const deleteVehicle = async (id: string) => {
    const vehicleCheck = await pool.query(
        `SELECT availability_status FROM vehicles WHERE id=$1`,
        [id]
    );

    if (vehicleCheck.rows.length === 0) {
        return { success: false, msg: "Vehicle not found" };
    }

    if (vehicleCheck.rows[0].availability_status.toLowerCase() === "booked") {
        return { success: false, msg: "Cannot delete a booked vehicle" };
    }

    const result = await pool.query(
        `DELETE FROM vehicles WHERE id=$1 RETURNING *`,
        [id]
    );

    return { success: true, data: result.rows[0] };
};

const updateVehicle = async (payLoad: Record<string, unknown>, id: string) => {
    const { vehicle_name, daily_rent_price, availability_status } = payLoad;
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name=$1, daily_rent_price=$2, availability_status=$3 WHERE id=$4 RETURNING *`,
        [vehicle_name, daily_rent_price, String(availability_status).toLowerCase(), id]
    );
    return result;
};

export const vehicleServices = {
    postVehicle,
    getAllVehicles,
    getSingleVehicle,
    deleteVehicle,
    updateVehicle,
};
