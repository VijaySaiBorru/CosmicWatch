const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { redisClient, isRedisConnected } = require("./src/config/redis");
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const nasaRoutes = require("./src/routes/nasaRoute");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const { errorHandler } = require("./src/middleware/errorHandler");
const { initializeSocketServer } = require("./src/config/socketServer");
require("./src/jobs/alertScheduler");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/asteroids", nasaRoutes);

app.get("/", (req, res) => {
  res.send("CosmicWatch backend is running ");
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("MongoDB connected");

    const redisOk = await isRedisConnected();
    console.log(
      redisOk
        ? "Redis connected (Upstash REST)"
        : "Redis NOT reachable"
    );

    initializeSocketServer(server);

    const startAlertJob = require("./src/jobs/alertJob");
    startAlertJob();

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

