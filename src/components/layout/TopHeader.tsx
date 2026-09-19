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
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left Area: Mobile Brand & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '480px' }}>
        {/* Mobile only mini logo */}
        <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <span
            className="font-heading"
            style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}
          >
            MenuQuote
          </span>
        </div>

        {/* Global Search Input */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search dishes, menus, quotations, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              paddingLeft: '36px',
              paddingRight: '12px',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Tenant Workspace Switcher Demo */}
        <div style={{ position: 'relative' }} className="hidden sm:block">
          <button
            onClick={() => setIsTenantSwitchOpen(!isTenantSwitchOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Building2 size={15} color="var(--primary)" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tenant.name}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isTenantSwitchOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '240px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '6px',
                zIndex: 50
              }}
              onClick={() => setIsTenantSwitchOpen(false)}
            >
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
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
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                <span>{tenant.name}</span>
                <Check size={14} />
              </div>
              <div
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Multi-Tenant Architecture',
                    message: 'Each catering company has an isolated database & quotation templates.'
                  });
                }}
                style={{
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                + Switch or Add Company...
              </div>
            </div>
          )}
        </div>

        {/* Quick Create Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 14px' }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown size={14} />
          </button>

          {isCreateOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '210px',
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
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FileText size={16} color="var(--primary)" />
                <div>
                  <div>New Quotation</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Generate client proposal</div>
                </div>
              </button>

              <button
                onClick={() => createOrEditMenu()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Layers size={16} color="var(--primary)" />
                <div>
                  <div>New Food Menu</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reusable package</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('food-items')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <UtensilsCrossed size={16} color="var(--primary)" />
                <div>
                  <div>Add Food Item</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>New dish in catalog</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <UserPlus size={16} color="var(--primary)" />
                <div>
                  <div>Add Customer</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Client record</div>
                </div>
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
          className="btn-ghost btn-icon"
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              backgroundColor: 'var(--primary)',
              borderRadius: '50%'
            }}
          />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => setActiveTab('settings')}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            border: '2px solid var(--border)'
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
