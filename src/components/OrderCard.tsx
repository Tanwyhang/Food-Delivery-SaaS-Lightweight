'use client';

import { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string) => void;
  isSelected?: boolean;
  onSelect?: (orderId: string) => void;
}

export default function OrderCard({ order, onUpdateStatus, isSelected, onSelect }: OrderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
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
          <p className="font-semibold">📱 {order.phone}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-2">
        {order.items.map((item, idx) => (
          <p key={idx} className="text-sm">
            {item.quantity}x {item.name}
            {item.remarks && <span className="text-gray-500"> ({item.remarks})</span>}
          </p>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="font-bold text-blue-600">RM {order.total.toFixed(2)}</p>
        {onUpdateStatus && order.status !== 'delivered' && (
          <button
            onClick={() => onUpdateStatus(order.id)}
            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
