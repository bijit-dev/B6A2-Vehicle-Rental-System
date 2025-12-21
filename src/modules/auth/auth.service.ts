
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import envConfigs from "../../config";
import { userServices } from "../Users/users.service";

const signup = async (payLoad: Record<string, unknown>) => {
    const result = await userServices.createUser(payLoad);
    return result;
};

const signin = async (payLoad: Record<string, unknown>) => {
    const { email, password } = payLoad;
    const email_lowerCase = String(email).toLowerCase();
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email_lowerCase,
    ]);

    if (result.rows.length === 0) {
        return { false: true, message: "User not found" };
    }

    const user = result.rows[0];
    const comparePass = await bcrypt.compare(password as string, user.password);

    if (!comparePass) {
        return { success: false, message: "Invalid password" };
    }
    const JWT_SECRET = envConfigs.jwtSecret;

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET as string,
        { expiresIn: "2d" }
    );

    delete user.password;
    return { token, user };
};

export const authService = {
    signup,
    signin,
};
