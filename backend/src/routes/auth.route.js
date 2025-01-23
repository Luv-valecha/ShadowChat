import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

// protect route acting as middleware to check the authentication
// updating profile, protectRoute so that only authenticated user can update profile
router.put("/update-profile", protectRoute, updateProfile);

// if user is authenticated they can call the below get function and checkAuth will run after protectRoute checks the if the user is authentic
router.get("/check", protectRoute, checkAuth)

export default router;