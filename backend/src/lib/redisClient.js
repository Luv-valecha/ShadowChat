import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();
console.log(`This is redisurl: ${process.env.REDISURL}`);
const redisClient=createClient({
    url: process.env.REDISURL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async ()=>{
    await redisClient.connect();
})();

export default redisClient;