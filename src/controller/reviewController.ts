import { Request, Response, NextFunction } from "express";

import Review from "../model/reviewModel";
import catchAsync from "../utils/catchAsync";

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
        let filter = {};
        if (req.params.productId) filter = { product: req.params.productId };

        const reviews = await Review.find(filter);

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
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        if (!req.body.product) req.body.product = req.params.productId;
        console.log(
            "🚀 ~ file: reviewController.ts:58 ~ req.body.product:",
            req.body.product
        );

        if (!req.body.user) req.body.user = req.user.id;

        const review = await Review.create(req.body);

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
