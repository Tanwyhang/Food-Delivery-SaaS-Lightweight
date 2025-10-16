'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { Star } from 'lucide-react';

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
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-3">
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
          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Recommended
          </span>
        )}
      </div>
      
      {item.description && (
        <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
      )}
      
      <p className="text-primary font-bold mb-3">RM {item.price.toFixed(2)}</p>
      
      <div className="flex items-center gap-3 mb-2">
        <label className="text-sm">Qty:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-input bg-background rounded px-2 py-1"
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
        className="w-full border border-input bg-background rounded px-3 py-2 mb-3 text-sm"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
