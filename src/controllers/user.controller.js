import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { User } from '../models/user.model.js';

const genrateRefreshAndAccessToken = async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "something went wrong while creating refresh and access token")
    }
}

const register = asyncHandler(async (req,res) =>{
    const {username, email, password}  = req.body;
    if([username,email,password].some((fields) => fields?.trim() === "")){
        throw new ApiError(409, "all fields are required")
    }
    const existUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existUser){
        throw new ApiError(409, "user with email or username already exist")
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "something went wrong");
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register successful")
    );
})

const loginUser = asyncHandler(async (req,res) =>{
    const {username,email, password} = req.body;

    if(!(username || email)){
        throw new ApiError(401, "username or email is required");
    }
    const user = await User.findOne({
        $or : [{username},{email}]
    });
    if(!user) throw new ApiError(401, "user not exist");
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(401, "password is incorrect");
    const {accessToken, refreshToken} = await genrateRefreshAndAccessToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const option = {
        httpOnly : true,
        secure : true,
    }
    return res.status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option).
    json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "user login Successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req,res) =>{
    const user = await User.findOneAndUpdate({_id : req.user._id},{
        $set : {refreshToken : null}
    },{new : true});
    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "user logOut successfully"))
});

const getCurrentUser = asyncHandler(async (req,res) =>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetch successfull!"))
})

export {
    register,
    loginUser,
    logoutUser,
    getCurrentUser
}