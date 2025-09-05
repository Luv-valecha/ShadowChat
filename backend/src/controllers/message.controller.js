import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
import redisClient from "../lib/redisClient.js";

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
        // --------------------------------------
        // console.log("Got a get req");
        // --------------------------------------
        const { id: usertoChatid } = req.params;
        const { before, limit = 50 } = req.query;

        const myid = req.user._id;
        const cacheKey = `chat:${[myid, usertoChatid].sort().join(':')}`;

        const cached = await redisClient.lRange(cacheKey, 0, -1);
        const oldestCachedMessage = cached.length ? JSON.parse(cached[0]) : null;
        let messages = [];

        if ((cached.length) && (!before || new Date(before) > new Date(oldestCachedMessage?.createdAt))) {
            // --------------------------------------
            console.log("Messages fetched from redis");
            // --------------------------------------
            messages = cached
                .map(JSON.parse)
                .filter(msg => !before || new Date(msg.createdAt) < new Date(before))
                .slice(-Number(limit));
        }
        else {
            // --------------------------------------
            console.log("Messages fetched from db");
            // --------------------------------------
            const query = {
                $or: [
                    { senderId: myid, receiverId: usertoChatid },
                    { senderId: usertoChatid, receiverId: myid },
                ],
            };
            if (before) {
                query.createdAt = { $lt: new Date(before) };
            }
            messages = await Message.find(query).limit(limit);
        }

        if (!cached.length) {
            // --------------------------------------
            // console.log("Messages stored in redis");
            // --------------------------------------
            const pipeline = redisClient.multi();
            messages.forEach(msg => pipeline.rPush(cacheKey, JSON.stringify(msg)));
            pipeline.lTrim(cacheKey, -limit, -1);
            pipeline.expire(cacheKey, 3600);
            await pipeline.exec();
        }

        res.status(200).json(messages);
    } catch (error) {
        // console.log("test3");
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

        const chatKey = `chat:${[senderId, receiverId].sort().join(':')}`;
        await redisClient.rPush(chatKey, JSON.stringify(newMessage));

        await redisClient.lTrim(chatKey, -50, -1);
        await redisClient.expire(chatKey, 3600);

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