import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import {getActiveUserCount} from "../lib/socket.js";

export const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        
        const messageCount = await Message.countDocuments();

        const activeUsers = await getActiveUserCount();

        res.status(200).json({
            userCount,
            messageCount,
            activeUsers
        });
    } catch (error) {
        console.error("Error in getStats: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getmessagesperday = async (req, res) => {
    try {
        const result = await Message.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getMessagesPerDay: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const promoteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: "User is already an admin" });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: "User promoted to admin successfully" });
    } catch (error) {
        console.error("Error in promoteUser: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}