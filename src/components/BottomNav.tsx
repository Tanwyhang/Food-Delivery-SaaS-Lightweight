'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 ${
            pathname === item.href ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
