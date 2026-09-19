import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuotationTemplateStyle, UserRole } from '../types';
import {
  Building2,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    tenant,
    updateTenant,
    templateSettings,
    updateTemplateSettings,
    currentUser,
    setCurrentUserRole
  } = useApp();

  // Tenant Form
  const [tenantForm, setTenantForm] = useState({
    name: tenant.name,
    tagline: tenant.tagline,
    location: tenant.location,
    address: tenant.address,
    phone: tenant.phone,
    email: tenant.email,
    gstin: tenant.gstin || '',
    fssai: tenant.fssai || '',
    bankName: tenant.bankDetails?.bankName || '',
    accountNumber: tenant.bankDetails?.accountNumber || '',
    ifsc: tenant.bankDetails?.ifsc || '',
    upiId: tenant.bankDetails?.upiId || ''
  });

  const [activeSettingsTab, setActiveSettingsTab] = useState<'company' | 'template' | 'roles'>('company');

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenant({
      name: tenantForm.name,
      tagline: tenantForm.tagline,
      location: tenantForm.location,
      address: tenantForm.address,
      phone: tenantForm.phone,
      email: tenantForm.email,
      gstin: tenantForm.gstin,
      fssai: tenantForm.fssai,
      bankDetails: {
        bankName: tenantForm.bankName,
        accountName: tenant.name,
        accountNumber: tenantForm.accountNumber,
        ifsc: tenantForm.ifsc,
        upiId: tenantForm.upiId
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 className="page-title font-heading">Settings & Branding</h1>
        <p className="page-subtitle">
          Configure catering company profiles, quotation styles, bank details, and staff roles.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveSettingsTab('company')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeSettingsTab === 'company' ? 'var(--primary-soft)' : 'transparent',
            color: activeSettingsTab === 'company' ? 'var(--primary-dark)' : 'var(--text-secondary)',
            fontWeight: activeSettingsTab === 'company' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} />
          <span>Company Profile & Bank</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('template')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeSettingsTab === 'template' ? 'var(--primary-soft)' : 'transparent',
            color: activeSettingsTab === 'template' ? 'var(--primary-dark)' : 'var(--text-secondary)',
            fontWeight: activeSettingsTab === 'template' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={16} />
          <span>Quotation Presentation</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('roles')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeSettingsTab === 'roles' ? 'var(--primary-soft)' : 'transparent',
            color: activeSettingsTab === 'roles' ? 'var(--primary-dark)' : 'var(--text-secondary)',
            fontWeight: activeSettingsTab === 'roles' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldCheck size={16} />
          <span>Roles & Permissions</span>
        </button>
      </div>

      {/* Tab 1: Company Profile */}
      {activeSettingsTab === 'company' && (
        <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Catering Business Particulars</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Tagline</label>
                <input
                  type="text"
                  value={tenantForm.tagline}
                  onChange={(e) => setTenantForm({ ...tenantForm, tagline: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={tenantForm.phone}
                  onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={tenantForm.email}
                  onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location (City, State)</label>
                <input
                  type="text"
                  value={tenantForm.location}
                  onChange={(e) => setTenantForm({ ...tenantForm, location: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Complete Office / Kitchen Address</label>
              <input
                type="text"
                value={tenantForm.address}
                onChange={(e) => setTenantForm({ ...tenantForm, address: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">GSTIN Number</label>
                <input
                  type="text"
                  placeholder="32AAECR1234F1Z8"
                  value={tenantForm.gstin}
                  onChange={(e) => setTenantForm({ ...tenantForm, gstin: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">FSSAI License #</label>
                <input
                  type="text"
                  placeholder="11322007000189"
                  value={tenantForm.fssai}
                  onChange={(e) => setTenantForm({ ...tenantForm, fssai: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Bank & Settlement Details */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Bank & Settlement Particulars</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  placeholder="HDFC Bank Ltd."
                  value={tenantForm.bankName}
                  onChange={(e) => setTenantForm({ ...tenantForm, bankName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  placeholder="50200084729103"
                  value={tenantForm.accountNumber}
                  onChange={(e) => setTenantForm({ ...tenantForm, accountNumber: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  placeholder="HDFC0001245"
                  value={tenantForm.ifsc}
                  onChange={(e) => setTenantForm({ ...tenantForm, ifsc: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">UPI ID for Quick QR</label>
                <input
                  type="text"
                  placeholder="royalfeast@hdfcbank"
                  value={tenantForm.upiId}
                  onChange={(e) => setTenantForm({ ...tenantForm, upiId: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Save Company Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Quotation Presentation */}
      {activeSettingsTab === 'template' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Quotation Style</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {(['Minimal', 'Classic', 'Premium'] as QuotationTemplateStyle[]).map((style) => {
                const isSelected = templateSettings.style === style;
                return (
                  <div
                    key={style}
                    onClick={() => updateTemplateSettings({ style })}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? 'var(--primary-dark)' : 'inherit' }}>
                      {style}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {style === 'Minimal'
                        ? 'Crisp white with violet accents'
                        : style === 'Classic'
                        ? 'Traditional structured format'
                        : 'Editorial luxury catering layout'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Roles & Permissions */}
      {activeSettingsTab === 'roles' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Role-Based Access Control (RBAC)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Permissions assigned to active profile.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Active Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                className="form-select"
                style={{ width: 'auto', height: '36px' }}
              >
                <option value="owner">Owner (Full Admin)</option>
                <option value="manager">Manager</option>
                <option value="sales">Sales Executive</option>
                <option value="staff">Catering Staff</option>
              </select>
            </div>
          </div>

          {/* Matrix table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                  <th style={{ padding: '10px 14px' }}>Module / Action</th>
                  <th style={{ padding: '10px 14px' }}>Owner</th>
                  <th style={{ padding: '10px 14px' }}>Manager</th>
                  <th style={{ padding: '10px 14px' }}>Sales</th>
                  <th style={{ padding: '10px 14px' }}>Staff</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>Create & Edit Menus</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Full</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Full</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>View Only</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Assigned Only</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>Generate Customer Quotations</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Full</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Full</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Full</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>View Only</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>Override Food Dish Pricing</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Allowed</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Allowed</td>
                  <td style={{ padding: '10px 14px', color: 'var(--warning-text)' }}>With Approval</td>
                  <td style={{ padding: '10px 14px', color: 'var(--danger-text)' }}>✗ Restricted</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>Company Branding & Bank Config</td>
                  <td style={{ padding: '10px 14px', color: 'var(--success-text)' }}>✓ Full</td>
                  <td style={{ padding: '10px 14px', color: 'var(--danger-text)' }}>✗ Restricted</td>
                  <td style={{ padding: '10px 14px', color: 'var(--danger-text)' }}>✗ Restricted</td>
                  <td style={{ padding: '10px 14px', color: 'var(--danger-text)' }}>✗ Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
