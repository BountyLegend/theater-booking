import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Showtime } from "./Showtime";
import { Seat } from "./Seat";

@Entity("reservations")
export class Reservation {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.reservations)
    user!: User;

    @ManyToOne(() => Showtime, (showtime) => showtime.reservations)
    showtime!: Showtime;

    @ManyToOne(() => Seat)
    seat!: Seat;

    @Column({ default: "confirmed" })
    status!: string;

    @CreateDateColumn()
    created_at!: Date;
}
