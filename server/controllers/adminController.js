import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from '../models/Comment.js';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: " Invalid Credentials" })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// admin check published or unpublished blog
export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//comments approved or not by admin
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 })
        res.json({ success: true, comments })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}


// dashboard data 
export const getDashboard = async (req, res) => {
    try {

        const recentBlogs = await Blog.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        const blogs = await Blog.countDocuments();

        const comments = await Comment.countDocuments();

        const drafts = await Blog.countDocuments({
            isPublished: false
        });

        // Total likes across all blogs
        const likesResult = await Blog.aggregate([
            {
                $project: {
                    likesCount: {
                        $size: {
                            $ifNull: ["$likes", []]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: "$likesCount"
                    }
                }
            }
        ]);

        // Total bookmarks across all blogs
        const bookmarksResult = await Blog.aggregate([
            {
                $project: {
                    bookmarksCount: {
                        $size: {
                            $ifNull: ["$bookmarks", []]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBookmarks: {
                        $sum: "$bookmarksCount"
                    }
                }
            }
        ]);

        const totalLikes =
            likesResult.length > 0
                ? likesResult[0].totalLikes
                : 0;

        const totalBookmarks =
            bookmarksResult.length > 0
                ? bookmarksResult[0].totalBookmarks
                : 0;

        const dashboardData = {
            blogs,
            comments,
            drafts,
            totalLikes,
            totalBookmarks,
            recentBlogs
        };

        res.json({
            success: true,
            dashboardData
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

// delete or approve comment by id

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment Deleted SuccesFully" })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Comment Approved SuccesFully" })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}