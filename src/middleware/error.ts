import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}:${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const message = `Duplicate field ${err.keyValue.name} : please use another value.`;

    return new AppError(message, 401);
};

const handleJWTError = () => {
    return new AppError(`Invalid token. Please LogIn again!`, 401);
};

const handleTokenExpireError = () => {
    return new AppError("Token has Expire. Please login again!!", 401);
};


const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    //wrong mongodb Error
    if (err.name === "CastError") err = handleCastErrorDB(err);

    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleTokenExpireError();


    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

export default errorHandler;
