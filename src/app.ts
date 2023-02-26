import express, { Application } from "express";
import productRouter from "./routes/productRoute";
import UserRouter from "./routes/userRoute";
import globalErrorHandler from "./utils/errorHandler";

const app: Application = express();

app.use(express.json());

app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", UserRouter);

app.use(globalErrorHandler);

export default app;
