import { Pool } from 'pg';
import config from ".";

// DB
export const pool = new Pool({
    connectionString: `${config.connection_str}`,
  ssl: { rejectUnauthorized: false },
})

const initDB = async () => {
    try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(11) NOT NULL,
    role VARCHAR(20) NOT NULL
    );`);

        // vehicles
    await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    daily_rent_price INT NOT NULL,
    availability_status VARCHAR(20) NOT NULL
    );`);

        // bookings
    await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    rent_end_date TIMESTAMP NOT NULL,
    total_price INT NOT NULL,
    status VARCHAR(15) NOT NULL
    );`);
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
};

export default initDB