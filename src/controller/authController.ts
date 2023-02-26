import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import User from "../model/userModel";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/email";
import crypto from "crypto";
import { IGetUserAuthInfoRequest } from "../interface/requestInterface";

const signToken = (id: Types.ObjectId) => {
    const secret: Secret = `${process.env.JWT_SECRET}`;
    return jwt.sign(
        {
            id,
        },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

export const signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangeAt: req.body.passwordChangeAt,
        });

        if (!newUser) {
            return next(new AppError("Cannot Create Account ", 400));
        }

        const token = signToken(newUser._id);

        res.status(201).json({
            status: "success",
            token,
            data: {
                user: newUser,
            },
        });
    }
);

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("Please provide email or password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError("Incorrect email or password", 401));
        }

        const token = signToken(user._id);

        res.status(201).json({
            status: "success",
            token,
        });
    }
);

export const forgetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //! 1. get user based on posted email

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(
                new AppError("There is no user with this email id", 404)
            );
        }

        //!generate resetToken random
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        //! send it to user's email
        const resetURL = `${req.protocol}://${req.get(
            "host"
        )}/api/v1/user/resetPassword/${resetToken} `;

        const message = `Forget your password summit a PATCH request with your new password and passwordConfirm to :${resetURL}`;
        try {
            await sendEmail({
                email: user.email,
                subject: "your Password reset Token (valid for 10 min)",
                message: message,
            });

            res.status(200).json({
                status: "success",
                message: "token sent to email",
            });
        } catch (err: any) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new AppError(err.message, 500));
        }
    }
);

//TODO:reset password

export const resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //1. get user based on the token
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: Date.now(),
            },
        });

        //2. if token has not expires and there is user set the new password

        if (!user) {
            return next(new AppError("Token is invalid or has expired", 400));
        }

        // change the password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        await user.save();

        //3. Update changedPasswordAt property for the user
        const date = Date.now() + 10000;
        user.passwordChangeAt = date;

        //4. log the user in send JWT
        const token = signToken(user._id);

        res.status(200).json({
            status: "success",
            token,
        });
    }
);

export const updatePassword = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        // !1. get user from the collection

        const user = await User.findById(req.user.id).select("+password");

        if (
            !(await user.correctPassword(
                req.body.currentPassword,
                user.password
            ))
        ) {
            return next(new AppError("Your current password is wrong.", 401));
        }

        // !if do  update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        const token = signToken(user._id);

        user.password = undefined;

        res.status(200).json({
            status: "success",
            token,
            data: {
                user,
            },
        });
    }
);
