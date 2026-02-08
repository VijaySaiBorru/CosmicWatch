const nasaService = require("../controllerservices/nasaService");

exports.getAsteroidFeed = async (req, res) => {
  try {
    let { date, startDate, endDate } = req.query;

    if (date) {
      startDate = date;
      endDate = date;
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Provide either date or startDate & endDate",
      });
    }

    const asteroids =
      await nasaService.fetchAsteroidsByDateRange(
        startDate,
        endDate
      );

    res.status(200).json({
      count: asteroids.length,
      asteroids,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch asteroid data",
      error: err.message,
    });
  }
};

exports.getAsteroidDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const asteroid =
      await nasaService.fetchAsteroidFullDetails(id);

    res.status(200).json(asteroid);
  } catch (err) {
    res.status(404).json({
      message: "Failed to fetch asteroid details",
      error: err.message,
    });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await nasaService.getUserAlerts(req.user);
    res.status(200).json({
      count: alerts.length,
      alerts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
