import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const instanceId = process.env.INSTANCE_ID || uuidv4();
const POSTGRES_USER = process.env.POSTGRES_USER || 'products';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_DB = process.env.POSTGRES_DB || 'products';
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'db';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const REDIS_HOST = process.env.REDIS_HOST || 'cache';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const APP_PORT = process.env.APP_PORT || 80;

const { Pool } = pkg;
const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
});

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});
let cacheHits = 0;
redisClient.connect().catch(console.error);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/items
app.get('/api/items', async (req, res) => {
  try {
    const cacheKey = 'items';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      cacheHits++;
      return res.json(JSON.parse(cached));
    }
    const { rows } = await pool.query('SELECT id, name, price FROM products ORDER BY id');
    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 30 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items
app.post('/api/items', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Wymagane pola: name, price' });
  }
  try {
    await pool.query('INSERT INTO products (name, price) VALUES ($1, $2)', [name, price]);
    await redisClient.del('items'); // Invalidate cache
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM products');
    res.json({
      count: parseInt(rows[0].count, 10),
      cache_hits: cacheHits,
      instanceId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ensure table exists
async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0
  )`);
}
ensureTable();

const port = APP_PORT;
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Backend listening on port ${port}`);
  }
});
