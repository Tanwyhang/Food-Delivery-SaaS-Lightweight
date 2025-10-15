# Image Upload Guide for Menu Items

## 🎯 Quick Overview

There are 3 ways to add images to menu items:

1. **Supabase Storage** (Recommended) - Upload directly to your database
2. **Free Image Hosting** - Use Imgur, ImgBB, etc.
3. **External URLs** - Use any public image URL

---

## ✅ Method 1: Supabase Storage (Recommended)

### Step 1: Setup Supabase Storage

1. Go to your Supabase Dashboard
2. Click **Storage** in the left sidebar
3. Click **New Bucket**
4. Create bucket:
   - Name: `menu-images`
   - Public bucket: ✅ **Yes** (check this!)
   - Click **Create bucket**

### Step 2: Configure Bucket Policies

1. Click on the `menu-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );

-- Allow authenticated uploads (admin only)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'menu-images' );
```

Or use the simple template:
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Target roles: `public`

### Step 3: Upload Images

**Option A: Via Supabase Dashboard**
1. Go to Storage > menu-images
2. Click **Upload file**
3. Select your image (JPG, PNG, WebP)
4. After upload, click the image
5. Click **Get URL** or **Copy URL**
6. Paste URL in admin menu form

**Option B: Add Upload to Admin Panel** (See code below)

### Step 4: Use the URL

The URL format will be:
```
https://[project-id].supabase.co/storage/v1/object/public/menu-images/nasi-lemak.jpg
```

Paste this URL in the "Image URL" field when adding/editing menu items.

---

## 📸 Method 2: Free Image Hosting Services

### Imgur (Easiest)

1. Go to https://imgur.com
2. Click **New post**
3. Upload your image
4. Right-click the image → **Copy image address**
5. Paste URL in admin menu form

Example URL:
```
https://i.imgur.com/abc123.jpg
```

### ImgBB

1. Go to https://imgbb.com
2. Click **Start uploading**
3. Upload image
4. Copy the **Direct link**
5. Paste in admin menu form

### Cloudinary (Professional)

1. Sign up at https://cloudinary.com
2. Upload images to Media Library
3. Copy the image URL
4. Paste in admin menu form

---

## 🌐 Method 3: External URLs

Use any public image URL:
```
https://example.com/food-images/nasi-lemak.jpg
```

⚠️ **Warning:** Make sure the URL:
- Is publicly accessible
- Won't expire
- Supports HTTPS
- Has CORS enabled

---

## 💻 Add File Upload to Admin Panel

Update `src/app/admin/menu/page.tsx`:

### Add State for File Upload

```typescript
const [uploading, setUploading] = useState(false);
const [imageFile, setImageFile] = useState<File | null>(null);
```

### Add Upload Function

```typescript
const uploadImage = async (file: File) => {
  setUploading(true);
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    setFormData({ ...formData, image_url: data.publicUrl });
    setImageFile(null);
  } catch (error) {
    alert('Upload failed: ' + error);
  } finally {
    setUploading(false);
  }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setImageFile(file);
    uploadImage(file);
  }
};
```

### Add to Form (Replace Image URL Input)

```tsx
{/* Image Upload */}
<div className="mb-2">
  <label className="block text-sm mb-1">Image</label>
  
  {formData.image_url && (
    <img 
      src={formData.image_url} 
      alt="Preview" 
      className="w-full h-32 object-cover rounded mb-2"
    />
  )}
  
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    disabled={uploading}
    className="w-full border rounded px-3 py-2 mb-2"
  />
  
  {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
  
  <p className="text-xs text-gray-500">Or paste image URL:</p>
  <input
    type="url"
    placeholder="https://..."
    value={formData.image_url}
    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
    className="w-full border rounded px-3 py-2"
  />
</div>
```

---

## 📋 Complete Example Flow

### Using Supabase Storage:

1. **Admin opens** `/admin/menu`
2. **Clicks** "+ Add Item"
3. **Fills in:**
   - Title: "Nasi Lemak"
   - Description: "Fragrant coconut rice..."
   - Price: 8.50
4. **Uploads image:**
   - Click file input
   - Select `nasi-lemak.jpg`
   - Wait for upload (shows "Uploading...")
   - URL auto-fills
5. **Sets** recommendation level: 5
6. **Checks** "Available"
7. **Clicks** "Create"
8. **Done!** Image shows in customer menu

### Using Imgur:

1. **Go to** imgur.com
2. **Upload** food photo
3. **Copy** image URL
4. **Go to** `/admin/menu`
5. **Click** "+ Add Item"
6. **Fill form** and paste URL in "Image URL"
7. **Click** "Create"

---

## 🎨 Image Best Practices

### Size & Format
- **Recommended size:** 800x600px or 1200x900px
- **Format:** JPG (smaller) or PNG (better quality)
- **Max file size:** 2MB for fast loading

### Composition
- Show the food clearly
- Good lighting
- Clean background
- Close-up or 45° angle

### Optimization
- Use tools like TinyPNG to compress
- Maintain aspect ratio
- Use consistent styling across all images

---

## 🔧 Troubleshooting

**Image not showing?**
- Check if URL is publicly accessible
- Verify HTTPS (not HTTP)
- Check browser console for CORS errors

**Upload fails?**
- Verify Supabase bucket is public
- Check file size (< 5MB)
- Ensure correct bucket name

**Slow loading?**
- Compress images before upload
- Use CDN (Cloudinary, Imgur)
- Consider WebP format

---

## 🚀 Quick Start (No Code Changes)

**Easiest method right now:**

1. Go to https://imgur.com
2. Upload your food photo
3. Right-click → Copy image address
4. Go to your app `/admin/menu`
5. Add/edit item
6. Paste URL in "Image URL" field
7. Save!

That's it! No code changes needed. ✅
