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
            unique: [true, "Product is already Listed"],
        },
        description: {
            type: String,
            required: [true, "Product should have a description"],
        },
        images: [String],
        price: {
            type: Number,
            required: [true, "Product should have a price"],
        },
        stock: {
            type: Number,
            default: 1,
            maxLength:[5, "product name cannot exceed 5 characters"]
        },
        brand: {
            type: String,
            required: [true, "Product should have a brand"],
            enum:{
                values:["nike", "adidas", "newbalance", "fila", "puma", "reebok"]
            }
        },
        category: {
            type: String,
            required: [true, "Product should have a category"],
            enum:{
                values:["Running","basketball", "sneakers","training","casual", "formal","sports"]
            }
        },

        ratingsAverage: {
            type: Number,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
            default:1,
            set: (value: number) => Math.round(value * 10) / 10,
        },

        ratingsQuantity: {
            type: Number,
            default: 0,
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

//make search fast
productSchema.index({ price: 1 });

//Virtual populate
productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id", //id of product
    foreignField: "product", //field that present in review
});


const Product = mongoose.model<IProductModel>("Product", productSchema);

export default Product;
