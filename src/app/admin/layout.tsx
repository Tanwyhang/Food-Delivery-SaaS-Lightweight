import BottomNav from '@/components/BottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/menu', label: 'Menu', icon: '🍱' },
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  return (
    <div className="pb-20">
      {children}
      <BottomNav items={navItems} />
    </div>
  );
}
