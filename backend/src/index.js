import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import path from "path";

dotenv.config();

const port = process.env.PORT || 5001;
const __dirname = path.resolve();

// to enable the fetching of the data from json file eg. in auth controller
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
    connectdb();
});
