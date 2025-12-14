import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })


const config ={
    connection_str: process.env.CONNECTION_STR,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT
}

export default config;