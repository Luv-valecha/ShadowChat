import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
        email:{
            type: String,
            unique: true,
            required: true,
        },
        fullName:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
            minlenght: 6,
        },
        profilePic:{
            type: String,
            default: "",
        },
        role:{
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {timestamps: true}
);

const User=mongoose.model("User",userSchema);
export default User;