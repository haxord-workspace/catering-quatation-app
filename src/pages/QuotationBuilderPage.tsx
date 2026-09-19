import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MenuItem,
  QuotationExtraItem,
  FoodItem,
  QuotationStatus,
  Quotation,
  Customer,
  Menu
} from '../types';
import { formatCurrency, formatDate, generateQuotationNumber } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Check,
  Flame,
  GlassWater,
  Eye
} from 'lucide-react';

export const QuotationBuilderPage: React.FC = () => {
  const {
    editingQuotationId,
    quotations,
    menus,
    customers,
    foodItems,
    tenant,
    currentUser,
    addQuotation,
    updateQuotation,
    setActiveTab,
    viewQuotation,
    addToast
  } = useApp();

  const existingQuotation = editingQuotationId
    ? quotations.find((q: Quotation) => q.id === editingQuotationId)
    : null;

  // Check pre-selected menu from session storage if creating new
  const preselectedMenuId = sessionStorage.getItem('menuquote_preselected_menu');

  // Customer & Event State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    existingQuotation?.customerId || customers[0]?.id || ''
  );
  const [eventName, setEventName] = useState<string>(
    existingQuotation?.eventName || 'Rahul & Anjali Wedding Reception'
  );
  const [eventType] = useState<string>(
    existingQuotation?.eventType || 'Wedding Reception'
  );
  const [eventDate, setEventDate] = useState<string>(
    existingQuotation?.eventDate || '2026-12-24'
  );
  const [validUntil, setValidUntil] = useState<string>(
    existingQuotation?.validUntil || '2026-10-15'
  );
  const [eventVenue, setEventVenue] = useState<string>(
    existingQuotation?.eventVenue || 'Grand Convention Centre, Marine Drive, Kochi'
  );
  const [guestCount, setGuestCount] = useState<number>(
    existingQuotation?.guestCount || 650
  );

  // Menu Selection State
  const initialBaseMenu =
    existingQuotation?.baseMenuId
      ? menus.find((m: Menu) => m.id === existingQuotation.baseMenuId)
      : preselectedMenuId
      ? menus.find((m: Menu) => m.id === preselectedMenuId)
      : menus[0];

  const [selectedMenuId, setSelectedMenuId] = useState<string>(initialBaseMenu?.id || '');
  const [menuPricePerPerson, setMenuPricePerPerson] = useState<number>(
    existingQuotation?.menuPricePerPerson || initialBaseMenu?.pricePerPerson || 650
  );
  const [includedItems, setIncludedItems] = useState<MenuItem[]>(
    existingQuotation?.includedItems || initialBaseMenu?.items || []
  );

  // Extra Line Items (Live counters, drinks, special foods)
  const [additionalItems, setAdditionalItems] = useState<QuotationExtraItem[]>(
    existingQuotation?.additionalItems || [
      {
        id: 'extra-1',
        name: 'Dosa Live Counter (12 Varieties)',
        categoryName: 'Live Counters',
        type: 'Live Counter',
        quantity: 1,
        unit: 'Fixed',
        rate: 12000,
        total: 12000,
        notes: '2 master chefs with copper live counters'
      },
      {
        id: 'extra-2',
        name: 'Fresh Fruit Juice Counter',
        categoryName: 'Welcome Drinks',
        type: 'Drink',
        quantity: 650,
        unit: 'Per Person',
        rate: 60,
        total: 39000,
        notes: 'Cold-pressed Orange, Pineapple, and Grape'
      }
    ]
  );

  // Commercials State
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>(
    existingQuotation?.discountType || 'flat'
  );
  const [discountValue, setDiscountValue] = useState<number>(
    existingQuotation?.discountValue ?? 9500
  );
  const [taxRate, setTaxRate] = useState<number>(
    existingQuotation?.taxRate ?? 5
  );
  const [advanceRequired, setAdvanceRequired] = useState<number>(
    existingQuotation?.advanceRequired ?? 150000
  );
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    existingQuotation?.specialInstructions ||
      'Setup must be ready by 5:30 PM. Live counters start with welcome drinks.'
  );

  // Dish addition modal
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishSearch, setDishSearch] = useState('');

  // When base menu selection changes
  const handleSelectBaseMenu = (menuId: string) => {
    const m = menus.find((menu: Menu) => menu.id === menuId);
    if (!m) return;
    setSelectedMenuId(m.id);
    setMenuPricePerPerson(m.pricePerPerson);
    setIncludedItems([...m.items]);
    addToast({
      type: 'info',
      title: 'Menu Loaded',
      message: `Loaded ${m.name} with ${m.items.length} items.`
    });
  };

  // Add extra dish to quotation without affecting base menu template
  const handleAddDishToQuotation = (food: FoodItem) => {
    if (includedItems.some((i) => i.foodItemId === food.id)) {
      addToast({ type: 'info', title: 'Already included', message: `${food.name} is already in the menu.` });
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

    setIncludedItems((prev) => [...prev, newItem]);
    addToast({ type: 'success', title: 'Added to Quotation', message: `${food.name} added.` });
  };

  const handleRemoveIncludedDish = (id: string) => {
    setIncludedItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Add Live Counter or Drink
  const handleAddLiveCounter = () => {
    const newExtra: QuotationExtraItem = {
      id: `extra-${Date.now()}`,
      name: 'Live Chatpati Chaat & Pani Puri Counter',
      categoryName: 'Live Counters',
      type: 'Live Counter',
      quantity: 1,
      unit: 'Fixed',
      rate: 10000,
      total: 10000,
      notes: 'Interactive live counter station'
    };
    setAdditionalItems((prev) => [...prev, newExtra]);
  };

  const handleAddDrinkCounter = () => {
    const newExtra: QuotationExtraItem = {
      id: `extra-${Date.now()}`,
      name: 'Tender Coconut Welcome Punch',
      categoryName: 'Welcome Drinks',
      type: 'Drink',
      quantity: guestCount,
      unit: 'Per Person',
      rate: 45,
      total: guestCount * 45,
      notes: 'Freshly served on guest arrival'
    };
    setAdditionalItems((prev) => [...prev, newExtra]);
  };

  const handleRemoveExtraItem = (id: string) => {
    setAdditionalItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calculations Engine
  const baseMenuTotal = guestCount * menuPricePerPerson;
  const extrasTotal = additionalItems.reduce((acc, item) => acc + item.total, 0);
  const subtotal = baseMenuTotal + extrasTotal;

  const discountAmount =
    discountType === 'percentage'
      ? Math.round((subtotal * (discountValue || 0)) / 100)
      : Number(discountValue || 0);

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((discountedSubtotal * (taxRate || 0)) / 100);
  const grandTotal = discountedSubtotal + taxAmount;
  const balanceAmount = Math.max(0, grandTotal - (advanceRequired || 0));

  // Save Quotation Handler
  const handleSaveQuotation = (targetStatus: QuotationStatus = 'Draft', navigateToPreview = false) => {
    const selectedCustomer = customers.find((c: Customer) => c.id === selectedCustomerId);
    const selectedMenu = menus.find((m: Menu) => m.id === selectedMenuId);

    const quotationPayload = {
      quotationNumber: existingQuotation ? existingQuotation.quotationNumber : generateQuotationNumber(quotations.length),
      eventDate,
      validUntil,
      status: targetStatus,
      customerId: selectedCustomerId,
      customerName: selectedCustomer ? selectedCustomer.name : 'Valued Client',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '',
      customerEmail: selectedCustomer ? selectedCustomer.email : '',
      customerCompany: selectedCustomer?.company,
      eventName,
      eventType,
      eventVenue,
      guestCount: Number(guestCount),
      baseMenuId: selectedMenuId,
      baseMenuName: selectedMenu ? selectedMenu.name : 'Custom Catering Menu',
      menuPricePerPerson: Number(menuPricePerPerson),
      menuTotal: baseMenuTotal,
      includedItems,
      additionalItems,
      subtotal,
      discountType,
      discountValue: Number(discountValue),
      discountAmount,
      taxRate: Number(taxRate),
      taxAmount,
      additionalCharges: 0,
      grandTotal,
      advanceRequired: Number(advanceRequired),
      balanceAmount,
      terms: tenant.terms,
      specialInstructions,
      preparedBy: `${currentUser.name} (${tenant.name})`
    };

    let savedId = '';
    if (editingQuotationId) {
      updateQuotation(editingQuotationId, quotationPayload);
      savedId = editingQuotationId;
    } else {
      savedId = addQuotation(quotationPayload);
    }

    if (navigateToPreview) {
      viewQuotation(savedId);
    } else {
      setActiveTab('quotations');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('quotations')}
            className="btn btn-secondary btn-icon"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title font-heading">
              {editingQuotationId ? 'Edit Quotation Proposal' : 'Guided Quotation Builder'}
            </h1>
            <p className="page-subtitle">
              Select reusable menus, configure guest counts, add live counters, and calculate pricing live.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleSaveQuotation('Draft', false)}
            className="btn btn-secondary"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveQuotation('Sent', true)}
            className="btn btn-primary"
          >
            <Eye size={16} />
            <span>Generate & Preview Proposal</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (2-Columns: Left Builder Steps + Right Sticky Pricing Summary) */}
      <div className="workspace-two-col">
        {/* Left Column: Interactive Form Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Customer & Event Particulars */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  1
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Customer & Event Particulars</h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Client / Customer *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="form-select"
                >
                  {customers.map((c: Customer) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Event Name / Occasion *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul & Anjali Wedding Reception"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guest Count (Pax) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={guestCount}
                  onChange={(e) => {
                    const count = Math.max(1, Number(e.target.value));
                    setGuestCount(count);
                    // Also update any per person drink items
                    setAdditionalItems((prev) =>
                      prev.map((item) =>
                        item.unit === 'Per Person'
                          ? { ...item, quantity: count, total: count * item.rate }
                          : item
                      )
                    );
                  }}
                  className="form-input"
                  style={{ fontWeight: 600, color: 'var(--primary-dark)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Proposal Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Event Venue & Address</label>
              <input
                type="text"
                placeholder="e.g. Grand Convention Centre, Marine Drive, Kochi"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Step 2: Select Reusable Base Menu */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    2
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Select Reusable Base Menu</h3>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {guestCount} Guests × {formatCurrency(menuPricePerPerson)} ={' '}
                  <strong style={{ color: 'var(--primary-dark)' }}>{formatCurrency(baseMenuTotal)}</strong>
                </div>
              </div>
            </div>

            {/* Menu Selection Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {menus.map((m: Menu) => {
                const isSelected = selectedMenuId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectBaseMenu(m.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--primary-lighter)' : 'var(--surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: isSelected ? 'var(--primary-dark)' : 'inherit' }}>
                        {m.name}
                      </span>
                      {isSelected && <Check size={16} color="var(--primary)" />}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      <span>{m.items.length} dishes</span>
                      <strong style={{ color: 'var(--primary-dark)' }}>{formatCurrency(m.pricePerPerson)}/pax</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Included items with remove & add capability */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Included Dishes in this Quotation ({includedItems.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(true)}
                  className="btn btn-soft-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Add Extra Dish to Quote</span>
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '8px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}
              >
                {includedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <span className={item.isVegetarian ? 'veg-icon' : 'non-veg-icon'} style={{ flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.foodName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveIncludedDish(item.id)}
                      className="btn-danger-ghost btn-icon btn-sm"
                      style={{ width: '24px', height: '24px' }}
                      title="Remove from this quotation"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Add Live Counters & Drink Stations */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  3
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Live Counters & Drink Stations</h3>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleAddLiveCounter}
                  className="btn btn-secondary btn-sm"
                >
                  <Flame size={14} color="var(--warning-text)" />
                  <span>+ Live Counter</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddDrinkCounter}
                  className="btn btn-secondary btn-sm"
                >
                  <GlassWater size={14} color="var(--info-text)" />
                  <span>+ Drink Station</span>
                </button>
              </div>
            </div>

            {additionalItems.length === 0 ? (
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '10px 0' }}>
                No extra live counters or beverage stations added yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {additionalItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
                      {item.type === 'Live Counter' ? (
                        <Flame size={16} color="var(--warning-text)" />
                      ) : (
                        <GlassWater size={16} color="var(--info-text)" />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.name}</div>
                        {item.notes && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {item.quantity} {item.unit} @ {formatCurrency(item.rate)}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--primary-dark)', minWidth: '80px', textAlign: 'right' }}>
                        {formatCurrency(item.total)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraItem(item.id)}
                        className="btn-danger-ghost btn-icon btn-sm"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 4: Discounts, Tax & Special Notes */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  4
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Commercial Terms & Discount Adjustments</h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Discount Type & Amount</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="form-select"
                    style={{ width: '90px' }}
                  >
                    <option value="flat">₹ Flat</option>
                    <option value="percentage">% Pct</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">GST / Tax Rate (%)</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={0}>0% (Exempt)</option>
                  <option value={5}>5% (Catering GST)</option>
                  <option value={18}>18% (Standard GST)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Advance Deposit Required (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={advanceRequired}
                  onChange={(e) => setAdvanceRequired(Number(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Event Setup Notes</label>
              <textarea
                placeholder="Kitchen readiness time, dietary notes, live stall logistics..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="form-textarea"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Commercial Summary */}
        <div className="sticky-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
              border: '1.5px solid #DCD2FC'
            }}
          >
            <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: 'var(--primary-dark)'
                }}
              >
                LIVE QUOTATION SUMMARY
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px' }}>
                {eventName || 'Untitled Event'}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {guestCount} Guests • {formatDate(eventDate)}
              </div>
            </div>

            {/* Breakdown Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Base Food Menu ({guestCount} × {formatCurrency(menuPricePerPerson)})
                </span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(baseMenuTotal)}</span>
              </div>

              {additionalItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>+ {item.name}</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(item.total)}</span>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--divider)'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-text)' }}>
                  <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Flat'})</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              {taxAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>GST ({taxRate}%)</span>
                  <span>+ {formatCurrency(taxAmount)}</span>
                </div>
              )}

              {/* Grand Total */}
              <div
                style={{
                  marginTop: '10px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>
                    Grand Total
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    {formatCurrency(grandTotal)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--primary-dark)' }}>
                  {formatCurrency(Math.round(grandTotal / guestCount))}/guest
                </div>
              </div>

              {/* Advance & Balance */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  paddingTop: '6px',
                  fontSize: '12px'
                }}
              >
                <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-secondary)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Advance Required</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(advanceRequired)}
                  </div>
                </div>

                <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-secondary)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Balance Due</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(balanceAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => handleSaveQuotation('Sent', true)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Eye size={16} />
                <span>Generate Proposal View</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveQuotation('Draft', false)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Dish Selection Modal */}
      <Modal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        title="Add Dish to Current Quotation"
        subtitle="Custom dishes added here will not change the original menu template."
        footer={
          <button onClick={() => setIsDishModalOpen(false)} className="btn btn-secondary btn-sm">
            Done
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search dishes to add..."
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', height: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
            {foodItems
              .filter((f: FoodItem) => !dishSearch || f.name.toLowerCase().includes(dishSearch.toLowerCase()))
              .map((food: FoodItem) => {
                const isIncluded = includedItems.some((i) => i.foodItemId === food.id);

                return (
                  <div
                    key={food.id}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={food.isVegetarian ? 'veg-icon' : 'non-veg-icon'} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{food.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {food.categoryName} • {formatCurrency(food.sellingPrice)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddDishToQuotation(food)}
                      disabled={isIncluded}
                      className={isIncluded ? 'btn btn-soft-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    >
                      {isIncluded ? 'Included' : '+ Add'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
