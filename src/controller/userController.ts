import { NextFunction, Request, Response, RequestHandler } from "express";

import User from "../model/userModel";
import ApiFeatures from "../utils/ApiFeatures";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { IGetUserAuthInfoRequest } from "../interface/requestInterface";

const filterObj = (obj: any, ...allowedFields: string[]) => {
    let newObj: { [key: string]: string } = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

export const getUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const feature = new ApiFeatures(User.find(), req.query)
            .filter()
            .sort()
            .paginate()
            .limitFields();

        const users = await feature.query;

        res.status(200).json({
            status: "Success",
            result: users.length,
            data: {
                users,
            },
        });
    }
);

export const getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new AppError("No menu found with this id", 404));
        }

        res.status(200).json({
            status: "Success",
            data: {
                user,
            },
        });
    }
);

export const updateMe = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        //!1. Create error if user Post Password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError(
                    "This route not for password updates. Please use / updateMyPassword",
                    400
                )
            );
        }

        //!update user Document

        const filteredBody = filterObj(
            req.body,
            "firstName",
            "lastName",
            "email"
        );

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            filteredBody,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: "success",
            data: {
                user: updatedUser,
            },
        });
    }
);

export const deleteMe = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        await User.findByIdAndUpdate(req.user.id, { active: false });

        res.status(204).json({
            status: "success",
            data: null,
        });
    }
);


export const getMe = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const user = req.user;

        res.status(200).json({
            status: "success",
            user,
        });
    }
);
