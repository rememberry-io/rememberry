import Redis from "ioredis-rejson";

const redis = new Redis({
  host: "127.0.0.1",
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

export async function invalidateValue(key: string) {
  redis.json_del(key);
}

export async function cacheValue(key: string, value: object, timeToLive = 0) {
  redis.json_set(key, ".", value);
  if (timeToLive !== 0) {
    redis.expire(key, timeToLive);
  }
}

export async function readCache(key: string): Promise<object | null> {
  const res = redis.json_get(key);
  return res;
}
