import mongoose, { model, Schema } from "mongoose";

const commentSchema = new Schema({
    commentUser : {
        type : Schema.Types.ObjectId,
        ref : "BloggerUser"
    },
    commentContents : {
        type : String,
        require : true
    }
},{timestamps : true});

const blogSchema = new Schema({
    title : {
        type : String,
        require : true,
    },
    blogImg : {
        type : String,
        require : true
    },
    blogContent : {
        type : String,
        require : true
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "BloggerUser"
    },
    comments : []
},{timestamps :true});

export const Blogs = model("Blog", blogSchema);