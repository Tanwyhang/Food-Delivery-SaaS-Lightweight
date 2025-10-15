'use client';

interface StatusProgressBarProps {
  currentStatus: 'paid' | 'preparing' | 'delivering' | 'delivered';
}

const statuses = [
  { key: 'paid', label: 'Paid', icon: '💳' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'delivering', label: 'Delivering', icon: '🚗' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
];

export default function StatusProgressBar({ currentStatus }: StatusProgressBarProps) {
  const currentIndex = statuses.findIndex((s) => s.key === currentStatus);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>

        {statuses.map((status, idx) => (
          <div key={status.key} className="flex flex-col items-center relative z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                idx <= currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              {status.icon}
            </div>
            <span className="text-xs font-medium text-center">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
