const cron = require("node-cron");
const User = require("../models/userModel");
const nasaService = require("../controllerservices/nasaService");
const { sendAlertEmail } = require("../utils/emailService");

cron.schedule("0 */6 * * *", async () => {


  try {
    const users = await User.find();

    for (const user of users) {
      if (!user.watchlist || user.watchlist.length === 0) continue;

      const alerts = await nasaService.getUserAlerts(user);

      for (const alert of alerts) {
        if (!user.alertedAsteroids.includes(alert.asteroidId)) {

          if (user.alertPreferences?.emailNotifications !== false) {
            await sendAlertEmail(user.email, alert);
          }

          user.alertedAsteroids.push(alert.asteroidId);
          await user.save();
        }
      }
    }
  } catch (err) {
    console.error("Scheduler error:", err.message);
  }
});
