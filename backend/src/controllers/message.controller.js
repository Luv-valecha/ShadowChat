import User from "../models.user.model.js"
import Message from "../models/message.model.js";

export const getUsersForSidebar= async (req,res)=>{
    try {
        const loggedinuserId=req.user._id; 

        //list every user except the current user and return their details except their password
        const userlist= await User.find({id:{$ne: loggedinuserId}}).select("-password");

        res.status(200).json(userlist);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getMessages= async(req,res)=>{
    try {
        const {id:usertoChatid}=req.params;
        const myid=req.user._id;
        
        const messages= await Message.find({
            $or:[
                {senderId:myid, receiverId:usertoChatid},
                {senderId:usertoChatid, receiverId:myid},
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages: ",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const sendMessage= async(req,res)=>{
    try {
        const senderId=req.user._id;
        const {id:receiverId}=req.params;
        const{text,image}=req.body;

        let imageURL;
        if(image){
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });
        await newMessage.save();

        // todo: socket.io

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage: ",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}