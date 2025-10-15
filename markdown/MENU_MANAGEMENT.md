# Menu Management Guide

## Overview

The app now includes a complete menu management system with database storage.

## Features

### Menu Items Include:
- **Title** - Item name (required)
- **Description** - Detailed description (optional)
- **Price** - Item price in RM (required)
- **Image URL** - Link to item image (optional)
- **Recommendation Level** - 0-5 stars rating
  - Items with level ≥4 show "⭐ Recommended" badge
- **Availability** - Toggle to show/hide items from customer menu

## Admin Menu Management

Access: `/admin/menu`

### Add New Item
1. Click "+ Add Item" button
2. Fill in the form:
   - Title (required)
   - Description (optional)
   - Price (required)
   - Image URL (optional)
   - Recommendation Level (0-5)
   - Available checkbox
3. Click "Create"

### Edit Item
1. Click "Edit" on any menu item
2. Update the fields
3. Click "Update"

### Delete Item
1. Click "Delete" on any menu item
2. Confirm deletion

### Toggle Availability
- Click the availability badge to toggle
- Unavailable items won't show in customer menu
- Useful for temporarily hiding items without deleting

## Customer View

- Menu items are fetched from database
- Sorted by recommendation level (highest first)
- Only available items are shown
- Items with recommendation ≥4 show "⭐ Recommended" badge
- Images displayed if URL provided
- Description shown below title

## Database Schema

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  recommendation_level INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Sample Data

The migration includes 5 sample items:
- Nasi Lemak (RM 8.50) - 5 stars
- Mee Goreng (RM 7.00) - 4 stars
- Roti Canai (RM 3.50) - 3 stars
- Nasi Ayam (RM 9.00) - 5 stars
- Laksa (RM 8.00) - 4 stars

## Image URLs

### Option 1: Use Image Hosting Services
- **Imgur** - https://imgur.com
- **Cloudinary** - https://cloudinary.com
- **ImgBB** - https://imgbb.com

### Option 2: Supabase Storage
1. Go to Supabase Dashboard > Storage
2. Create a bucket called "menu-images"
3. Upload images
4. Get public URL
5. Paste URL in menu item form

### Option 3: External URLs
- Use direct image URLs from any public source
- Ensure images are accessible and won't expire

## Tips

### Recommendation Levels
- **5 stars** - Best sellers, signature dishes
- **4 stars** - Popular items
- **3 stars** - Regular items
- **0-2 stars** - New or less popular items

### Pricing
- Use 2 decimal places (e.g., 8.50)
- Prices are displayed as "RM X.XX"

### Descriptions
- Keep concise but descriptive
- Mention key ingredients or flavors
- Highlight special features (spicy, vegetarian, etc.)

### Images
- Use high-quality food photos
- Recommended size: 800x600px or similar ratio
- Keep file sizes reasonable for fast loading

## Real-time Updates

- Menu changes are reflected immediately
- Customer menu auto-updates when items are added/edited
- No need to refresh the page
