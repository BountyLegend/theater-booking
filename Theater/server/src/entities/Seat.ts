import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Showtime } from "./Showtime";

@Entity("seats")
export class Seat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    row!: string;

    @Column()
    number!: number;

    @Column({ default: false })
    is_reserved!: boolean;

    @ManyToOne(() => Showtime, (showtime) => showtime.seats)
    showtime!: Showtime;
}
