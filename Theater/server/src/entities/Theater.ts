import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Show } from "./Show";

@Entity("theaters")
export class Theater {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    location!: string;

    @Column("text")
    description!: string;

    @Column({ nullable: true })
    image_url!: string;

    @OneToMany(() => Show, (show) => show.theater)
    shows!: Show[];
}
