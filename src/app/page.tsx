import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, UserCog } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <img
            src="https://mosaskywvcvhnlqgydnj.supabase.co/storage/v1/object/public/menu%20images/logo.png"
            alt="BB Delivery Logo"
            className="w-32 h-32 mx-auto object-contain"
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight">BB Delivery</h1>
            <p className="text-muted-foreground">We cook, we deliver, you eat!</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link href="/customer/phone" className="block">
            <Button size="lg" className="w-full h-16 text-lg gap-2">
              <ShoppingBag className="w-5 h-5" /> Customer
            </Button>
          </Link>
          
          <Link href="/admin/login" className="block">
            <Button size="lg" variant="outline" className="w-full h-16 text-lg gap-2">
              <UserCog className="w-5 h-5" /> Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
