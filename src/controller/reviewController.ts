import { Request, Response, NextFunction } from "express";

import Review from "../model/reviewModel";
import catchAsync from "../utils/catchAsync";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";
import { IGetUserAuthInfoRequest } from "../interface/requestInterface";

export const setProductUserIds = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        if (!req.body.product) req.body.product = req.params.productId;
        if (!req.body.user) req.body.user = req.user.id;

        next();
    }
);

export const getAllReviews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const feature = new ApiFeatures(Review.find(), req.query)
            .filter()
            .sort()
            .paginate()
            .limitFields();

        const reviews = await feature.query;

        res.status(200).json({
            status: "Success",
            result: reviews.length,
            data: {
                reviews,
            },
        });
    }
);

export const getReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new AppError("Review Not found", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                review,
            },
        });
    }
);

export const createReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const review = await Review.create(req.body);
        console.log("🚀 ~ file: reviewController.ts:56 ~ review:", review);

        res.status(201).json({
            status: "success",
            data: {
                review,
            },
        });
    }
);

export const updateReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "Success",

            data: {
                review,
            },
        });
    }
);

export const deleteReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const review = await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "Success",

            data: null,
        });
    }
);
