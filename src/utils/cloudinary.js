import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            folder : "blogs",
            resource_type : 'auto',
        });
        // console.log("file is upload successfull",response.url);
        fs.unlinkSync(localFilePath); // remove locally save temp file 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove locally save temp file 
        return null;
    }
}

export {uploadOnCloudinary};