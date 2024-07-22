import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/messages.routes.js';
import userRoutes from './routes/users.routes.js';
import connectDb from './db/db.js';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import { app, server } from './socket/socket.js';
import path from "path"


const PORT = process.env.PORT || 5000;

const __diname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse incoming requests with payload;
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__diname, "/frontend/dist")))

app.get("*", (req, res) => {
    req.sendFile(path.join(__diname, "frontend", "dist", "index.html"))
})


server.listen(PORT, () => {
    connectDb();
    console.log(`Server running on port ${PORT}`)
});