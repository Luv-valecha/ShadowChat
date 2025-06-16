import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        const roomId = socket.data.room;
        if (roomId) {
            const users = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
                (id) => io.sockets.sockets.get(id)?.data?.user
            ).filter(Boolean);
            io.to(roomId).emit('room-users', users);
        }

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });


    socket.on('join-code-room', (roomId, user) => {
        socket.join(roomId);
        socket.data.user = user;
        socket.data.room = roomId;

        // Let the join and data assignment settle
        setTimeout(() => {
            const users = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
                (id) => io.sockets.sockets.get(id)?.data?.user
            ).filter(Boolean);

            io.to(roomId).emit('room-users', users);
        }, 0);
    });


    socket.on('leave-code-room', () => {
        const roomId = socket.data.room;
        if (roomId) {
            socket.leave(roomId);
            const users = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
                (id) => io.sockets.sockets.get(id)?.data?.user
            ).filter(Boolean);
            io.to(roomId).emit('room-users', users);
        }
    });


    socket.on('code-update', ({ room, code, lang }) => {
        socket.to(room).emit('code-update', { room, code, lang });
    });
})

export function getActiveUserCount() {
    return Object.keys(userSocketMap).length;
}

export { io, app, server };