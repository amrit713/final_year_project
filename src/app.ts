import express, { Application } from "express";

import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean"
import hpp from "hpp";

import productRouter from "./routes/productRoute";
import userRouter from "./routes/userRoute";
import globalErrorHandler from "./utils/errorHandler";
import reviewRouter from "./routes/reviewRoute";

const app: Application = express();

//!GLOBAL MIDDLEWARE
// !Set security http headers
app.use(helmet());

//!Limit requests from same IP Address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour!",
});

app.use("/api", limiter);

//!Body parse, reding data from body into req.body
app.use(express.json({ limit: "10kb" }));

//! data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ! Data sanitization against xss (cross site scripting attack)
// app.use(xss());

//!prevent parameter pollution
app.use(
    hpp({
        whitelist: ["brand"],
    })
);

//!serving static files
// app.use(express.static(`${__dirname}/public`))

// !Routes

app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(globalErrorHandler);

export default app;
