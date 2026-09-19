import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  UtensilsCrossed,
  Layers,
  FileText,
  UserPlus,
  ChevronDown,
  Building2,
  Check
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    tenant,
    currentUser,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    createOrEditQuotation,
    createOrEditMenu,
    addToast
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTenantSwitchOpen, setIsTenantSwitchOpen] = useState(false);

  return (
    <header
      className="top-header no-print"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left Area: Mobile Brand Logo & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0, maxWidth: '480px' }}>
        {/* Mobile Logo Only on Mobile */}
        <div
          className="mobile-only"
          onClick={() => setActiveTab('dashboard')}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <UtensilsCrossed size={17} />
          </div>
        </div>

        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            minWidth: '120px'
          }}
        >
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '10px',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search dishes, quotes, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              paddingLeft: '32px',
              paddingRight: '10px',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.backgroundColor = 'var(--surface)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.backgroundColor = 'var(--surface-secondary)';
            }}
          />
        </div>
      </div>

      {/* Right Area: Tenant Switcher, Quick Create, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Tenant Workspace Switcher Demo (Desktop only) */}
        <div style={{ position: 'relative' }} className="desktop-only">
          <button
            onClick={() => setIsTenantSwitchOpen(!isTenantSwitchOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Building2 size={14} color="var(--primary)" />
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tenant.name}
            </span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {isTenantSwitchOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '230px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '6px',
                zIndex: 50
              }}
              onClick={() => setIsTenantSwitchOpen(false)}
            >
              <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                ACTIVE WORKSPACE (SaaS)
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary-dark)',
                  fontSize: '12.5px',
                  fontWeight: 600
                }}
              >
                <span>{tenant.name}</span>
                <Check size={14} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Create Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 10px', minHeight: '34px', fontSize: '12.5px' }}
          >
            <Plus size={15} />
            <span className="desktop-only">Create</span>
            <ChevronDown size={13} />
          </button>

          {isCreateOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '200px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '6px',
                zIndex: 50
              }}
              onClick={() => setIsCreateOpen(false)}
            >
              <button
                onClick={() => createOrEditQuotation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FileText size={15} color="var(--primary)" />
                <span>New Quotation</span>
              </button>

              <button
                onClick={() => createOrEditMenu()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Layers size={15} color="var(--primary)" />
                <span>New Food Menu</span>
              </button>

              <button
                onClick={() => setActiveTab('food-items')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <UtensilsCrossed size={15} color="var(--primary)" />
                <span>Add Food Item</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <UserPlus size={15} color="var(--primary)" />
                <span>Add Customer</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Activity Notifications',
              message: 'Quotation QT-2026-0148 for Rahul Menon was marked Accepted.'
            });
          }}
          className="btn-ghost btn-icon btn-sm"
          style={{ width: '34px', height: '34px', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={17} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--primary)',
              borderRadius: '50%'
            }}
          />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => setActiveTab('settings')}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            border: '1.5px solid var(--border)'
          }}
          title={`${currentUser.name} (${currentUser.role})`}
        >
          {currentUser.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
      </div>
    </header>
  );
};
