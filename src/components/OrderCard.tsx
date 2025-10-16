'use client';

import { Order } from '@/lib/types';
import { Phone, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string) => void;
  isSelected?: boolean;
  onSelect?: (orderId: string) => void;
}

export default function OrderCard({ order, onUpdateStatus, isSelected, onSelect }: OrderCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-3">
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(order.id)}
          className="mb-2"
        />
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold flex items-center gap-1"><Phone className="w-4 h-4" /> {order.phone}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-2">
        {order.items.map((item, idx) => (
          <p key={idx} className="text-sm">
            {item.quantity}x {item.name}
            {item.remarks && <span className="text-muted-foreground"> ({item.remarks})</span>}
          </p>
        ))}
        {order.address && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {order.address.block}, Lorong {order.address.lorong}, Unit {order.address.unit}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="font-bold text-primary">RM {order.total.toFixed(2)}</p>
        {onUpdateStatus && order.status !== 'delivered' && (
          <button
            onClick={() => onUpdateStatus(order.id)}
            className="bg-primary text-primary-foreground px-4 py-1 rounded text-sm hover:opacity-90"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
