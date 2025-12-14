import express, { NextFunction, Request, Response } from 'express'
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/auth';
import { usersRoute } from './modules/Users/user.route';
import { authRoute } from './modules/auth/auth.route';

const app = express()
const port = config.port

// parser 
app.use(express.json());
app.use(express.urlencoded());

initDB();



app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World! next level programer')
})

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/auth", authRoute);

// users api
app.use("/api/v1/users", usersRoute);

// vehicles api
// app.use("/api/v1/vehicles", vehiclesRoute);

// bookings api
// app.use("/api/v1/bookings", bookingRoute);

// bookings api
// app.use("/api/v1/auth", authRoute);

app.use((req: Request, res: Response) => {
        res.status(404).json({
            success: false,
            status: 201,
            message: "Route not found",
            // path: req.path,
            path: req.originalUrl,
        })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
