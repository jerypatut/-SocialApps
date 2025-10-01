import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis reconnect attempt: ${retries}`);
      return Math.min(retries * 100, 3000);
    },
  },
});

client.on("connect", () => {
  console.log("✅ Connected to Redis");
});

client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

// Jangan FLUSHALL di production ❌
(async () => {
  try {
    await client.connect();

    if (process.env.NODE_ENV === "production") {
      await client.flushAll();
      console.log("🧹 Redis cache flushed (dev only)");
    }
  } catch (err) {
    console.error("❌ Failed to connect Redis:", err);
  }
})();

export default client;
