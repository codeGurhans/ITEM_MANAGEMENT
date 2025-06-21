import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

// EmailJS config
const EMAILJS_SERVICE_ID = process.env.REACT_APP_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_TEMPLATE_ID;
const EMAILJS_USER_ID = process.env.REACT_APP_USER_ID;

function sendEnquiry(item, cb) {
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    title: item.name,
    name: 'User', // Or ask for user input
    time: new Date().toLocaleString(),
    message: `${item.name} (${item.type}): ${item.description}`,
  }, EMAILJS_USER_ID)
    .then(() => cb(true, 'Email sent!'))
    .catch((err) => {
      console.error('Email sending failed:', err);
      cb(false, 'Failed to send email');
    });
}

function Carousel({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return <div>No images</div>;
  return (
    <div className="carousel">
      <img src={images[idx]} alt="item" className="carousel-img" />
      <div className="carousel-controls">
        <button onClick={() => setIdx((idx - 1 + images.length) % images.length)}>Prev</button>
        <button onClick={() => setIdx((idx + 1) % images.length)}>Next</button>
      </div>
    </div>
  );
}

export default function ViewItems({ items }) {
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');

  const handleEnquire = (item) => {
    setMsg('Sending...');
    sendEnquiry(item, (ok, m) => setMsg(m));
  };

  useEffect(() => {
    emailjs.init(EMAILJS_USER_ID); // ✅ This is enough if you import emailjs
  }, []);

  return (
    <div>
      <h2>View Items</h2>
      <div className="ViewItems-list">
        {items.map(item => (
          <div key={item.id} className="item-card" onClick={() => { setSelected(item); setMsg(''); }}>
            <div className="item-card-img">
              {item.cover ? <img src={item.cover} alt={item.name} /> : 'No Image'}
            </div>
            <div className="item-card-title">{item.name}</div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{selected.name}</h3>
            <div className="modal-details">Type: {selected.type}</div>
            <div className="modal-details">Description: {selected.description}</div>
            <Carousel images={[selected.cover, ...selected.images].filter(Boolean)} />
            <button className="enquire-btn" onClick={() => handleEnquire(selected)}>Enquire</button>
            <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
            {msg && <div className="success-message" style={{ marginTop: 10 }}>{msg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
