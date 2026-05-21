import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "../database.sqlite"),
    synchronize: true, // Auto-create tables
    logging: false,
    entities: [path.join(__dirname, "./entities/*.{ts,js}")],
    migrations: [],
    subscribers: [],
});
