export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  remarks?: string;
}

export interface Address {
  block: 'Amarin' | 'Azelia' | 'Eugenia' | 'Sierra';
  lorong: number;
  unit: string;
}

export interface Order {
  id: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: 'paid' | 'preparing' | 'delivering' | 'delivered';
  bill_id?: string;
  address?: Address;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  recommendation_level: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
