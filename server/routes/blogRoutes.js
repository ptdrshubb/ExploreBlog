import express from "express";
import {
    addBlog,
    addComment,
    deleteBlogById,
    generateContent,
    getAllBlogs,
    getBlogById,
    getBlogComment,
    togglePublish,
    toggleLike,
    toggleBookmark,
    getBookmarkedBlogs
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import userAuth from "../middleware/userAuth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComment);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post('/generate', auth, generateContent);
// User Like / Bookmark
blogRouter.post("/:blogId/like", userAuth, toggleLike);
blogRouter.post("/:blogId/bookmark", userAuth, toggleBookmark);

// User Bookmarked Blogs
blogRouter.get("/bookmarks", userAuth, getBookmarkedBlogs);

blogRouter.get("/:blogId", getBlogById);
export default blogRouter;