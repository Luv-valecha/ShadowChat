// Imports
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const {fullname , email,password} = req.body;
    try {
        if(!fullname || !email || !password) {
            return res.status(400).json({message : "Fill all the fields"});
        }
        // check for the min password length
        if(password.length < 6) {
            return res.status(400).json({message : "Password can't be less than 6 characthers"});
        }
        // check for the Email ID it it exist already or not
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message : "User already exists with this email ID"});

        // Generate password Hash using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        // new User object
        const newUser = new User({
            fullName : fullname,
            email : email,
            password:hashedPassword,
        });
        

        // validate the newuser
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            // add this newUser to the response
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

    } catch (error) {
        console.log("error in signup controller :",error);
    }
}

export const login=async (req,res)=>{
    // taking email and password from the user
    const { email, password } = req.body;

    try{
        // getting the user with email id 'email'
        const user = await User.findOne({ email });

        // user doesnt exist
        if (!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        // if user exists check for passwd
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // passwd for the email doesnt match
        if (!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        // if everything is correct generate JWT
        generateToken(user._id, res)

        // details send back to the client
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic,    
        })
        // res.status(200).json({
        //     message: "Login successful",
        //     user: {
        //         _id: user._id,
        //         fullName: user.fullName,
        //         email: user.email,
        //         password: user.password, // Not recommended for production, only for testing!
        //     },
        // });
    } catch (error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const logout=(req,res)=>{
    try{
        // deleting the cookie by setting its age as 0ms
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

// updating the profile pic
export const updateProfile = async(req, res) => {
    try{
        // accessing and storing profilePic and userId
        const { profilePic } = req.body;
        const userId = req.user._id;

        // if not provided return an error message
        if (!profilePic){
            return res.status(400).json({message: "Profile pic is required"});
        }

        // if profile pic is provided this will be running
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate( userId, { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch(error){
        console.log("error in update profile", error);
        res.status(500).json({message: "Internal server error"});   
    };
};

export const checkAuth = (req, res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};