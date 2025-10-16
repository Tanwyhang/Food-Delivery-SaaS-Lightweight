'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Category } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await supabase.from('categories').update({ name }).eq('id', editingId);
    } else {
      await supabase.from('categories').insert({ name });
    }

    resetForm();
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category? Menu items will be uncategorized.')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  const resetForm = () => {
    setName('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
          <h2 className="font-semibold mb-3">{editingId ? 'Edit Category' : 'New Category'}</h2>
          
          <input
            type="text"
            placeholder="Category Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-input bg-background rounded px-3 py-2 mb-3"
            required
          />

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

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 flex justify-between items-center">
            <span className="font-medium">{category.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 hover:bg-accent rounded"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 hover:bg-destructive/10 text-destructive rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
