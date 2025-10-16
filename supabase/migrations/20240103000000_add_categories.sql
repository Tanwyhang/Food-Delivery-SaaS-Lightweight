-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update to categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete to categories" ON categories FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name) VALUES 
  ('Main Course'),
  ('Appetizer'),
  ('Dessert'),
  ('Beverage')
ON CONFLICT (name) DO NOTHING;
