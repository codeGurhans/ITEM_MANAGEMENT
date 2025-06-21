import React, { useState } from 'react';

const types = ['Shirt', 'Pant', 'Shoes', 'Sports Gear', 'Other'];

export default function AddItem({ addItem, goToView }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(types[0]);
  const [desc, setDesc] = useState('');
  const [cover, setCover] = useState('');
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleCover = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setCover(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleImages = e => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(res => {
        const reader = new FileReader();
        reader.onload = ev => res(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(setImages);
  };
  const handleSubmit = e => {
    e.preventDefault();
    addItem({ name, type, description: desc, cover, images });
    setSuccess(true);
    setName(''); setType(types[0]); setDesc(''); setCover(''); setImages([]);
    setTimeout(() => { setSuccess(false); goToView(); }, 1200);
  };
  return (
    <div>
      <h2>Add Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Item Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>Item Type:
          <select value={type} onChange={e => setType(e.target.value)}>{types.map(t => <option key={t}>{t}</option>)}</select>
        </label>
        <label>Description:
          <textarea value={desc} onChange={e => setDesc(e.target.value)} required />
        </label>
        <label>Cover Image:
          <input type="file" accept="image/*" onChange={handleCover} required />
        </label>
        <button type="submit">Add Item</button>
      </form>
      {success && <div className="success-message">Item successfully added</div>}
    </div>
  );
} 