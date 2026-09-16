const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/mydatabase',
});

// Création de la table si elle n'existe pas encore
pool.query(`
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => {
  console.log('Table "items" vérifiée/créée avec succès.');
}).catch(err => console.error('Erreur SQL lors de l\'initialisation :', err));

module.exports = pool;