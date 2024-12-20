import { asyncHandler } from "../utils/asyncHandler.js";
import {Blogs} from '../models/blogs.model.js';
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req,res) =>{
    const user = req.user;
    const {title,blogContent} = req.body;
    if(!title || !blogContent) throw new ApiError(400,"title and blog connent is required");

    const blogImgLocalPath = req.file?.path;
    if(!blogImgLocalPath) throw new ApiError(400, "blog img is required");
    const bImg = await uploadOnCloudinary(blogImgLocalPath);
    if(!bImg) throw new ApiError(400, "img is not uploaded please check internet");
    const createBlog = await Blogs.create({
        title,
        blogImg : bImg.secure_url,
        blogContent,
        createdBy : new mongoose.Types.ObjectId(user._id),
    })
    
    return res.status(201).json(
        new ApiResponse(200, createBlog, "user register successfully")
    );
});
const getBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const allBlogs = await Blogs.find({})
            .skip(skip)
            .limit(limit)
            .exec();

        return res.status(200).json(
            new ApiResponse(200, allBlogs, "data sent successfully")
        );
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
})
export {
    createBlog,
    getBlogs,
}