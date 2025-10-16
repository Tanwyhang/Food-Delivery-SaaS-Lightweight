'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MenuItemCard from '@/components/MenuItemCard';
import { MenuItem, CartItem, Category } from '@/lib/types';
import { Filter } from 'lucide-react';

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
    
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

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
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category_id === selectedCategory)
    : menuItems;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menu</h1>
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:opacity-90"
        >
          <Filter className="w-4 h-4" /> Category
        </button>
      </div>

      {showDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowDrawer(false)}>
          <div
            className="fixed right-0 top-0 bottom-0 w-64 bg-card border-l shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => { setSelectedCategory(null); setShowDrawer(false); }}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === null ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setShowDrawer(false); }}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">No items available</p>
      ) : (
        filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
        ))
      )}
    </div>
  );
}
