import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Show } from "../entities/Show";
import { ILike } from "typeorm";

const showRepository = AppDataSource.getRepository(Show);

export const getShows = async (req: Request, res: Response) => {
    try {
        const { theaterId, title } = req.query;
        const where: any = {};

        if (theaterId) where.theater = { id: parseInt(theaterId as string) };
        if (title) where.title = ILike(`%${title}%`);

        const shows = await showRepository.find({
            where,
            relations: ["theater"]
        });
        res.json(shows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch shows" });
    }
};

export const getShowDetails = async (req: Request, res: Response) => {
    try {
        const show = await showRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["theater", "showtimes"]
        });
        if (!show) return res.status(404).json({ error: "Show not found" });
        res.json(show);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch show details" });
    }
};
