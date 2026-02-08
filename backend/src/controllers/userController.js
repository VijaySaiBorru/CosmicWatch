const userService = require("../controllerservices/userService");

exports.getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

exports.updateUserProfile = async (req, res) => {
  const {
    name,
    about,
    alertPreferences,
  } = req.body;

  if (!name && !about && !alertPreferences) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  if (name) req.user.name = name.trim();
  if (about) req.user.about = about.trim();

  if (alertPreferences) {
    if (alertPreferences.daysBeforeApproach !== undefined) {
      req.user.alertPreferences.daysBeforeApproach =
        alertPreferences.daysBeforeApproach;
    }

    if (alertPreferences.maxMissDistanceAU !== undefined) {
      req.user.alertPreferences.maxMissDistanceAU =
        alertPreferences.maxMissDistanceAU;
    }

    if (alertPreferences.minDiameterKM !== undefined) {
      req.user.alertPreferences.minDiameterKM =
        alertPreferences.minDiameterKM;
    }

    if (alertPreferences.notifyRiskLevels !== undefined) {
      req.user.alertPreferences.notifyRiskLevels =
        alertPreferences.notifyRiskLevels;
    }
  }

  await req.user.save();

  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    about: req.user.about,
    watchlist: req.user.watchlist,
    alertPreferences: req.user.alertPreferences,
  });
};

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await userService.getWatchlist(req.user);
    res.status(200).json({ watchlist });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { asteroidId } = req.params;
    const watchlist = await userService.addToWatchlist(
      req.user,
      asteroidId
    );

    res.status(200).json({
      message: "Asteroid added to watchlist",
      watchlist,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { asteroidId } = req.params;
    const watchlist = await userService.removeFromWatchlist(
      req.user,
      asteroidId
    );

    res.status(200).json({
      message: "Asteroid removed from watchlist",
      watchlist,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password incorrect" });
    }

    req.user.password = newPassword;
    await req.user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
