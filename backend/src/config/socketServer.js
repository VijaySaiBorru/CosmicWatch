const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initializeSocketServer = (server) => {
    io = socketIo(server, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://localhost:5173",
                "https://cosmic-watch-rho.vercel.app",
                process.env.FRONTEND_URL
            ].filter(Boolean),
            credentials: true,
            methods: ["GET", "POST"]
        },
    });

    const GLOBAL_ROOM = "global-chat";
    const onlineUsers = new Map();

    io.on("connection", (socket) => {


        socket.on("join", (data) => {
            try {
                const { token, userName } = data;

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                socket.userId = decoded.id;
                socket.userName = userName || "Anonymous";

                socket.join(GLOBAL_ROOM);

                onlineUsers.set(socket.id, {
                    id: decoded.id,
                    name: socket.userName,
                    socketId: socket.id,
                });

                socket.emit("joined", {
                    message: "Welcome to Cosmic Chat! ",
                    userName: socket.userName,
                });

                socket.to(GLOBAL_ROOM).emit("user_joined", {
                    userName: socket.userName,
                    onlineCount: onlineUsers.size,
                });

                socket.emit("online_count", { count: onlineUsers.size });


            } catch (err) {
                console.error("Authentication error:", err.message);
                socket.emit("error", { message: "Authentication failed" });
                socket.disconnect();
            }
        });

        socket.on("message", (data) => {
            const { text } = data;

            if (!socket.userName) {
                socket.emit("error", { message: "Not authenticated" });
                return;
            }

            if (!text || text.trim().length === 0) {
                return;
            }

            const messageData = {
                id: Date.now() + Math.random(),
                text: text.trim(),
                userName: socket.userName,
                userId: socket.userId,
                timestamp: new Date().toISOString(),
            };

            io.to(GLOBAL_ROOM).emit("message", messageData);


        });

        socket.on("typing", () => {
            if (socket.userName) {
                socket.to(GLOBAL_ROOM).emit("typing", {
                    userName: socket.userName,
                });
            }
        });

        socket.on("stop_typing", () => {
            if (socket.userName) {
                socket.to(GLOBAL_ROOM).emit("stop_typing", {
                    userName: socket.userName,
                });
            }
        });

        socket.on("disconnect", () => {
            if (socket.userName) {


                onlineUsers.delete(socket.id);

                socket.to(GLOBAL_ROOM).emit("user_left", {
                    userName: socket.userName,
                    onlineCount: onlineUsers.size,
                });
            }
        });
    });

    console.log(" Socket.io server initialized (Global Chat Mode)");
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = { initializeSocketServer, getIO };
