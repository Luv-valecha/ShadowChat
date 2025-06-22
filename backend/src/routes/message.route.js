import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js"
import {getUsersForSidebar,getMessages,sendMessage, smart_reply} from "../controllers/message.controller.js"

const router=express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);
router.post("/smart_reply",protectRoute,smart_reply)

export default router;