import mongoose, { Schema, Document, Types } from "mongoose";

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

const Review = mongoose.model<IReviewModel>("Review", reviewSchema);
export default Review;
