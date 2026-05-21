import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Show } from "./Show";
import { Seat } from "./Seat";
import { Reservation } from "./Reservation";

@Entity("showtimes")
export class Showtime {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("datetime")
    start_time!: Date;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    hall_name!: string;

    @ManyToOne(() => Show, (show) => show.showtimes)
    show!: Show;

    @OneToMany(() => Seat, (seat) => seat.showtime)
    seats!: Seat[];

    @OneToMany(() => Reservation, (reservation) => reservation.showtime)
    reservations!: Reservation[];
}
