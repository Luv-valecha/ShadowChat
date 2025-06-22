import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedinuserId = req.user._id;
        //list every user except the current user and return their details except their password
        const userlist = await User.find({ _id: { $ne: loggedinuserId } }).select("-password");

        res.status(200).json(userlist);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: usertoChatid } = req.params;
        const myid = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myid, receiverId: usertoChatid },
                { senderId: usertoChatid, receiverId: myid },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("test3");
        console.error("Error in getMessages: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        let imageURL;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const smart_reply = async (req, res) => {
    try {
        const { last_message } = req.body;
        // console.log(`last message: ${last_message}`);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `Give me only 3 short, smart, human-like replies to this message:\n"${last_message}".\nReturn just the replies, each on a new line. No intro or explanation.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const text = response.text;
        // console.log(`text received: ${text}`);

        // Parse the Gemini output into a clean array
        const smartReplies = text
            .split(/\n+/)
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 3);

        // console.log(`returning: ${smartReplies}`);

        res.status(200).json({ smartReplies });
    } catch (error) {
        console.error("Gemini smart reply error:", error);
        res.status(500).json({ error: "Failed to generate smart replies" });
    }
}