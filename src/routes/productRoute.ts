import express from "express";
import {
    deleteProduct,
    getProduct,
    getAllProducts,
    postProduct,
    updateProduct,
} from "../controller/productController";
import { protect, restrictTo } from "../middleware/authorizationMiddleware";
const router = express.Router();

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
