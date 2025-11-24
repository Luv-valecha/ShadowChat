import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();
console.log(`This is redisurl: ${process.env.REDISURL}`);
const redisClient=createClient({
    url: process.env.REDISURL
});

redisClient.on('error', (err) => {});

(async ()=>{
    await redisClient.connect();
})();

export const safeRedisLRANGE = async (client, key, start = 0, end = -1, fallback = []) => {
  try {
    // 1️⃣ Client missing
    if (!client) return fallback;

    // 2️⃣ Client not connected (node-redis v4)
    if (client.isOpen === false) return fallback;

    // 3️⃣ Client not ready (ioredis)
    if (client.status && client.status !== "ready") return fallback;

    // 4️⃣ Timeout protection (200ms)
    const result = await Promise.race([
      client.lRange(key, start, end),
      new Promise((resolve) => setTimeout(() => resolve(fallback), 200))
    ]);

    return result ?? fallback;
  } catch {
    // 5️⃣ Any error → fallback safely
    return fallback;
  }
};

export default redisClient;