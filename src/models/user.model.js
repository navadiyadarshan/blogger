import mongoose, { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username : {
        type : String,
        require : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    email : {
        type : String,
        require : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password :{
        type : String,
        require : true,
    },
    refreshToken : {
        type : String,
        require : true,   
        default : null,     
    },
    blogs : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Bolgs"
        }
    ]
},{timestamps : true});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn : process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = model("BloggerUser", userSchema);