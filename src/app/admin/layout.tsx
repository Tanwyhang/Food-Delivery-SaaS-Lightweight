'use client';

import BottomNav from '@/components/BottomNav';
import { usePathname } from 'next/navigation';
import { ClipboardList, UtensilsCrossed, BarChart3 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const hideNav = pathname === '/admin/login';

  return (
    <div className={hideNav ? '' : 'pb-20'}>
      {children}
      {!hideNav && <BottomNav items={navItems} />}
    </div>
  );
}
