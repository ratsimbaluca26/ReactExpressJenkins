const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint de santé pour vérifier le conteneur dans Jenkins/Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Express opérationnelle' });
});

// Récupérer la liste des éléments
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM items ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un élément
app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le champ name est requis' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});