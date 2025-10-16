'use client';

import { CartItem } from '@/lib/types';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
}

export default function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
          {item.remarks && (
            <p className="text-sm text-muted-foreground italic">Note: {item.remarks}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-destructive text-sm font-medium hover:opacity-80"
        >
          Remove
        </button>
      </div>
      <p className="text-primary font-bold">
        RM {(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}
