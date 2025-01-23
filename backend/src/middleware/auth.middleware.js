import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute= async(req,res,next)=>{
    try {

        if((!req.cookie) || !(req.cookie.jwt)){
            return res.status(401).json({message: "Unauthorized- no token provided"});
        }

        const token= req.cookie.jwt;
        const decoded= jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Unauthorized- invalid token"});
        }

        const user= await User.findById(decoded.user._id).select("-password");

        if(!user){
            return res.status(401).json({message: "User not found"});
        }

        req.user=user;
        
        next();

    } catch (error) {
        console.error("Error in auth middleware: ",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}