import { promisify } from "util";
import { Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

import User from "../model/userModel";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { IGetUserAuthInfoRequest } from "../interface/requestInterface";

export const protect = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        // !1.Getting token and check of it's there;
        let token: string = "";

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        //!2. verification token
        if (!token) {
            return next(
                new AppError(
                    "you are not logged in! Please log in to get access",
                    401
                )
            );
        }

        const secret: Secret = `${process.env.JWT_SECRET}`;

        const decoded = await promisify<string, string, JwtPayload>(
            jwt.verify as any
        )(token, secret);
        console.log(
            "🚀 ~ file: authorizationMiddleware.ts:34 ~ decoded:",
            decoded
        );

        //!3. check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(
                new AppError(
                    "The user belonging to this token no longer exists",
                    404
                )
            );
        }

        //!4. check if user changed password after the token was issued

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            next(
                new AppError(
                    "User recently changed password! Please login in again",
                    401
                )
            );
        }

        req.user = currentUser;

        //!grand Access to protected route
        next();
    }
);

export const restrictTo = (role: string) => {
    const requestResponse = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        if (role !== req.user.role.toLowerCase()) {
            return next(
                new AppError("Permission not to perform this action", 403)
            );
        }

        console.log(
            "🚀 ~ file: authorizationMiddleware.ts:85 ~ restrictTo ~ req:",
            req.user.role.toLowerCase()
        );

        next();
    };

    return requestResponse as any;
};
