import { config } from "dotenv";

import path from "path";
import mongoose from "mongoose";

config({ path: path.resolve(__dirname, "../config.env") });

import app from "./app";

const database = `${process.env.DATABASE_URL}`;

mongoose.set("strictQuery", false);

mongoose.connect(database).then(() => {
    console.log("Database connected successfully");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
    console.log(`server is running on http://localhost:${PORT}`);
});
