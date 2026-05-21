import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("login_verification_codes")
export class LoginVerificationCode {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    email!: string;

    @Column()
    code_hash!: string;

    @Column()
    expires_at!: Date;

    @Column({ default: false })
    used!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}
