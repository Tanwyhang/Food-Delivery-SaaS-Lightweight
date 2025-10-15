# Supabase Storage Setup (5 Minutes)

## Quick Setup for Image Uploads

### Step 1: Create Storage Bucket (2 min)

1. Open your Supabase Dashboard
2. Click **Storage** in left sidebar
3. Click **New Bucket** button
4. Fill in:
   - **Name:** `menu-images`
   - **Public bucket:** ✅ Check this box!
5. Click **Create bucket**

### Step 2: Set Bucket Policies (2 min)

1. Click on the `menu-images` bucket you just created
2. Click **Policies** tab at the top
3. Click **New Policy** button
4. Click **Get started quickly** → **For full customization**
5. Use this configuration:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );
```

Or use the UI:
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Policy definition: `bucket_id = 'menu-images'`
- Target roles: `public`

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'menu-images' );
```

Or use the UI:
- Policy name: `Authenticated Upload`
- Allowed operation: `INSERT`
- Policy definition: `bucket_id = 'menu-images'`
- Target roles: `authenticated`

### Step 3: Test Upload (1 min)

1. Go to your app: `http://localhost:3000/admin/menu`
2. Click **+ Add Item**
3. Click **Choose File** under Image section
4. Select any food image
5. Wait for "⏳ Uploading..." to finish
6. Image URL will auto-fill
7. Fill other fields and click **Create**

✅ Done! Your image upload is working!

---

## Alternative: Simple Public Policy

If you want to allow anyone to upload (simpler but less secure):

1. Go to Storage > menu-images > Policies
2. Click **New Policy**
3. Select template: **Allow public access**
4. This creates both read and write access for everyone

⚠️ **Note:** This allows anyone to upload. Fine for prototype, but add authentication for production.

---

## Troubleshooting

### "Upload failed: new row violates row-level security policy"
- Make sure you created the INSERT policy
- Check that bucket is public
- Verify policy target roles include `authenticated` or `public`

### "Image not showing after upload"
- Verify bucket is marked as **Public**
- Check the SELECT policy exists
- Try accessing the URL directly in browser

### "Storage bucket not found"
- Make sure bucket name is exactly `menu-images`
- Check bucket was created successfully
- Refresh the page

---

## What Happens When You Upload?

1. Admin selects image file
2. File uploads to Supabase Storage bucket `menu-images`
3. File gets unique name: `1234567890.jpg`
4. Public URL is generated automatically
5. URL is saved to database with menu item
6. Image shows in customer menu

---

## File Limits

- **Max file size:** 50MB (Supabase default)
- **Recommended:** Keep under 2MB for fast loading
- **Formats:** JPG, PNG, WebP, GIF
- **Storage:** 1GB free on Supabase free tier

---

## Quick Reference

**Bucket name:** `menu-images`

**Public URL format:**
```
https://[project-id].supabase.co/storage/v1/object/public/menu-images/[filename]
```

**Upload location in code:**
```typescript
supabase.storage.from('menu-images').upload(fileName, file)
```

**Get public URL:**
```typescript
supabase.storage.from('menu-images').getPublicUrl(fileName)
```

---

## Next Steps

After setup:
1. Upload images for all menu items
2. Test on customer menu page
3. Optimize images before upload (use TinyPNG)
4. Consider adding image compression in the upload function

---

## Don't Want to Setup Storage?

**Use Imgur instead:**
1. Go to https://imgur.com
2. Upload image
3. Copy image URL
4. Paste in "Image URL" field
5. Skip file upload, just use URL input

Both methods work! Storage is better for production, Imgur is faster for testing.
