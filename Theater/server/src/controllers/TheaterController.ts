import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Theater } from "../entities/Theater";

const theaterRepository = AppDataSource.getRepository(Theater);

export const getAllTheaters = async (req: Request, res: Response) => {
    try {
        const theaters = await theaterRepository.find();
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch theaters" });
    }
};
