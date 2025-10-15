'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MenuItemCard from '@/components/MenuItemCard';
import { MenuItem, CartItem } from '@/lib/types';

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
    
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('recommendation_level', { ascending: false });
    
    if (data) setMenuItems(data);
    setLoading(false);
  };

  const handleAddToCart = (item: MenuItem, quantity: number, remarks: string) => {
    const cartItem: CartItem = {
      name: item.title,
      price: item.price,
      quantity,
      remarks: remarks || undefined,
    };
    
    const newCart = [...cart, cartItem];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      {menuItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No items available</p>
      ) : (
        menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
        ))
      )}
    </div>
  );
}
