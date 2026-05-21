import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Reservation } from "../entities/Reservation";
import { Showtime } from "../entities/Showtime";
import { Seat } from "../entities/Seat";

export const createReservation = async (req: Request, res: Response) => {
    const { showtimeId, seatId } = req.body;
    const userId = (req as any).user.userId;

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const showtime = await transactionalEntityManager.findOne(Showtime, { where: { id: showtimeId } });
        const seat = await transactionalEntityManager.findOne(Seat, { where: { id: seatId, showtime: { id: showtimeId } }, relations: ["showtime"] });

        if (!showtime || !seat) return res.status(404).json({ error: "Showtime or seat not found" });
        if (seat.is_reserved) return res.status(400).json({ error: "Seat already reserved" });

        seat.is_reserved = true;
        await transactionalEntityManager.save(seat);

        const reservation = transactionalEntityManager.create(Reservation, {
            user: { id: userId } as any,
            showtime,
            seat,
            status: "confirmed"
        });

        await transactionalEntityManager.save(reservation);
        res.status(201).json({ message: "Reservation confirmed!", reservation });
    }).catch(error => {
        res.status(500).json({ error: "Failed to create reservation", details: error.message });
    });
};

export const getUserReservations = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const reservations = await AppDataSource.getRepository(Reservation).find({
        where: { user: { id: userId } },
        relations: ["showtime", "showtime.show", "showtime.show.theater", "seat"],
        order: { showtime: { start_time: "ASC" } }
    });
    res.json(reservations);
};

export const cancelReservation = async (req: Request, res: Response) => {
    console.log("DELETE HIT");
    console.log("params:", req.params);
    console.log("user:", (req as any).user);
    
    const { id } = req.params;
    const userId = (req as any).user.userId;

    try {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const reservation = await transactionalEntityManager.findOne(Reservation, { where: { id: parseInt(id) }, relations: ["user", "seat"] });

            if (!reservation) {
                console.log("Reservation not found for id:", id);
                return res.status(404).json({ error: "Reservation not found" });
            }
            if (reservation.user.id !== userId) {
                console.log("Unauthorized attempt to cancel reservation by user:", userId);
                return res.status(403).json({ error: "Unauthorized" });
            }

            reservation.seat.is_reserved = false;
            await transactionalEntityManager.save(reservation.seat);
            await transactionalEntityManager.remove(reservation);

            console.log("Reservation cancelled successfully for id:", id);
            return res.status(200).json({ message: "Reservation cancelled successfully" });
        });
    } catch (error: any) {
        console.error("Error cancelling reservation:", error);
        return res.status(500).json({ error: "Failed to cancel reservation", details: error.message });
    }
};

export const modifyReservation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { newSeatId } = req.body; // Simplified for seat change only
    const userId = (req as any).user.userId;

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const reservation = await transactionalEntityManager.findOne(Reservation, { where: { id: parseInt(id) }, relations: ["user", "seat", "showtime"] });

        if (!reservation) return res.status(404).json({ error: "Reservation not found" });
        if (reservation.user.id !== userId) return res.status(403).json({ error: "Unauthorized" });

        const newSeat = await transactionalEntityManager.findOne(Seat, { where: { id: newSeatId, showtime: { id: reservation.showtime.id } } });
        if (!newSeat || newSeat.is_reserved) return res.status(400).json({ error: "New seat unavailable" });

        reservation.seat.is_reserved = false;
        await transactionalEntityManager.save(reservation.seat);

        newSeat.is_reserved = true;
        await transactionalEntityManager.save(newSeat);

        reservation.seat = newSeat;
        await transactionalEntityManager.save(reservation);

        res.json({ message: "Reservation updated successfully", reservation });
    }).catch(error => {
        res.status(500).json({ error: "Failed to modify reservation" });
    });
};
