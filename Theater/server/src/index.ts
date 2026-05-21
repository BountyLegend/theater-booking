import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes";
import theaterRoutes from "./routes/theaterRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import seatRoutes from "./routes/seatRoutes";
import { getShows, getShowDetails } from "./controllers/ShowController";
import { getAllTheaters } from "./controllers/TheaterController";
import { getUserReservations } from "./controllers/ReservationController";
import { login, refresh, logout, verifyLoginCode, resendLoginCode } from "./controllers/AuthController";
import { authenticateToken } from "./middleware/authMiddleware";

// ... existing code ...

app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/seats", seatRoutes);
app.post("/api/login", login);
app.post("/api/refresh", refresh);
app.post("/api/logout", logout);
app.post("/api/verify-login-code", verifyLoginCode);
app.post("/api/resend-login-code", resendLoginCode);

// Clean REST endpoints
app.get("/api/shows", getShows);
app.get("/api/shows/:id", getShowDetails);
app.get("/api/theaters", getAllTheaters);
app.get("/api/theatres", getAllTheaters); // Alias
app.get("/api/user/reservations", authenticateToken, getUserReservations);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
