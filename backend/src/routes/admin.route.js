import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { deleteUser, getAllUsers, getmessagesperday, getStats, promoteUser } from "../controllers/admin.controller.js";

const router=express.Router();

router.get("/stats", protectRoute, isAdmin, getStats);
router.get("/perdaymsgs", protectRoute, isAdmin, getmessagesperday);
router.get("/allusers", protectRoute, isAdmin, getAllUsers);
router.delete("/deleteuser/:id", protectRoute, isAdmin, deleteUser);
router.put("/promoteuser/:id",protectRoute, isAdmin, promoteUser);

export default router;