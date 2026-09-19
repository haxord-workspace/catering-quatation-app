import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory } from '../types';
import { Modal } from '../components/common/Modal';
import { FolderTree, Plus, Edit2, Check } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, foodItems, addCategory, updateCategory } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FoodCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 1
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: FoodCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      order: category.order
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description,
        order: Number(formData.order)
      });
    } else {
      addCategory({
        name: formData.name,
        description: formData.description,
        order: Number(formData.order)
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title font-heading">Food Categories</h1>
          <p className="page-subtitle">
            Group food items by meal courses (Welcome Drinks, Starters, Breads, Curries, Live Counters, Desserts).
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {categories.map((cat: FoodCategory) => {
          const itemCount = foodItems.filter((f) => f.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="card"
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FolderTree size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 600 }}>{cat.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {itemCount} catalog dishes
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="btn-ghost btn-icon btn-sm"
                  title="Edit Category"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Meal Category' : 'Create Meal Category'}
        subtitle="Organize meal courses in standard quotation order."
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              <Check size={16} />
              <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Starters & Appetizers, Breads, Live Counters"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input
              type="text"
              placeholder="Brief description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="form-input"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
