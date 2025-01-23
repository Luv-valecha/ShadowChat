import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

// to enable the fetching of the data from json file eg. in auth controller
app.use(express.json())
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
    connectdb();
});
