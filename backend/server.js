const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const redisClient = require("./src/config/redis");
const { isRedisConnected } = redisClient;

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const nasaRoutes = require("./src/routes/nasaRoute");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const { errorHandler } = require("./src/middleware/errorHandler");
const { initializeSocketServer } = require("./src/config/socketServer");

require("./src/jobs/alertScheduler");

const app = express();
const server = http.createServer(app);

/* =========================
   CORS CONFIGURATION
   ========================= */

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL, // Vercel URL
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

/* =========================
   MIDDLEWARES & ROUTES
   ========================= */

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/asteroids", nasaRoutes);

/* =========================
   HEALTH / ROOT
   ========================= */

app.get("/", (req, res) => {
  res.send("CosmicWatch backend is running");
});

/* =========================
   ERROR HANDLER
   ========================= */

app.use(errorHandler);

/* =========================
   SERVER STARTUP
   ========================= */

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
    console.error("MongoDB connection error:", err);
  });
