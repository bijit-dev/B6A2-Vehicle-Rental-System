import { Router } from "express";
import { usersController } from "./users.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();
router.get('/', authMiddleware("admin"), usersController.getAllUser);
router.put('/:userId',authMiddleware("admin", "customer"), usersController.updateUser);
router.delete('/:userId',authMiddleware("admin"), usersController.deleteUser);

export const usersRoute = router;
