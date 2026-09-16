import { useEffect, useState } from 'react';
import { itemService } from './services/itemService';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const loadItems = async () => {
    try {
      const data = await itemService.getAll();
      setItems(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await itemService.create(input);
      setInput('');
      loadItems();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gestionnaire d'éléments</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input 
          type="text"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Entrer un nom..." 
          style={{ flex: 1, padding: '8px 12px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}>
          Ajouter
        </button>
      </form>

      <h2>Liste enregistrée en BDD :</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '8px' }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;