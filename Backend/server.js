// Endpoint zdrowia do testu cache hit
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
// server.js

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


const app = express();
app.use(cors());
app.use(express.json());


const DATA_FILE = '/data/items.json';
function loadItems() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}
function saveItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

let items = loadItems();
const instanceId = process.env.INSTANCE_ID || uuidv4();



// GET /items
app.get('/items', (req, res) => {
  items = loadItems();
  res.json(items);
});



// POST /items
app.post('/items', (req, res) => {
  const { name, price, manufacturer, category, description } = req.body;
  if (name && price && manufacturer && category) {
    items.push({ name, price, manufacturer, category, description });
    saveItems(items);
    res.status(201).json({ ok: true });
  } else {
    res.status(400).json({ error: 'Wszystkie pola są wymagane: nazwa, cena, producent, kategoria' });
  }
});

// Usuwanie produktu po indeksie (id = index w tablicy)
app.delete('/items/:id', (req, res) => {
  const idx = parseInt(req.params.id, 10);
  if (!isNaN(idx) && idx >= 0 && idx < items.length) {
    items.splice(idx, 1);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Nie znaleziono produktu' });
  }
});


// GET /stats
app.get('/stats', (req, res) => {
  const count = items.length;
  const manufacturers = [...new Set(items.map(i => i.manufacturer))];
  const categories = [...new Set(items.map(i => i.category))];
  const avgPrice = count > 0 ? (items.reduce((sum, i) => sum + parseFloat(i.price), 0) / count).toFixed(2) : 0;
  res.json({
    count,
    instanceId,
    manufacturers,
    categories,
    avgPrice
  });
});


// Listen on port from ENV or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Backend listening on port ${port}`);
  }
});
