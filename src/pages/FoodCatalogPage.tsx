import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodItem, FoodUnit } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Check,
  Flame,
  GlassWater
} from 'lucide-react';

export const FoodCatalogPage: React.FC = () => {
  const {
    foodItems,
    cuisines,
    categories,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    duplicateFoodItem,
    searchQuery: globalSearch
  } = useApp();

  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cuisineId: cuisines[0]?.id || '',
    categoryId: categories[0]?.id || '',
    description: '',
    foodImage: '',
    sellingPrice: 100,
    estimatedCost: 40,
    unit: 'Per Person' as FoodUnit,
    isVegetarian: true,
    isLiveCounter: false,
    isDrink: false,
    isAvailable: true,
    preparationNotes: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      cuisineId: cuisines[0]?.id || '',
      categoryId: categories[0]?.id || '',
      description: '',
      foodImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      sellingPrice: 100,
      estimatedCost: 40,
      unit: 'Per Person',
      isVegetarian: true,
      isLiveCounter: false,
      isDrink: false,
      isAvailable: true,
      preparationNotes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      cuisineId: item.cuisineId,
      categoryId: item.categoryId,
      description: item.description,
      foodImage: item.foodImage,
      sellingPrice: item.sellingPrice,
      estimatedCost: item.estimatedCost,
      unit: item.unit,
      isVegetarian: item.isVegetarian,
      isLiveCounter: !!item.isLiveCounter,
      isDrink: !!item.isDrink,
      isAvailable: item.isAvailable,
      preparationNotes: item.preparationNotes || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cuisine = cuisines.find((c) => c.id === formData.cuisineId);
    const category = categories.find((cat) => cat.id === formData.categoryId);

    const itemPayload = {
      name: formData.name,
      cuisineId: formData.cuisineId,
      cuisineName: cuisine ? cuisine.name : '',
      categoryId: formData.categoryId,
      categoryName: category ? category.name : '',
      description: formData.description,
      foodImage: formData.foodImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      sellingPrice: Number(formData.sellingPrice),
      estimatedCost: Number(formData.estimatedCost),
      unit: formData.unit,
      isVegetarian: formData.isVegetarian,
      isLiveCounter: formData.isLiveCounter,
      isDrink: formData.isDrink,
      isAvailable: formData.isAvailable,
      preparationNotes: formData.preparationNotes,
      status: 'active' as const
    };

    if (editingItem) {
      updateFoodItem(editingItem.id, itemPayload);
    } else {
      addFoodItem(itemPayload);
    }
    setIsModalOpen(false);
  };

  // Filter food items
  const query = (localSearch || globalSearch).toLowerCase().trim();
  const filteredItems = foodItems.filter((item: FoodItem) => {
    if (selectedCuisine !== 'all' && item.cuisineId !== selectedCuisine) return false;
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (vegOnly && !item.isVegetarian) return false;
    if (query) {
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.description?.toLowerCase().includes(query);
      const matchCuisine = item.cuisineName?.toLowerCase().includes(query);
      const matchCat = item.categoryName?.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCuisine && !matchCat) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title font-heading">Food Item Catalog</h1>
          <p className="page-subtitle">
            Master repository of all catering dishes, prices, cost margins, and live counters.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Cuisine Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setSelectedCuisine('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: selectedCuisine === 'all' ? 'var(--primary)' : 'var(--border)',
              backgroundColor: selectedCuisine === 'all' ? 'var(--primary-soft)' : 'var(--surface)',
              color: selectedCuisine === 'all' ? 'var(--primary-dark)' : 'var(--text-secondary)',
              fontWeight: selectedCuisine === 'all' ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All Cuisines ({foodItems.length})
          </button>
          {cuisines.map((c) => {
            const count = foodItems.filter((f) => f.cuisineId === c.id).length;
            const isSelected = selectedCuisine === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCuisine(c.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                  color: isSelected ? 'var(--primary-dark)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search, Category Selector, and Veg toggle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by dish name or description..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', height: '40px' }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px', height: '40px' }}
          >
            <option value="all">All Meal Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '40px',
              padding: '0 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: vegOnly ? 'var(--success)' : 'var(--border)',
              backgroundColor: vegOnly ? 'var(--success-soft)' : 'var(--surface)',
              color: vegOnly ? 'var(--success-text)' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <div className="veg-icon" />
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Food Items List / Grid */}
      {filteredItems.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UtensilsCrossed size={26} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 600 }}>No dishes found matching filters</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Try adjusting your search terms, clearing cuisine filters, or add a new recipe to your catalog.
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>
            <Plus size={15} />
            <span>Add Food Item</span>
          </button>
        </div>
      ) : (
        <div className="grid-cards-responsive">
          {filteredItems.map((item: FoodItem) => {
            const margin = item.sellingPrice - item.estimatedCost;
            const marginPercent = Math.round((margin / item.sellingPrice) * 100);

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Dish Image */}
                <div style={{ position: 'relative', height: '140px', width: '100%', backgroundColor: '#EEE' }}>
                  <img
                    src={item.foodImage}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      gap: '6px'
                    }}
                  >
                    <span className={item.isVegetarian ? 'veg-icon' : 'non-veg-icon'} />
                    {item.isLiveCounter && (
                      <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        <Flame size={11} /> Live Counter
                      </span>
                    )}
                    {item.isDrink && (
                      <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        <GlassWater size={11} /> Drink
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      backgroundColor: 'rgba(47, 41, 54, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500
                    }}
                  >
                    {item.categoryName}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {item.cuisineName} Cuisine
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <p
                      style={{
                        fontSize: '12.5px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {item.description}
                    </p>
                  )}

                  {/* Pricing and Cost breakdown */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--divider)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                          {formatCurrency(item.sellingPrice)}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {item.unit}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Cost: {formatCurrency(item.estimatedCost)} ({marginPercent}% margin)
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => duplicateFoodItem(item.id)}
                        className="btn-ghost btn-icon btn-sm"
                        title="Duplicate Dish"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="btn-ghost btn-icon btn-sm"
                        title="Edit Dish"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteFoodItem(item.id)}
                        className="btn-danger-ghost btn-icon btn-sm"
                        title="Delete Dish"
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
      )}

      {/* Add / Edit Food Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Food Item' : 'Add New Food Item'}
        subtitle="Configure dish specifications, cost, and pricing unit."
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              <Check size={16} />
              <span>{editingItem ? 'Update Dish' : 'Add to Catalog'}</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Dish Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Thalassery Dum Chicken Biryani"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Cuisine *</label>
              <select
                value={formData.cuisineId}
                onChange={(e) => setFormData({ ...formData, cuisineId: e.target.value })}
                className="form-select"
              >
                {cuisines.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Meal Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="form-select"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Ingredients</label>
            <textarea
              placeholder="Describe preparation, key ingredients and flavor profile..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows={2}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Est. Raw Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as FoodUnit })}
                className="form-select"
              >
                <option value="Per Person">Per Person</option>
                <option value="Per Plate">Per Plate</option>
                <option value="Per Piece">Per Piece</option>
                <option value="Per Bowl">Per Bowl</option>
                <option value="Per KG">Per KG</option>
                <option value="Per Litre">Per Litre</option>
                <option value="Per Tray">Per Tray</option>
                <option value="Fixed">Fixed Rate</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Food Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.foodImage}
              onChange={(e) => setFormData({ ...formData, foodImage: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
              />
              <span style={{ fontWeight: 500 }}>Vegetarian Dish</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.isLiveCounter}
                onChange={(e) => setFormData({ ...formData, isLiveCounter: e.target.checked })}
              />
              <span style={{ fontWeight: 500 }}>Live Counter Station</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.isDrink}
                onChange={(e) => setFormData({ ...formData, isDrink: e.target.checked })}
              />
              <span style={{ fontWeight: 500 }}>Beverage / Drink</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};
