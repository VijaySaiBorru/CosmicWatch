const nasaService = require("./nasaService");

exports.getWatchlist = async (user) => {
  const results = await Promise.allSettled(
    user.watchlist.map((id) =>
      nasaService.fetchAsteroidFullDetails(id)
    )
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
};


exports.addToWatchlist = async (user, asteroidId) => {
  if (user.watchlist.includes(asteroidId)) {
    throw new Error("Asteroid already in watchlist");
  }

  user.watchlist.push(asteroidId);
  await user.save();

  return user.watchlist;
};

exports.removeFromWatchlist = async (user, asteroidId) => {
  if (!user.watchlist.includes(asteroidId)) {
    throw new Error("Asteroid not found in watchlist");
  }

  user.watchlist = user.watchlist.filter(
    (id) => id !== asteroidId
  );

  await user.save();

  return user.watchlist;
};
