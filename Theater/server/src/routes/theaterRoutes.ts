import { Router } from "express";
import { getAllTheaters } from "../controllers/TheaterController";
import { getShows, getShowDetails } from "../controllers/ShowController";

const router = Router();

router.get("/", getAllTheaters);
router.get("/shows", getShows);
router.get("/shows/:id", getShowDetails);

export default router;
