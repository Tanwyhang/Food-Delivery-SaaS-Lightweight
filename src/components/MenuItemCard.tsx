'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, remarks: string) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');

  const handleAdd = () => {
    onAddToCart(item, quantity, remarks);
    setQuantity(1);
    setRemarks('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        {item.recommendation_level >= 4 && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ Recommended</span>
        )}
      </div>
      
      {item.description && (
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
      )}
      
      <p className="text-blue-600 font-bold mb-3">RM {item.price.toFixed(2)}</p>
      
      <div className="flex items-center gap-3 mb-2">
        <label className="text-sm">Qty:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Remarks (optional)"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3 text-sm"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
