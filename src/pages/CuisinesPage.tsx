import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cuisine } from '../types';
import { Modal } from '../components/common/Modal';
import { Plus, Edit2, Trash2, Check, UtensilsCrossed } from 'lucide-react';

export const CuisinesPage: React.FC = () => {
  const { cuisines, foodItems, addCuisine, updateCuisine, deleteCuisine, setActiveTab } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: ''
  });

  const handleOpenAdd = () => {
    setEditingCuisine(null);
    setFormData({
      name: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cuisine: Cuisine) => {
    setEditingCuisine(cuisine);
    setFormData({
      name: cuisine.name,
      description: cuisine.description,
      coverImage: cuisine.coverImage
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCuisine) {
      updateCuisine(editingCuisine.id, {
        name: formData.name,
        description: formData.description,
        coverImage: formData.coverImage
      });
    } else {
      addCuisine({
        name: formData.name,
        description: formData.description,
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
        status: 'active'
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title font-heading">Cuisine Management</h1>
          <p className="page-subtitle">
            Organize food items by culinary styles, regions, and festive traditions.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Cuisine</span>
        </button>
      </div>

      {/* Cuisines Grid */}
      <div className="grid-cards-responsive">
        {cuisines.map((c) => {
          const itemCount = foodItems.filter((f) => f.cuisineId === c.id).length;

          return (
            <div
              key={c.id}
              className="card"
              style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '130px', width: '100%', position: 'relative', backgroundColor: '#EFEFEF' }}>
                <img
                  src={c.coverImage}
                  alt={c.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    backgroundColor: 'rgba(47, 41, 54, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  {itemCount} dishes
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{c.name}</h3>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {c.description}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--divider)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <button
                    onClick={() => setActiveTab('food-items')}
                    className="btn-ghost btn-sm"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    <UtensilsCrossed size={13} />
                    <span>View dishes</span>
                  </button>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="btn-ghost btn-icon btn-sm"
                      title="Edit Cuisine"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteCuisine(c.id)}
                      className="btn-danger-ghost btn-icon btn-sm"
                      title="Delete Cuisine"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cuisine Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCuisine ? 'Edit Cuisine' : 'Create Cuisine'}
        subtitle="Culinary grouping for menus and catalog filtering."
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              <Check size={16} />
              <span>{editingCuisine ? 'Update Cuisine' : 'Save Cuisine'}</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Cuisine Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kerala, Arabic, Continental"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Brief summary of culinary tradition and flavor notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="form-input"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
