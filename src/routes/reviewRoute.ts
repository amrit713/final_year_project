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

const router = express.Router({ mergeParams: true });// it will merge the route 

router.use(protect);

router
    .route("/")
    .get(getAllReviews)
    .post(restrictTo("user"), setProductUserIds, createReview);

router.route("/:id").get(getReview).patch(restrictTo("user"),updateReview).delete(deleteReview);



export default router;
