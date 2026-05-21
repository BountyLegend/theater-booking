import { Router } from "express";
import { createReservation, cancelReservation, modifyReservation } from "../controllers/ReservationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createReservation);
router.delete("/:id", authenticateToken, cancelReservation);
router.put("/:id", authenticateToken, modifyReservation);

export default router;
