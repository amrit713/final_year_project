import express from "express";
import {
    getAllReviews,
    getReview,
    updateReview,
    createReview,
    deleteReview,
    setProductUserIds,
} from "../controller/reviewController";
import { protect, restrictTo } from "../middleware/authorizationMiddleware";

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route("/")
    .get(getAllReviews)
    .post(restrictTo("user"), setProductUserIds, createReview);

router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

export default router;
