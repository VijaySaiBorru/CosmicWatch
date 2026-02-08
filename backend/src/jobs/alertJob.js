const cron = require("node-cron");
const { getIO } = require("../config/socketServer");
const nasaService = require("../controllerservices/nasaService");
const User = require("../models/userModel");

const startAlertJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const io = getIO();
            const sockets = await io.fetchSockets();

            if (sockets.length === 0) return;



            const connectedUserIds = new Set();
            const socketMap = new Map();

            for (const socket of sockets) {
                if (socket.userId) {
                    connectedUserIds.add(socket.userId);
                    if (!socketMap.has(socket.userId)) {
                        socketMap.set(socket.userId, []);
                    }
                    socketMap.get(socket.userId).push(socket.id);
                }
            }

            if (connectedUserIds.size === 0) return;

            const users = await User.find({
                _id: { $in: Array.from(connectedUserIds) },
            });

            for (const user of users) {
                if (!user.watchlist || user.watchlist.length === 0) continue;

                try {
                    const alerts = await nasaService.getUserAlerts(user);

                    if (alerts && alerts.length > 0) {
                        const userSockets = socketMap.get(user._id.toString());
                        let userUpdated = false;

                        for (const alert of alerts) {
                            if (user.alertedAsteroids && user.alertedAsteroids.includes(alert.asteroidId)) {
                                continue;
                            }

                            if (userSockets) {
                                io.to(userSockets).emit("asteroid_alert", alert);

                            }

                            if (!user.alertedAsteroids) user.alertedAsteroids = [];
                            user.alertedAsteroids.push(alert.asteroidId);
                            userUpdated = true;
                        }

                        if (userUpdated) {
                            await user.save();
                        }
                    }
                } catch (err) {
                    console.error(`[Alert Job] Error processing user ${user._id}:`, err);
                }
            }
        } catch (err) {
            console.error("[Alert Job] Error in alert job:", err);
        }
    });

    // console.log("✅ Alert job scheduled (running every minute)");
};

module.exports = startAlertJob;
