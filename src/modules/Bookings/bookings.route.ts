import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { bookingController } from "./bookings.controlleer";

const router = Router();

router.post('/', authMiddleware("admin", "customer"), bookingController.createBooking);
router.get('/', authMiddleware("admin", "customer"), bookingController.getBookings);
router.put('/:bookingId', authMiddleware("admin", "customer"), bookingController.updateBooking);

export const bookingRoute = router;