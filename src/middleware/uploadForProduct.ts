import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import multer, { FileFilterCallback } from "multer";

import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

const multerStorage = multer.memoryStorage();

const multerFilter = (
    req: Request,
    file: any,
    cb: (arg0: AppError, arg1: boolean) => void
) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("The file you upload is not image type", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

export const uploadProductImages = upload.fields([
    { name: "images", maxCount: 3 },
]);

export const resizeProductImages = catchAsync(
    async (req: any, res: Response, next: NextFunction) => {
        if (!req.files.images) {
            return next();
        }

        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file: any, i: any) => {
                const filename = `product-${Date.now()}-${i + 1}.jpeg`;

                await sharp(file.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/products/${filename}`);

                req.body.images.push(filename);
            })
        );

        next();
    }
);
