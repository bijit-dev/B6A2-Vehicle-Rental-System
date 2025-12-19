import { pool } from "../../config/db";

const createBooking = async (payLoad: Record<string, unknown>) => {
    const { vehicle_id, customer_id, rent_start_date, rent_end_date } = payLoad;

    const vehicleAvailability = await pool.query(`SELECT vehicle_name, availability_status, daily_rent_price FROM vehicles WHERE id = $1`, [vehicle_id]);

    if (vehicleAvailability.rowCount === 0) {
        return { success: false, msg: "Vehicle not found" };
    }

    const vehicle = vehicleAvailability.rows[0];

    if (vehicle.availability_status !== "available") {
        return { success: false, msg: "Vehicle is not available for booking" };
    }

    const startDate = new Date(rent_start_date as string).getTime();
    const endDate = new Date(rent_end_date as string).getTime();

    if (endDate <= startDate) {
        return {
            success: false,
            msg: "Rent end date must be after rent start date",
        };
    }

    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalRent = vehicle.daily_rent_price * duration;

    const bookingResult = await pool.query(`INSERT INTO bookings (vehicle_id, customer_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
            vehicle_id,
            customer_id,
            rent_start_date,
            rent_end_date,
            totalRent,
            "active",
        ]
    );

    await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
        ["booked", vehicle_id]
    );

    return {
        success: true,
        data: {
            ...bookingResult.rows[0],
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price,
            },
        },
    };
};

const getBookings = async (user: {
    id: number;
    role: "admin" | "customer";
}) => {
    if (user.role === "admin") {
        const result = await pool.query(
            `
            SELECT
                b.id,
                b.customer_id,
                b.vehicle_id,
                TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
                b.total_price,
                b.status,
                json_build_object(
                    'name', u.name,
                    'email', u.email
                ) AS customer,
                json_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number
                ) AS vehicle
            FROM bookings b
            JOIN users u ON u.id = b.customer_id
            JOIN vehicles v ON v.id = b.vehicle_id
            `
        );

        return {
            success: true,
            message: "Bookings retrieved successfully",
            data: result.rows,
        };
    }

    const result = await pool.query(
        `
        SELECT
            b.id,
            b.vehicle_id,
            TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
            TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
            b.total_price,
            b.status,
            json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type
            ) AS vehicle
        FROM bookings b
        JOIN vehicles v ON v.id = b.vehicle_id
        WHERE b.customer_id = $1
        `,
        [user.id]
    );

    return {
        success: true,
        message: "Your bookings retrieved successfully",
        data: result.rows,
    };
};


const updateBooking = async (
    bookingId: string,
    user: any,
    status: "cancelled" | "returned"
) => {
    const bookingRes = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [Number(bookingId)]
    );

    if (bookingRes.rowCount === 0) {
        return { success: false, msg: "Booking not found" };
    }

    const booking = bookingRes.rows[0];

    // CUSTOMER cancelled
    if (user.role === "customer") {
        if (status !== "cancelled") {
            return { success: false, msg: "Invalid action" };
        }

        if (new Date() >= new Date(booking.rent_start_date)) {
            return {
                success: false,
                msg: "Cannot cancel booking after start date",
            };
        }

        const cancelRes = await pool.query(
            `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
            ["cancelled", booking.id]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
            ["available", booking.vehicle_id]
        );

        return {
            success: true,
            message: "Booking cancelled successfully",
            data: cancelRes.rows[0],
        };
    }

    // ADMIN RETURN
    if (user.role === "admin") {
        if (status !== "returned") {
            return { success: false, msg: "Invalid action" };
        }

        const returnRes = await pool.query(
            `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
            ["returned", booking.id]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
            ["available", booking.vehicle_id]
        );

        return {
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: {
                ...returnRes.rows[0],
                vehicle: {
                    availability_status: "available",
                },
            },
        };
    }

    return { success: false, msg: "Unauthorized" };
};


export const bookingService = {
    createBooking,
    getBookings,
    updateBooking,
};
