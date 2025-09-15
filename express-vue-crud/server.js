const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors()); 
app.use(express.json()); // parse
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend

let items = [
  { id: 1, name: 'First item from my server' },
  { id: 2, name: 'Another cool item' },
  { id: 3, name: 'Learning Vue is fun!' }
];

const nextId = () => (items.length ? Math.max(...items.map(i => i.id)) + 1 : 1);



app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET one by their id
app.get('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST or create
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  const item = { id: nextId(), name };
  items.push(item);
  res.status(201).json(item);
});

// PUT or update
app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  items[idx].name = name;
  res.json(items[idx]);
});

// dELETE
app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const removed = items.splice(idx, 1)[0];
  res.json(removed);
});

// fallback etc idk how this works
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
