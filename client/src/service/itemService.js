const API_URL = 'http://localhost:5000/api/items';

export const itemService = {
  // Récupérer tous les éléments
  async getAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erreur lors de la récupération des données');
    return res.json();
  },

  // Ajouter un nouvel élément
  async create(name) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Erreur lors de la création');
    return res.json();
  }
};