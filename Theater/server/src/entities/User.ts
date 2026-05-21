import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password_hash!: string;

    @Column({ default: "user" })
    role!: string;

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservations!: Reservation[];

    @CreateDateColumn()
    created_at!: Date;
}
