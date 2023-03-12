import mongoose, { Document, Types, Model } from "mongoose";
import Product from "./productModel";

export interface IReview {
    review: string;
    rating: number;
    createdAt: Date;
    product: Types.ObjectId;
    user: Types.ObjectId;
}

export interface IReviewModel extends IReview, Document {}

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can not be empty!"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },

        product: {
            type: Types.ObjectId,
            ref: "Product",
            required: [true, "Review must belong to a Product."],
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
//prevent duplicate review from save user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

//show the product and user data in review
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "product",
        select: "name",
    }).populate({
        path: "user",
        select: "firstName lastName profilePic",
    });

    next();
});
reviewSchema.statics.calcAverageRating = async function (
    productId: Types.ObjectId
) {
    console.log(productId);
    const stats = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: "$product",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    console.log("🚀 ~ file: reviewModel.ts:88 ~ stats:", stats);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
};

//after data save in database
reviewSchema.post("save", async function (this: any) {
    //this points to current review
    await this.constructor.calcAverageRating(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (this: any, next) {
    this.r = await this.findOne().clone();

    next();
});
reviewSchema.post(/^findOneAnd/, async function (this:any) {
    // await this.findOne(); does NOT work here, query has already executed

    await this.r.constructor.calcAverageRating(this.r.product._id);
});

const Review = mongoose.model<IReviewModel>("Review", reviewSchema);
export default Review;
