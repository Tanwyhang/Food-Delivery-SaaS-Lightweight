'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { MenuItem, Category } from '@/lib/types';
import { Loader2, Star } from 'lucide-react';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    recommendation_level: '0',
    is_available: true,
    category_id: '',
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      title: formData.title,
      description: formData.description || null,
      price: parseFloat(formData.price),
      image_url: formData.image_url || null,
      recommendation_level: parseInt(formData.recommendation_level),
      is_available: formData.is_available,
      category_id: formData.category_id || null,
    };

    if (editingId) {
      await supabase.from('menu_items').update(itemData).eq('id', editingId);
    } else {
      await supabase.from('menu_items').insert(itemData);
    }

    resetForm();
    fetchItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      price: item.price.toString(),
      image_url: item.image_url || '',
      recommendation_level: item.recommendation_level.toString(),
      is_available: item.is_available,
      category_id: item.category_id || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      await supabase.from('menu_items').delete().eq('id', id);
      fetchItems();
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    await supabase.from('menu_items').update({ is_available: !current }).eq('id', id);
    fetchItems();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('menu images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Upload failed: ' + error.message);
      } else {
        alert('An unknown error occurred during upload.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      image_url: '',
      recommendation_level: '0',
      is_available: true,
      category_id: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
          <h2 className="font-semibold mb-3">{editingId ? 'Edit Item' : 'New Item'}</h2>
          
          <input
            type="text"
            placeholder="Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-input bg-background rounded px-3 py-2 mb-2"
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-input bg-background rounded px-3 py-2 mb-2"
            rows={2}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Price *"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full border border-input bg-background rounded px-3 py-2 mb-2"
            required
          />

          <div className="mb-2">
            <label className="block text-sm mb-1 font-medium">Image</label>
            
            {formData.image_url && (
              <Image 
                src={formData.image_url} 
                alt="Preview" 
                width={500}
                height={500}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full border border-input bg-background rounded px-3 py-2 mb-2 text-sm"
            />
            
            {uploading && (
              <p className="text-sm text-primary mb-2 flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</p>
            )}
            
            <p className="text-xs text-muted-foreground mb-1">Or paste image URL:</p>
            <input
              type="url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full border border-input bg-background rounded px-3 py-2"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full border border-input bg-background rounded px-3 py-2 mb-2"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm mb-1">Recommendation Level (0-5)</label>
            <input
              type="number"
              min="0"
              max="5"
              value={formData.recommendation_level}
              onChange={(e) => setFormData({ ...formData, recommendation_level: e.target.value })}
              className="w-full border border-input bg-background rounded px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
            />
            <span>Available</span>
          </label>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 bg-secondary text-secondary-foreground rounded hover:opacity-90">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
            <div className="flex gap-3">
              {item.image_url && (
                <Image src={item.image_url} alt={item.title} width={100} height={100} className="w-20 h-20 object-cover rounded" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(item.recommendation_level)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-primary font-bold mt-1">RM {item.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => toggleAvailability(item.id, item.is_available)}
                    className={`text-xs px-3 py-1 rounded ${
                      item.is_available ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs px-3 py-1 bg-accent text-accent-foreground rounded hover:opacity-80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs px-3 py-1 bg-destructive/10 text-destructive rounded hover:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
