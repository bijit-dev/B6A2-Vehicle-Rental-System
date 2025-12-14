
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const getAllUser = async () => {
  const result = await pool.query(`SELECT  id, name, email, phone, role FROM users`);
  return result;
};

const updateUser = async (payLoad: Record<string, unknown>, id: string) => {
  const { name, email, password, phone, role } = payLoad;

  const hashedPass = await bcrypt.hash(password as string, 15);

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2,password=$3 ,phone=$4, role=$5 WHERE id=$6 RETURNING *`,
    [name, email, hashedPass, phone, role, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    return { success: false, msg: "Cannot delete user with active bookings" };
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    id,
  ]);

  if (result.rows.length === 0) {
    return { success: false, msg: "User not found" };
  }

  delete result.rows[0].password;

  return { success: true };
};

export const userServices = {
  getAllUser,
  updateUser,
  deleteUser,
};
