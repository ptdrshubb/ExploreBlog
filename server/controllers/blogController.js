import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res)=>{
    try{
        if (!req.body.blog) {
            return res.json({ success: false, message: "Blog data is missing in request" });
        }
        
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);

        const imageFile = req.file;

        // check if all fields are present
        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: "Missing required fields"})
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        // upload image to imageKit
        const response = await imagekit.upload({
            file : fileBuffer,
            fileName : imageFile.originalname,
            folder : "/blogs"
        });

        // optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {quality : 'auto'},  // auto compression
                {format : 'webp'}, // convert to modern format
                {width : '1280'}  // width resizing
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })

        res.json({success: true, message: "Blog Added Succesfully"})

    }
    catch (error){
        res.json({success : false, message : error.message});

    }
};


// Give All Blog list 
export const getAllBlogs = async (req, res)=>{
    try{
        const blogs = await Blog.find({isPublished: true})
        res.json({success: true, blogs})
    }
    catch (error){
        res.json({success : false, message : error.message});
    }
}

// individual blog data 
export const getBlogById = async(req, res)=>{
    try{
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.json({success: false, message: "Blog Not Found"});
        }
        res.json({success : true, blog})
    }catch (error){
        res.json({success : false, message : error.message});
    }
}

// Delete Blog
export const deleteBlogById = async(req, res)=>{
    try{
        const {id} = req.body;
        await Blog.findByIdAndDelete(id);

        // delete all comments associated with the blog
        await Comment.deleteMany({blog: id})

        res.json({success : true, message: "Blog Deleted Succesfully"})
    }catch (error){
        res.json({success : false, message : error.message});
    }
}

// using this function change publish or unpublish
export const togglePublish = async(req, res)=>{
    try{
        const {id} = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog Status Updated"})
    }
    catch (error){
        res.json({success : false, message : error.message});
    }
}

// add Comment
export const addComment = async(req, res)=>{
    try{
        const {blog, name, content } = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: "Comment Added for Review"})
    }
    catch (error){
        res.json({success : false, message : error.message});
    }
}

// for individual blog 
export const getBlogComment = async(req, res)=>{
    try{
        const { blogId } = req.body;
        const comments = await Comment.find({blog : blogId, isApproved : true}).sort({createdAt : -1});
        res.json({success: true, comments})
    }
    catch (error){
        res.json({success : false, message : error.message});
    }
}

export const generateContent = async(req, res) =>{
    try {
        const {prompt} = req.body;
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format')
        res.json({success: true,content})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// Like / Unlike Blog
export const toggleLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json({
                success: false,
                message: "Blog not found"
            });
        }

        const alreadyLiked = blog.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            blog.likes.pull(userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();

        res.json({
            success: true,
            liked: !alreadyLiked,
            likesCount: blog.likes.length
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Bookmark / Remove Bookmark
export const toggleBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json({
                success: false,
                message: "Blog not found"
            });
        }

        const alreadyBookmarked = blog.bookmarks.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyBookmarked) {
            blog.bookmarks.pull(userId);
        } else {
            blog.bookmarks.push(userId);
        }

        await blog.save();

        res.json({
            success: true,
            bookmarked: !alreadyBookmarked,
            message: !alreadyBookmarked
                ? "Blog bookmarked"
                : "Bookmark removed"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Get user's bookmarked blogs
export const getBookmarkedBlogs = async (req, res) => {
    try {
        const userId = req.userId;

        const blogs = await Blog.find({
            bookmarks: userId,
            isPublished: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            blogs
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


