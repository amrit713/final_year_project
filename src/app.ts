import express, { Application } from "express";
import productRouter from "./routes/productRoute";
import UserRouter from "./routes/userRoute";
import globalErrorHandler from "./utils/errorHandler";
import { rateLimit } from "express-rate-limit";

const app: Application = express();

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(express.json());

app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", UserRouter);

app.use(globalErrorHandler);

export default app;
