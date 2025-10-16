'use client';

import { CreditCard, ChefHat, Truck, CheckCircle, LucideIcon } from 'lucide-react';

interface StatusProgressBarProps {
  currentStatus: 'paid' | 'preparing' | 'delivering' | 'delivered';
}

const statuses: { key: string; label: string; icon: LucideIcon }[] = [
  { key: 'paid', label: 'Paid', icon: CreditCard },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'delivering', label: 'Delivering', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function StatusProgressBar({ currentStatus }: StatusProgressBarProps) {
  const currentIndex = statuses.findIndex((s) => s.key === currentStatus);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>

        {statuses.map((status, idx) => {
          const Icon = status.icon;
          return (
            <div key={status.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  idx <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-center">{status.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
