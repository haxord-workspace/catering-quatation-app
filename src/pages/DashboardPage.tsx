import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  FileText,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  ArrowUpRight,
  Plus,
  Layers,
  Users,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    tenant,
    quotations,
    menus,
    foodItems,
    createOrEditQuotation,
    createOrEditMenu,
    viewQuotation,
    startQuoteFromMenu,
    setActiveTab,
    setIsDemoTourOpen
  } = useApp();

  // Metrics Calculation
  const totalQuotes = quotations.length;
  const pendingQuotes = quotations.filter((q) => q.status === 'Sent' || q.status === 'Negotiation').length;
  const acceptedQuotes = quotations.filter((q) => q.status === 'Accepted').length;

  const recentQuotations = quotations.slice(0, 4);
  const popularMenus = menus.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner with Expo Demo CTA */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #FAF8FF 0%, #FFFFFF 100%)',
          border: '1px solid #E4DCFD',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-soft)',
            opacity: 0.4,
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-primary">Catering Workspace</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {tenant.location}</span>
              </div>
              <h1 className="page-title font-heading" style={{ marginTop: '6px' }}>
                Welcome, {tenant.name}
              </h1>
              <p className="page-subtitle">
                Build reusable food menus, calculate pricing per guest, and send customer proposals in minutes.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsDemoTourOpen(true)}
                className="btn btn-soft-primary"
                style={{ border: '1px solid #DCD2FC' }}
              >
                <Sparkles size={16} color="var(--primary)" />
                <span>3-Min Expo Demo Tour</span>
              </button>
              <button onClick={() => createOrEditQuotation()} className="btn btn-primary">
                <Plus size={16} />
                <span>Create Quotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid-metrics">
        {/* Metric 1: Total Quotations */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Quotations</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {totalQuotes}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Active proposals in pipeline
          </div>
        </div>

        {/* Metric 2: Pending */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Pending Review</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--warning-soft)',
                color: 'var(--warning-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {pendingQuotes}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--warning-text)' }}>
            Awaiting client confirmation
          </div>
        </div>

        {/* Metric 3: Accepted */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Accepted</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--success-soft)',
                color: 'var(--success-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {acceptedQuotes}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success-text)' }}>
            Confirmed booked events
          </div>
        </div>

        {/* Metric 4: Menu Items & Catalog */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Dish Catalog</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--info-soft)',
                color: 'var(--info-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UtensilsCrossed size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {foodItems.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Across {menus.length} reusable menus
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px'
        }}
      >
        <button
          onClick={() => createOrEditQuotation()}
          className="card card-interactive"
          style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
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
            <FileText size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '13.5px' }}>New Quotation</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto calculate per pax</div>
          </div>
        </button>

        <button
          onClick={() => createOrEditMenu()}
          className="card card-interactive"
          style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
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
            <Layers size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Create Menu</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reusable package</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('food-items')}
          className="card card-interactive"
          style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
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
            <UtensilsCrossed size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Add Dish Item</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Manage rates & costs</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className="card card-interactive"
          style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
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
            <Users size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Add Customer</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Event organizer records</div>
          </div>
        </button>
      </div>

      {/* Main Grid: Recent Quotations & Popular Menus */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Recent Quotations */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Quotations</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Latest proposals and commercial bookings
              </p>
            </div>
            <button
              onClick={() => setActiveTab('quotations')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '12.5px' }}
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentQuotations.map((q) => {
              let badgeClass = 'badge-neutral';
              if (q.status === 'Accepted') badgeClass = 'badge-success';
              else if (q.status === 'Sent') badgeClass = 'badge-primary';
              else if (q.status === 'Negotiation') badgeClass = 'badge-warning';

              return (
                <div
                  key={q.id}
                  onClick={() => viewQuotation(q.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D2C7FC';
                    e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'var(--surface)';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        {q.eventName}
                      </span>
                      <span className={`badge ${badgeClass}`}>{q.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {q.customerName} • {q.guestCount} guests • {formatDate(q.eventDate)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--primary-dark)' }}>
                      {formatCurrency(q.grandTotal)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {q.quotationNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Popular Reusable Menus */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Popular Reusable Menus</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Pre-built packages ready for instant quotation
              </p>
            </div>
            <button
              onClick={() => setActiveTab('menus')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '12.5px' }}
            >
              <span>All menus</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {popularMenus.map((menu) => (
              <div
                key={menu.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                    {menu.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {menu.cuisineTags.map((tag) => (
                      <span key={tag} className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                        {tag}
                      </span>
                    ))}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>
                      • {menu.items.length} items
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {formatCurrency(menu.pricePerPerson)}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>per person</div>
                  </div>
                  <button
                    onClick={() => startQuoteFromMenu(menu.id)}
                    className="btn btn-soft-primary btn-sm"
                    title="Generate quotation using this menu"
                  >
                    <span>Quote</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
