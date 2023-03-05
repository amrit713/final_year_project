import express from "express";
import {
    deleteProduct,
    getProduct,
    getAllProducts,
    postProduct,
    updateProduct,
} from "../controller/productController";
import { protect, restrictTo } from "../middleware/authorizationMiddleware";

import reviewRouter from "../routes/reviewRoute"

const router = express.Router();

router.use("/:productId/reviews", reviewRouter)

router
    .route("/")
    .get(getAllProducts)
    .post(protect, restrictTo("admin"), postProduct);

router
    .route("/:id")
    .get(getProduct)
    .patch(protect, restrictTo("admin"), updateProduct)
    .delete(protect, restrictTo("admin"), deleteProduct);



export default router;

