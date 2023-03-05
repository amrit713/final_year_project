import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    image: string;
    price: number;
    brand: string;
    stock: number;
    createdAt: Date;
    category: string;
}

export interface IProductModel extends IProduct, Document {}

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product should have a Name"],
        },
        description: {
            type: String,
            required: [true, "Product should have a description"],
        },
        image: [String],
        price: {
            type: Number,
            required: [true, "Product should have a price"],
        },
        stock: {
            type: Number,
            default: 1,
        },
        brand: {
            type: String,
            required: [true, "Product should have a brand"],
        },
        category: {
            type: String,
            required: [true, "Product should have a category"],
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//Virtual populate
productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id", //id of product
    foreignField: "product", //field that present in review
});

const Product = mongoose.model<IProductModel>("Product", productSchema);

export default Product;
