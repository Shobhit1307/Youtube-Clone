// FilterButtons.jsx
import React from 'react';

function FilterButtons({ active, onSelect }) {
  const filters = ['All', 'Education', 'Tech', 'Entertainment'];
  return (
    <div className="filter-buttons">
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
