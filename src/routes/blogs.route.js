import express from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js';
import {upload} from '../middleware/multer.middleware.js'
import {
    createBlog,
    getBlogs,
} from '../controllers/blogs.controller.js'

const router = express.Router();

router.route('/newblog')
.post(verifyJWT,upload.single("blogImg"), createBlog)

router.route("/getblogs")
.get(getBlogs)


export default router;