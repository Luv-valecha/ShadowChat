import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized- no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized- invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isAdmin = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;

        // although protectRoute already checks for user, we can keep this check here for clarity
        if (!token) {
            return res.status(401).json({ message: "Unauthorized- no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized- invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden- Admins only" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in isAdmin middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}