import { config } from "dotenv";

import path from "path";
import mongoose from "mongoose";

config({ path: path.resolve(__dirname, "../config.env") });

import app from "./app";

//handling uncaught error Exception  not define error
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting Down the  server due to uncaught Exception ");

    process.exit(1);
});

const database = `${process.env.DATABASE_URL}`;

mongoose.set("strictQuery", false);

mongoose.connect(database).then(() => {
    console.log("Database connected successfully");
});

const PORT = process.env.PORT || 3000;

const server =app.listen(PORT, (): void => {
    console.log(`server is running on http://localhost:${PORT}`);
});

//unHandle memory leak risk
process.on("warning", (e) => console.warn(e.stack));

//Handle unhandled promise rejection
process.on("unhandledRejection", (err: any) => {
    console.log(`Error ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise rejection")
    server.close(() => {
        process.exit(1);
    });
});
