import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, FoodItem, PricingModel } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Check,
  UtensilsCrossed
} from 'lucide-react';

export const MenuBuilderPage: React.FC = () => {
  const {
    editingMenuId,
    menus,
    cuisines,
    categories,
    foodItems,
    addMenu,
    updateMenu,
    setActiveTab,
    addToast
  } = useApp();

  // Selected existing menu or new
  const existingMenu = editingMenuId ? menus.find((m) => m.id === editingMenuId) : null;

  // Form State
  const [menuName, setMenuName] = useState(existingMenu ? existingMenu.name : '');
  const [description, setDescription] = useState(existingMenu ? existingMenu.description : '');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    existingMenu ? existingMenu.cuisineTags : ['Kerala']
  );
  const [pricingModel, setPricingModel] = useState<PricingModel>(
    existingMenu ? existingMenu.pricingModel : 'Per Person'
  );
  const [pricePerPerson, setPricePerPerson] = useState<number>(
    existingMenu ? existingMenu.pricePerPerson : 650
  );
  const [fixedPackagePrice, setFixedPackagePrice] = useState<number>(
    existingMenu?.fixedPackagePrice || 50000
  );

  // Selected items in menu
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>(
    existingMenu ? existingMenu.items : []
  );

  // Catalog picker state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCuisineFilter, setCatalogCuisineFilter] = useState('all');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');

  // Calculate sum of individual items
  const calculatedItemsTotal = selectedItems.reduce((acc, item) => acc + item.unitPrice, 0);

  const handleAddItem = (food: FoodItem) => {
    // Check if item already exists
    if (selectedItems.some((i) => i.foodItemId === food.id)) {
      addToast({ type: 'info', title: 'Already in Menu', message: `${food.name} is already added.` });
      return;
    }

    const newItem: MenuItem = {
      id: `mi-${Date.now()}-${Math.random()}`,
      foodItemId: food.id,
      foodName: food.name,
      categoryName: food.categoryName,
      cuisineName: food.cuisineName,
      isVegetarian: food.isVegetarian,
      unit: food.unit,
      unitPrice: food.sellingPrice,
      isLiveCounter: food.isLiveCounter,
      isDrink: food.isDrink
    };

    setSelectedItems((prev) => [...prev, newItem]);
    addToast({ type: 'success', title: 'Dish Added', message: `Added ${food.name} to menu.` });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const toggleCuisineTag = (cuisineName: string) => {
    if (selectedCuisines.includes(cuisineName)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisineName));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisineName]);
    }
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) {
      addToast({ type: 'warning', title: 'Missing Menu Name', message: 'Please provide a name for this menu.' });
      return;
    }

    if (selectedItems.length === 0) {
      addToast({ type: 'warning', title: 'No Dishes Selected', message: 'Please add at least 1 dish to the menu.' });
      return;
    }

    const payload = {
      name: menuName,
      description,
      cuisineTags: selectedCuisines.length > 0 ? selectedCuisines : ['Continental'],
      pricingModel,
      pricePerPerson: Number(pricePerPerson),
      fixedPackagePrice: pricingModel === 'Fixed Package' ? Number(fixedPackagePrice) : undefined,
      items: selectedItems,
      status: 'active' as const
    };

    if (editingMenuId) {
      updateMenu(editingMenuId, payload);
    } else {
      addMenu(payload);
    }

    setActiveTab('menus');
  };

  // Group selected items by category
  const groupedSelectedItems: { [category: string]: MenuItem[] } = {};
  selectedItems.forEach((item) => {
    const cat = item.categoryName || 'Other';
    if (!groupedSelectedItems[cat]) groupedSelectedItems[cat] = [];
    groupedSelectedItems[cat].push(item);
  });

  // Filter Catalog
  const filteredCatalog = foodItems.filter((f) => {
    if (catalogCuisineFilter !== 'all' && f.cuisineId !== catalogCuisineFilter) return false;
    if (catalogCategoryFilter !== 'all' && f.categoryId !== catalogCategoryFilter) return false;
    if (catalogSearch) {
      const q = catalogSearch.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !f.categoryName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('menus')}
            className="btn btn-secondary btn-icon"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title font-heading">
              {editingMenuId ? 'Edit Reusable Menu' : 'Build Reusable Food Menu'}
            </h1>
            <p className="page-subtitle">
              Combine catalog dishes into a cohesive package with defined per-guest pricing.
            </p>
          </div>
        </div>

        <button onClick={handleSaveMenu} className="btn btn-primary">
          <Check size={16} />
          <span>Save Menu Package</span>
        </button>
      </div>

      {/* 3-Column Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Column 1: Menu Details & Pricing Configuration */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>1. Menu Details</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Basic title, description, and pricing model.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Menu Package Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Wedding Banquet 2026"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Package Description</label>
            <textarea
              placeholder="Description highlighting highlights, guest experience and serving style..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={2}
            />
          </div>

          {/* Cuisine Tags Selector */}
          <div className="form-group">
            <label className="form-label">Cuisines Included</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {cuisines.map((c) => {
                const isSelected = selectedCuisines.includes(c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCuisineTag(c.name)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                      color: isSelected ? 'var(--primary-dark)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing Model */}
          <div className="form-group">
            <label className="form-label">Pricing Model</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPricingModel('Per Person')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: pricingModel === 'Per Person' ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: pricingModel === 'Per Person' ? 'var(--primary-soft)' : 'var(--surface)',
                  color: pricingModel === 'Per Person' ? 'var(--primary-dark)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Per Person Rate
              </button>
              <button
                type="button"
                onClick={() => setPricingModel('Fixed Package')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: pricingModel === 'Fixed Package' ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: pricingModel === 'Fixed Package' ? 'var(--primary-soft)' : 'var(--surface)',
                  color: pricingModel === 'Fixed Package' ? 'var(--primary-dark)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Fixed Package
              </button>
            </div>
          </div>

          {pricingModel === 'Per Person' ? (
            <div className="form-group">
              <label className="form-label">Price Per Guest (₹) *</label>
              <input
                type="number"
                min="0"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(Number(e.target.value))}
                className="form-input"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Sum of item catalog rates: {formatCurrency(calculatedItemsTotal)}
              </span>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Fixed Total Package Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={fixedPackagePrice}
                onChange={(e) => setFixedPackagePrice(Number(e.target.value))}
                className="form-input"
              />
            </div>
          )}
        </div>

        {/* Column 2: Searchable Food Catalog Picker */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '720px' }}>
          <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>2. Pick Dishes from Catalog</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Click + Add on any dish to include in this menu.
            </p>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="form-input"
                style={{ height: '36px', paddingLeft: '32px', fontSize: '12.5px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <select
                value={catalogCuisineFilter}
                onChange={(e) => setCatalogCuisineFilter(e.target.value)}
                className="form-select"
                style={{ height: '34px', fontSize: '12px' }}
              >
                <option value="all">All Cuisines</option>
                {cuisines.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={catalogCategoryFilter}
                onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                className="form-select"
                style={{ height: '34px', fontSize: '12px' }}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dishes list */}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {filteredCatalog.map((food) => {
              const isAdded = selectedItems.some((i) => i.foodItemId === food.id);

              return (
                <div
                  key={food.id}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: isAdded ? '#DCD2FC' : 'var(--border)',
                    backgroundColor: isAdded ? 'var(--primary-lighter)' : 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <span className={food.isVegetarian ? 'veg-icon' : 'non-veg-icon'} style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {food.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {food.categoryName} • {formatCurrency(food.sellingPrice)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddItem(food)}
                    disabled={isAdded}
                    className={isAdded ? 'btn btn-soft-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    style={{ padding: '4px 10px', fontSize: '12px', minHeight: '30px' }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Menu Composition (Selected Items grouped by Course) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '720px' }}>
          <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>3. Menu Composition</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {selectedItems.length} dishes organized by course.
              </p>
            </div>
            <span className="badge badge-primary">
              {formatCurrency(pricePerPerson)}/pax
            </span>
          </div>

          {selectedItems.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px 16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                gap: '8px'
              }}
            >
              <UtensilsCrossed size={32} />
              <div style={{ fontSize: '13px' }}>No dishes selected yet.</div>
              <div style={{ fontSize: '11.5px' }}>Click + Add from the catalog in the center column.</div>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {Object.keys(groupedSelectedItems).map((categoryName) => (
                <div key={categoryName} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      color: 'var(--primary-dark)',
                      backgroundColor: 'var(--primary-soft)',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {categoryName} ({groupedSelectedItems[categoryName].length})
                  </div>

                  {groupedSelectedItems[categoryName].map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={item.isVegetarian ? 'veg-icon' : 'non-veg-icon'} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.foodName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {formatCurrency(item.unitPrice)}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="btn-danger-ghost btn-icon btn-sm"
                        style={{ width: '28px', height: '28px' }}
                        title="Remove dish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Bottom summary and action */}
          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '10px' }}>
            <button onClick={handleSaveMenu} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Check size={16} />
              <span>Save & Complete Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
