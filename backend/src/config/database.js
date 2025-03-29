const { Pool } = require('pg');
const Redis = require('redis');

// PostgreSQL connection pool
const pgPool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting a new client
});

// Redis client
const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Test database connections
const testConnections = async () => {
  try {
    // Test PostgreSQL connection
    const pgResult = await pgPool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');

    // Test Redis connection
    await redisClient.ping();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  pgPool,
  redisClient,
  testConnections,
}; 