import express from "express";
import {
    deleteProduct,
    getProduct,
    getAllProducts,
    postProduct,
    updateProduct,
} from "../controller/productController";
import { protect, restrictTo } from "../middleware/authorizationMiddleware";

import { uploadProductImages,  resizeProductImages
 } from "../middleware/uploadForProduct";

import reviewRouter from "../routes/reviewRoute"

const router = express.Router();

router.use("/:productId/reviews", reviewRouter)

router
    .route("/")
    .get(getAllProducts)
    .post(protect, restrictTo("user"),uploadProductImages, resizeProductImages, postProduct);

router
    .route("/:id")
    .get(getProduct)
    .patch(protect, restrictTo("admin"),uploadProductImages, resizeProductImages, updateProduct)
    .delete(protect, restrictTo("user"), deleteProduct);



export default router;

