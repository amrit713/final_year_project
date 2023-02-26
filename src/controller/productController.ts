import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Product from "../model/productModel";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";

export const getProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const feature = new ApiFeatures(Product.find(), req.query)
            .filter()
            .sort()
            .paginate()
            .limitFields();

        const products = await feature.query;

        res.status(200).json({
            status: "Success",
            result: products.length,
            data: {
                products,
            },
        });
    }
);

export const getProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(
                new AppError(
                    `Product not found with this id ~ ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({
            status: "Success",

            data: {
                product,
            },
        });
    }
);

export const postProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.create(req.body);

        res.status(200).json({
            status: "Success",

            data: {
                product,
            },
        });
    }
);

export const updateProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: "Success",

            data: {
                product,
            },
        });
    }
);

export const deleteProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "Success",

            data: null,
        });
    }
);