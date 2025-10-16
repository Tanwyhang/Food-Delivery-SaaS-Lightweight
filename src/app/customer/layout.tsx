'use client';

import BottomNav from '@/components/BottomNav';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, ShoppingCart } from 'lucide-react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href: '/customer/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/customer/cart', label: 'Cart', icon: ShoppingCart },
  ];

  const hideNav = pathname === '/customer/phone' || pathname === '/customer/orderStatus';

  return (
    <div className={hideNav ? '' : 'pb-20'}>
      {children}
      {!hideNav && <BottomNav items={navItems} />}
    </div>
  );
}
