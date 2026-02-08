const axios = require("axios");
const {redisClient} = require("../config/redis");

const NASA_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const NASA_ID_URL = "https://api.nasa.gov/neo/rest/v1/neo";

const ENTITY_CACHE_TTL = 6 * 60 * 60; // 6 hours independent of day

function getSecondsUntilEOD() {
  const now = new Date();
  const eod = new Date(now);
  eod.setUTCHours(23, 59, 59, 999);
  
  const seconds = Math.floor((eod.getTime() - now.getTime()) / 1000);
  return seconds > 0 ? seconds : 60; // Guarantee at least 1 min
}

function calculateRisk(neo, approach) {
  const missAu = Number(approach.miss_distance.au);
  const diameter =
    neo.estimated_diameter.kilometers.estimated_diameter_max;

  if (
    neo.is_potentially_hazardous_asteroid &&
    missAu < 0.05 &&
    diameter > 0.3
  ) {
    return "HIGH";
  }

  if (missAu < 0.2) {
    return "MEDIUM";
  }

  return "LOW";
}

exports.fetchAsteroidsByDateRange = async (startDate, endDate) => {
  const cacheKey = `neos:range:${startDate}:${endDate}`;


  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // @upstash/redis automatically parses JSON if it detects it, but we can double check
      return typeof cached === 'string' ? JSON.parse(cached) : cached;
    }
  } catch (err) {
    console.warn("Redis range get error:", err.message);
  }


  const response = await axios.get(NASA_FEED_URL, {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: process.env.NASA_API_KEY,
    },
    timeout: 5000,
  });

  const neoMap = response.data.near_earth_objects;
  let asteroids = [];

  for (const date in neoMap) {
    neoMap[date].forEach((neo) => {
      const approach = neo.close_approach_data[0];
      if (!approach) return;

      asteroids.push({
        id: neo.id,
        name: neo.name,
        nasa_jpl_url: neo.nasa_jpl_url,
        app_url: `/asteroid/${neo.id}`,

        absolute_magnitude_h: neo.absolute_magnitude_h,
        diameter_km: {
          min: neo.estimated_diameter.kilometers.estimated_diameter_min,
          max: neo.estimated_diameter.kilometers.estimated_diameter_max,
        },
        velocity: {
          km_s: Number(approach.relative_velocity.kilometers_per_second),
          km_h: Number(approach.relative_velocity.kilometers_per_hour),
        },
        miss_distance: {
          km: Number(approach.miss_distance.kilometers),
          lunar: Number(approach.miss_distance.lunar),
          au: Number(approach.miss_distance.astronomical),
        },
        close_approach_date: approach.close_approach_date,
        orbiting_body: approach.orbiting_body,
        is_hazardous: neo.is_potentially_hazardous_asteroid,
        is_sentry_object: neo.is_sentry_object,
        risk_level: calculateRisk(neo, {
          miss_distance: {
            au: approach.miss_distance.astronomical,
          },
        }),
      });
    });
  }

  // 3. Set Cache (EOD TTL)
  try {
    const ttl = getSecondsUntilEOD();
    // @upstash/redis uses .set(key, value, { ex: seconds })
    await redisClient.set(cacheKey, JSON.stringify(asteroids), { ex: ttl });
  } catch (err) {
    console.warn("Redis range set error:", err.message);
  }

  return asteroids;
};

exports.fetchAsteroidFullDetails = async (asteroidId) => {
  const cacheKey = `asteroid:entity:${asteroidId}`;


  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return typeof cached === 'string' ? JSON.parse(cached) : cached;
    }
  } catch (err) {
    console.warn("Redis get error:", err.message);
  }

  // 2. Fetch from NASA
  const response = await axios.get(`${NASA_ID_URL}/${asteroidId}`, {
    params: { api_key: process.env.NASA_API_KEY },
    timeout: 5000,
  });

  const neo = response.data;
  const now = new Date();

  const closeApproaches = neo.close_approach_data.map((a) => ({
    date: a.close_approach_date,
    velocity: {
      km_s: Number(a.relative_velocity.kilometers_per_second),
      km_h: Number(a.relative_velocity.kilometers_per_hour),
    },
    miss_distance: {
      km: Number(a.miss_distance.kilometers),
      lunar: Number(a.miss_distance.lunar),
      au: Number(a.miss_distance.astronomical),
    },
    orbiting_body: a.orbiting_body,
  }));

  const nowMidnight = new Date();
  nowMidnight.setUTCHours(0, 0, 0, 0);

  const futureApproaches = closeApproaches
    .filter((a) => new Date(a.date) >= nowMidnight)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const result = {
    id: neo.id,
    name: neo.name,
    nasa_jpl_url: neo.nasa_jpl_url,
    app_url: `/asteroid/${neo.id}`,

    is_hazardous: neo.is_potentially_hazardous_asteroid,
    is_sentry_object: neo.is_sentry_object,
    diameter_km: {
      min: neo.estimated_diameter.kilometers.estimated_diameter_min,
      max: neo.estimated_diameter.kilometers.estimated_diameter_max,
    },
    orbital_data: {
      orbit_id: neo.orbital_data.orbit_id,
      epoch_osculation: neo.orbital_data.epoch_osculation,
      eccentricity: Number(neo.orbital_data.eccentricity),
      semi_major_axis: Number(neo.orbital_data.semi_major_axis),
      inclination: Number(neo.orbital_data.inclination),
      ascending_node: Number(neo.orbital_data.ascending_node_longitude),
      perihelion_argument: Number(neo.orbital_data.perihelion_argument),
      mean_anomaly: Number(neo.orbital_data.mean_anomaly),
      mean_motion: Number(neo.orbital_data.mean_motion),
      perihelion_time: neo.orbital_data.perihelion_time,
      aphelion_distance: Number(neo.orbital_data.aphelion_distance),
      perihelion_distance: Number(neo.orbital_data.perihelion_distance),
      period_yr: Number(neo.orbital_data.orbital_period) / 365.25,
    },
    next_close_approach: futureApproaches[0] || null,
    close_approaches: closeApproaches,
    risk_level: futureApproaches[0]
      ? calculateRisk(neo, {
        miss_distance: {
          au: futureApproaches[0].miss_distance.au,
        },
      })
      : "LOW",
    cached_at: new Date().toISOString(),
  };


  try {
    // @upstash/redis uses .set(key, value, { ex: seconds })
    await redisClient.set(cacheKey, JSON.stringify(result), { ex: ENTITY_CACHE_TTL });
  } catch (err) {
    console.warn("Redis set error:", err.message);
  }

  return result;
};

exports.getUserAlerts = async (user) => {
  const now = new Date();

  const {
    daysBeforeApproach,
    maxMissDistanceAU,
    minDiameterKM,
    notifyRiskLevels,
  } = user.alertPreferences;

  const results = await Promise.allSettled(
    user.watchlist.map((id) =>
      exports.fetchAsteroidFullDetails(id)
    )
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((a) => {
      if (!a.next_close_approach) return false;

      const nowMidnight = new Date();
      nowMidnight.setUTCHours(0, 0, 0, 0);
      const daysAway =
        (new Date(a.next_close_approach.date) - nowMidnight) /
        (1000 * 60 * 60 * 24);

      const missAU = a.next_close_approach.miss_distance.au;
      const diameterKM = a.diameter_km.max;

      return (
        daysAway <= daysBeforeApproach &&
        missAU <= maxMissDistanceAU &&
        diameterKM >= minDiameterKM &&
        notifyRiskLevels.includes(a.risk_level)
      );
    })
    .map((a) => ({
      asteroidId: a.id,
      name: a.name,
      risk_level: a.risk_level,
      close_approach_date: a.next_close_approach.date,
      nasa_jpl_url: a.nasa_jpl_url,
      message:
        a.risk_level === "HIGH"
          ? "⚠️ High-risk asteroid approaching Earth"
          : "🔔 Upcoming close approach detected",
    }));
};
