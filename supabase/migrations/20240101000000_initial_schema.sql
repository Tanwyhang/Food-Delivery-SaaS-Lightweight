-- Create function to update updated_at timestamp (MUST BE FIRST)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  recommendation_level INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_recommendation ON menu_items(recommendation_level DESC);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read for everyone, write for admin only
CREATE POLICY "Allow public read access" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON menu_items FOR ALL USING (true);

-- Insert sample menu items
INSERT INTO menu_items (title, description, price, recommendation_level, is_available) VALUES
  ('Nasi Lemak', 'Fragrant coconut rice with sambal, anchovies, peanuts, and egg', 8.50, 5, true),
  ('Mee Goreng', 'Spicy stir-fried noodles with vegetables and egg', 7.00, 4, true),
  ('Roti Canai', 'Flaky flatbread served with curry dipping sauce', 3.50, 3, true),
  ('Nasi Ayam', 'Steamed chicken rice with ginger sauce', 9.00, 5, true),
  ('Laksa', 'Spicy coconut curry noodle soup', 8.00, 4, true);

-- Create trigger for menu_items updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'paid',
  bill_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_phone ON orders(phone);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're not using auth)
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
