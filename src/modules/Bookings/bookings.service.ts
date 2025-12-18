import { pool } from "../../config/db";

const createBooking = async (payLoad: Record<string, unknown>) => {
    const { vehicle_id, customer_id, rent_start_date, rent_end_date } = payLoad;

    const vehicleAvailability = await pool.query(
        `SELECT vehicle_name, availability_status, daily_rent_price FROM vehicles WHERE id=$1`,
        [vehicle_id]
    );
    const vehicleResult = vehicleAvailability.rows[0];
    console.log(vehicleResult);
    

    if (vehicleResult.availability_status !== "available") {
        return { success: false, msg: "Vehicle is not Avilable For Booking" };
    }

    const startDate = new Date(rent_start_date as string).getTime();
    const endDate = new Date(rent_end_date as string).getTime();
    if (endDate <= startDate) {
        return {
            success: false,
            msg: "Rent end date must be After the rent start date",
        };
    }

    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalRent = vehicleResult.daily_rent_price * duration;

    const result = await pool.query(
        `INSERT INTO bookings(vehicle_id,customer_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [
            vehicle_id,
            customer_id,
            rent_start_date,
            rent_end_date,
            totalRent,
            "active",
        ]
    );

    await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
        "Booked",
        vehicle_id,
    ]);

    return { success: true, data: result };
};

const getBookings = async (user: {
    id: number;
    role: "admin" | "customer";
}) => {
    let result;
    if (user.role === "admin") {
        result = await pool.query(`SELECT * FROM bookings`);
    } else {
        result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [
            user.id,
        ]);
    }
    return result;
};

const updateBooking = async (bookingId: string, user: any) => {
    const getBookings = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
        Number(bookingId),
    ]);
    if (getBookings.rows.length === 0)
        return { success: false, msg: "Booking not found" };
    const bookingResult = getBookings.rows[0];

    if (user.role === "customer") {
        if (new Date() >= new Date(bookingResult.rent_start_date)) {
            return {
                success: false,
                msg: "Cannot cancel booking after start date!!",
            };
        }
        const cancelResult = await pool.query(
            `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
            ["cancelled", Number(bookingId)]
        );

        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
            "available",
            bookingResult.vehicle_id,
        ]);

        return { success: true, data: cancelResult.rows[0] };
    }

    if (user.role === "admin") {
        const adminResult = await pool.query(
            `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
            ["returned", Number(bookingId)]
        );

        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
            "available",
            bookingResult.vehicle_id,
        ]);
        return { success: true, data: adminResult.rows[0] };
    }
    return { success: true, data: bookingResult };
};

export const bookingService = {
    createBooking,
    getBookings,
    updateBooking,
};
