import BottomNav from '@/components/BottomNav';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/customer/menu', label: 'Menu', icon: '🍱' },
    { href: '/customer/cart', label: 'Cart', icon: '🛒' },
  ];

  return (
    <div className="pb-20">
      {children}
      <BottomNav items={navItems} />
    </div>
  );
}
