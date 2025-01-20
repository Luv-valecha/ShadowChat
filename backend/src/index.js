import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectdb } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

// to enable the fetching of the data from json file eg. in auth controller
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
    connectdb();
});
