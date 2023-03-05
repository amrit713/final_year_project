import express from "express";

import {
    signup,
    login,
    forgetPassword,
    resetPassword,
    updatePassword,
} from "../controller/authController";
import {
    deleteMe,
    getMe,
    getUser,
    getUsers,
    updateMe,
} from "../controller/userController";
import { protect } from "../middleware/authorizationMiddleware";


const router = express.Router();

router.get("/me", protect, getMe);

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);

router.route("/").get(getUsers);
router.get("/:id", getUser);

router.patch("/updateMe", protect, updateMe);
router.patch("/deleteMe", protect, deleteMe);
router.patch("/updatePassword", protect, updatePassword);

export default router;
