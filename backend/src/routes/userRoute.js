const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
    changePassword,
    deleteUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUser);
router.put("/change-password", protect, changePassword);

router.get("/watchlist", protect, getWatchlist);
router.post("/watchlist/:asteroidId", protect, addToWatchlist);
router.delete("/watchlist/:asteroidId", protect, removeFromWatchlist);

module.exports = router;
