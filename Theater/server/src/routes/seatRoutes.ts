import { Router } from "express";
import { getSeatsByShowtime } from "../controllers/SeatController";

const router = Router();

router.get("/", getSeatsByShowtime);

export default router;
