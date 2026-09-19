import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import {
  Home,
  Layers,
  FileText,
  Plus,
  Menu as MenuIcon,
  UtensilsCrossed,
  Globe2,
  FolderTree,
  Users,
  Settings,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    createOrEditQuotation,
    createOrEditMenu,
    setIsDemoTourOpen,
    resetToDemoData,
    currentUser,
    setCurrentUserRole
  } = useApp();

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const isTabActive = (tab: string) => {
    if (tab === 'dashboard' && activeTab === 'dashboard') return true;
    if (tab === 'menus' && (activeTab === 'menus' || activeTab === 'menu-builder')) return true;
    if (tab === 'quotations' && (activeTab === 'quotations' || activeTab === 'quotation-builder' || activeTab === 'quotation-preview')) return true;
    return false;
  };

  return (
    <>
      <nav
        className="mobile-nav md:hidden no-print"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--mobile-nav-height)',
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 40,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Home */}
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            color: isTabActive('dashboard') ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: isTabActive('dashboard') ? 600 : 500,
            fontSize: '11px',
            cursor: 'pointer',
            padding: '6px 12px'
          }}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        {/* Menus */}
        <button
          onClick={() => setActiveTab('menus')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            color: isTabActive('menus') ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: isTabActive('menus') ? 600 : 500,
            fontSize: '11px',
            cursor: 'pointer',
            padding: '6px 12px'
          }}
        >
          <Layers size={20} />
          <span>Menus</span>
        </button>

        {/* Center Create Action */}
        <button
          onClick={() => setIsCreateSheetOpen(true)}
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            boxShadow: '0 4px 12px rgba(124, 92, 252, 0.4)',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          <Plus size={24} />
        </button>

        {/* Quotations */}
        <button
          onClick={() => setActiveTab('quotations')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            color: isTabActive('quotations') ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: isTabActive('quotations') ? 600 : 500,
            fontSize: '11px',
            cursor: 'pointer',
            padding: '6px 12px'
          }}
        >
          <FileText size={20} />
          <span>Quotations</span>
        </button>

        {/* More */}
        <button
          onClick={() => setIsMoreSheetOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            color: isMoreSheetOpen || (!isTabActive('dashboard') && !isTabActive('menus') && !isTabActive('quotations'))
              ? 'var(--primary)'
              : 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '11px',
            cursor: 'pointer',
            padding: '6px 12px'
          }}
        >
          <MenuIcon size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile "+ Create" Action Bottom Sheet */}
      <BottomSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        title="Create New"
        subtitle="Select an action to start building"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <button
            onClick={() => {
              setIsCreateSheetOpen(false);
              createOrEditQuotation();
            }}
            className="card card-interactive"
            style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>New Quotation</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Price quote for client</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsCreateSheetOpen(false);
              createOrEditMenu();
            }}
            className="card card-interactive"
            style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>New Food Menu</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reusable package</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsCreateSheetOpen(false);
              setActiveTab('food-items');
            }}
            className="card card-interactive"
            style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>New Food Item</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dish in catalog</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsCreateSheetOpen(false);
              setActiveTab('customers');
            }}
            className="card card-interactive"
            style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>New Customer</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Client record</div>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* Mobile "More" Drawer Bottom Sheet */}
      <BottomSheet
        isOpen={isMoreSheetOpen}
        onClose={() => setIsMoreSheetOpen(false)}
        title="More Modules"
        subtitle="Explore all catering management tools"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              setActiveTab('food-items');
            }}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
          >
            <UtensilsCrossed size={18} color="var(--primary)" />
            <span>Food Item Catalog</span>
          </button>

          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              setActiveTab('cuisines');
            }}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
          >
            <Globe2 size={18} color="var(--primary)" />
            <span>Cuisines</span>
          </button>

          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              setActiveTab('categories');
            }}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
          >
            <FolderTree size={18} color="var(--primary)" />
            <span>Food Categories</span>
          </button>

          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              setActiveTab('customers');
            }}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
          >
            <Users size={18} color="var(--primary)" />
            <span>Customers Database</span>
          </button>

          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              setActiveTab('settings');
            }}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
          >
            <Settings size={18} color="var(--primary)" />
            <span>Quotation Settings & Branding</span>
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--divider)', margin: '8px 0' }} />

          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              setIsDemoTourOpen(true);
            }}
            className="btn btn-soft-primary"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
          >
            <Sparkles size={18} color="var(--primary)" />
            <span>Expo 3-Min Demo Tour</span>
          </button>

          {/* Role selector in mobile */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '4px'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Active Role:</span>
            <select
              value={currentUser.role}
              onChange={(e) => setCurrentUserRole(e.target.value as any)}
              className="form-select"
              style={{ width: 'auto', height: '36px', padding: '0 8px', fontSize: '13px' }}
            >
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            onClick={() => {
              setIsMoreSheetOpen(false);
              resetToDemoData();
            }}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-muted)', marginTop: '4px' }}
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
};
