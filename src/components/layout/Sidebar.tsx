import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Layers,
  UtensilsCrossed,
  Globe2,
  FolderTree,
  FileText,
  Users,
  Settings,
  PlusCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    tenant,
    currentUser,
    setCurrentUserRole,
    createOrEditQuotation,
    setIsDemoTourOpen,
    resetToDemoData,
    quotations
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: any; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText, count: quotations.length },
    { id: 'menus', label: 'Menus', icon: Layers },
    { id: 'food-items', label: 'Food Items', icon: UtensilsCrossed },
    { id: 'cuisines', label: 'Cuisines', icon: Globe2 },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className="sidebar no-print"
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        padding: '20px 16px',
        overflowY: 'auto'
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '0 8px 16px', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--primary)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(124, 92, 252, 0.3)'
            }}
          >
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="font-heading"
                style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}
              >
                MenuQuote
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary-dark)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                SaaS
              </span>
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                marginTop: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '160px'
              }}
              title={tenant.name}
            >
              {tenant.name}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div style={{ padding: '16px 0 12px' }}>
        <button
          onClick={() => createOrEditQuotation()}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '13.5px' }}
        >
          <PlusCircle size={17} />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            color: 'var(--text-muted)',
            padding: '8px 12px 4px'
          }}
        >
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'quotations' && (activeTab === 'quotation-builder' || activeTab === 'quotation-preview')) ||
            (item.id === 'menus' && activeTab === 'menu-builder');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
                color: isActive ? 'var(--primary-dark)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? '#FFFFFF' : 'var(--surface-secondary)',
                    color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)'
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expo Demo Tour Button */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => setIsDemoTourOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-lighter)',
            color: 'var(--primary-dark)',
            border: '1px solid #E4DCFD',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <Sparkles size={16} color="var(--primary)" />
          <span>Expo 3-Min Demo Tour</span>
        </button>

        {/* User Role Switcher */}
        <div
          style={{
            backgroundColor: 'var(--surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border)'
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              Role: {currentUser.role}
            </div>
          </div>
          <select
            value={currentUser.role}
            onChange={(e) => setCurrentUserRole(e.target.value as any)}
            style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
            title="Switch User Role"
          >
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="sales">Sales</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Reset Demo Data */}
        <button
          onClick={resetToDemoData}
          title="Reset to default Royal Feast Catering sample data"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '5px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '11px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <RotateCcw size={12} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
