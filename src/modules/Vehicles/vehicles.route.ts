import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { vehicleControllers } from "./vehicles.controlleer";

const router = Router();

router.post("/", authMiddleware("admin"), vehicleControllers.postVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/:vehicleId", authMiddleware("admin"), vehicleControllers.updateVehicle);
router.delete("/:vehicleId", authMiddleware("admin"), vehicleControllers.deleteVehicle);


export const vehiclesRoute = router;