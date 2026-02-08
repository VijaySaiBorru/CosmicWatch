const { Redis } = require("@upstash/redis");

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


async function isRedisConnected() {
  try {
    const res = await redisClient.ping();
    return res === "PONG";
  } catch (err) {
    return false;
  }
}

module.exports = {
  redisClient,
  isRedisConnected,
};
