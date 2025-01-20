// Imports
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

import { generateToken } from "../lib/utils.js";

export const signup = async (req,res)=>{
    const {fullname , email,password} = req.body;
    try {

        if(!fullname || !email || !password) {
            return res.status(400).json({message : "Fill all the fields"});
        }
        // check for the min password length
        if(password.length < 6) {
            return res.status(400).json({message : "Passwoed can't be less than 6 characthers"});
        }
        
        // check for the Email ID it it exist already or not
        const user = await User.findOne({email});
        if(user) res.status(400).json({message : "User already exit with this email ID"});

        // Generate password Hash using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        

        // new User object
        const newUser = new User({
            fullName : fullname,
            email : email,
            password:hashedPassword,
        });
        

        // validiate the newuser
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            // add this newUser to the responce
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
            });

            console.log("new user created with Email : ",email)
            
        }
        else{
            res.status(400).json({message : "Invalid user data"});
        }
        //  

    } catch (error) {
        console.log("error in sinup controller :",error);
    }
}

export const login=(req,res)=>{
    res.send("login route");
}

export const logout=(req,res)=>{
    res.send("logout route");
}