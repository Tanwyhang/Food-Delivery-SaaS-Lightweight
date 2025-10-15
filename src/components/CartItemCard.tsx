'use client';

import { CartItem } from '@/lib/types';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
}

export default function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          {item.remarks && (
            <p className="text-sm text-gray-500 italic">Note: {item.remarks}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 text-sm font-medium"
        >
          Remove
        </button>
      </div>
      <p className="text-blue-600 font-bold">
        RM {(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}
