import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Showtime } from "../entities/Showtime";
import { Seat } from "../entities/Seat";

export const getSeatsByShowtime = async (req: Request, res: Response) => {
    const { showtimeId } = req.query;
    if (!showtimeId) return res.status(400).json({ error: "Showtime ID required" });

    const seats = await AppDataSource.getRepository(Seat).find({
        where: { showtime: { id: parseInt(showtimeId as string) } }
    });
    res.json(seats);
};
