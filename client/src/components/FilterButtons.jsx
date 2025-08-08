// src/components/FilterButtons.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient.js';

function FilterButtons({ active, onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    apiClient.get('/videos/categories')
      .then(res => {
        if (!mounted) return;
        const cats = (res.data || []).filter(Boolean).sort();
        setCategories(cats);
      })
      .catch(err => {
        console.warn('Failed to load categories', err);
        setCategories([]);
      });
    return () => { mounted = false; };
  }, []);

  const filters = ['All', ...categories];

  return (
    <div className="filter-buttons" style={{ display: 'flex', gap: 8 }}>
      {filters.map(f => (
        <button
          key={f}
          className={f === active ? 'active' : ''}
          onClick={() => onSelect(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
