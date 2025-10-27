'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Order } from '@/lib/types';
import { Phone, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string) => void;
  onConfirmPayment?: (orderId: string) => void;
  onDiscard?: (orderId: string) => void; // New prop
  isSelected?: boolean;
  onSelect?: (orderId: string) => void;
}

export default function OrderCard({ order, onUpdateStatus, onConfirmPayment, onDiscard, isSelected, onSelect }: OrderCardProps) {
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

      <div className="flex-col justify-between items-center">
        <p className="flex-row font-bold text-primary text-2xl mb-6">RM {order.total.toFixed(2)}</p>
        <div className="flex gap-2">
          {order.status === 'pending' && onConfirmPayment && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-green-500 text-white px-4 py-4 rounded text-sm hover:opacity-90">Confirm Payment</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will mark the order as paid. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onConfirmPayment(order.id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {order.status === 'pending' && onDiscard && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:opacity-90">Discard</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete the order. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDiscard(order.id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {onUpdateStatus && order.status !== 'delivered' && order.status !== 'pending' && (
            <button
              onClick={() => onUpdateStatus(order.id)}
              className="bg-primary text-primary-foreground px-4 py-1 rounded text-sm hover:opacity-90"
            >
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
