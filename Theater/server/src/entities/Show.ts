import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Theater } from "./Theater";
import { Showtime } from "./Showtime";

@Entity("shows")
export class Show {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("text")
    description!: string;

    @Column()
    duration!: number; // in minutes

    @Column()
    category!: string;

    @Column({ nullable: true })
    age_rating!: string;

    @Column({ nullable: true })
    image_url!: string;

    @ManyToOne(() => Theater, (theater) => theater.shows)
    theater!: Theater;

    @OneToMany(() => Showtime, (showtime) => showtime.show)
    showtimes!: Showtime[];
}
