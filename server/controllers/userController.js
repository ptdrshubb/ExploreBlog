import fs from "fs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import { adminAuth } from "../configs/firebaseAdmin.js";

// ================= REGISTER =================

export const registerUser = async (req, res) => {
    try {
        return res.json({
            success: false,
            message: "Please register using Firebase authentication"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// ================= FIREBASE SYNC =================

export const syncFirebaseUser = async (req, res) => {
    try {

        const { idToken, name } = req.body;

        if (!idToken) {
            return res.json({
                success: false,
                message: "Firebase ID token is required"
            });
        }

        // Verify Firebase ID token
        const decodedToken =
            await adminAuth.verifyIdToken(idToken);

        // Check email verification
        if (!decodedToken.email_verified) {
            return res.json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email;

        if (!email) {
            return res.json({
                success: false,
                message: "Email not found in Firebase account"
            });
        }

        // Find existing MongoDB user
        let user = await User.findOne({
            email: email.toLowerCase()
        });

        // Create new MongoDB user
        if (!user) {

            user = await User.create({
                name:
                    name ||
                    decodedToken.name ||
                    email.split("@")[0],

                email: email.toLowerCase(),

                firebaseUid: firebaseUid
            });

        } else {

            // Update Firebase UID for existing user
            user.firebaseUid = firebaseUid;

            if (name) {
                user.name = name;
            }

            await user.save();
        }

        // Create your existing project JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: "User authenticated successfully",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });

    } catch (error) {

        console.log("Firebase Sync Error:", error);

        res.json({
            success: false,
            message: error.message
        });

    }
};


// ================= LOGIN =================

export const loginUser = async (req, res) => {
    return res.json({
        success: false,
        message: "Please login using Firebase authentication"
    });
};

// ================= GET PROFILE =================

export const getProfile = async (req, res) => {
    try {

        const user = await User
            .findById(req.userId)
            .select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
};



// ================= UPDATE PROFILE =================

export const updateProfile = async (req, res) => {
    try {

        const { name, bio, profileImage } = req.body || {};

        const user = await User.findById(req.userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // ================= NAME =================

        if (name !== undefined) {
            user.name = name;
        }

        // ================= BIO =================

        if (bio !== undefined) {
            user.bio = bio;
        }

        // ================= IMAGE UPLOAD =================

        if (req.file) {

            const imageFile = req.file;

            const fileBuffer = fs.readFileSync(imageFile.path);

            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: "/profiles"
            });

            // Save permanent ImageKit URL
            user.profileImage = response.url;

            // Delete temporary uploaded file
            try {
                fs.unlinkSync(imageFile.path);
            } catch (error) {
                console.log(
                    "Temporary file delete failed:",
                    error.message
                );
            }

        }
        // ================= IMAGE URL =================
        else if (
            profileImage !== undefined &&
            profileImage.trim() !== ""
        ) {

            user.profileImage = profileImage;

        }

        // ================= SAVE USER =================

        await user.save();

        // ================= RESPONSE =================

        res.json({
            success: true,
            message: "Profile updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });

    } catch (error) {

        console.log("Profile update error:", error);

        res.json({
            success: false,
            message: error.message
        });

    }
};