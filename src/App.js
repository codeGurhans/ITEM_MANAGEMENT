import React, { useState, useEffect } from 'react';
import './App.css';
import ViewItems from './ViewItems';
import AddItem from './AddItem';

function App() {
  const [page, setPage] = useState('view');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/items')
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); });
  }, []);

  const addItem = (item) => {
    fetch('http://localhost:3001/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
      .then(res => res.json())
      .then(newItem => setItems(items => [...items, newItem]));
  };

  return (
    <div className="App">
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage('view')}>View Items</button>
        <button onClick={() => setPage('add')}>Add Item</button>
      </nav>
      {loading ? <div>Loading...</div> : (
        page === 'view' ? (
          <ViewItems items={items} />
        ) : (
          <AddItem addItem={addItem} goToView={() => setPage('view')} />
        )
      )}
    </div>
  );
}

export default App;
