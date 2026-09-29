import express from "express";

import {
    registerUser,
    loginUser,
    syncFirebaseUser,
    getProfile,
    updateProfile
} from "../controllers/userController.js";

import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();


// Register
userRouter.post("/register", registerUser);


// Login
userRouter.post("/login", loginUser);

// Firebase Sync

userRouter.post("/firebase-sync", syncFirebaseUser);


// Get profile
userRouter.get("/profile", userAuth, getProfile);


// Update profile
userRouter.put("/profile", userAuth, updateProfile);


export default userRouter;