import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, Quotation } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  Check,
  Building2
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    quotations,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    viewQuotation,
    searchQuery: globalSearch
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      address: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      company: customer.company || '',
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const query = (localSearch || globalSearch).toLowerCase().trim();

  const filteredCustomers = customers.filter((c: Customer) => {
    if (query) {
      const matchName = c.name.toLowerCase().includes(query);
      const matchPhone = c.phone.toLowerCase().includes(query);
      const matchEmail = c.email.toLowerCase().includes(query);
      const matchComp = c.company?.toLowerCase().includes(query);
      if (!matchName && !matchPhone && !matchEmail && !matchComp) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title font-heading">Customer Database</h1>
          <p className="page-subtitle">
            Client contacts, event history, past proposals, and revenue metrics.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by client name, company, phone, or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px', height: '40px' }}
          />
        </div>
      </div>

      {/* Customers List / Cards */}
      <div className="grid-cards-responsive">
        {filteredCustomers.map((cust: Customer) => {
          const clientQuotations = quotations.filter((q: Quotation) => q.customerId === cust.id);

          return (
            <div
              key={cust.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cust.name}
                  </h3>
                  {cust.company && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Building2 size={13} />
                      <span>{cust.company}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleOpenEdit(cust)}
                    className="btn-ghost btn-icon btn-sm"
                    title="Edit Customer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteCustomer(cust.id)}
                    className="btn-danger-ghost btn-icon btn-sm"
                    title="Delete Customer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="var(--primary)" />
                  <span>{cust.phone}</span>
                </div>
                {cust.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} color="var(--primary)" />
                    <span>{cust.email}</span>
                  </div>
                )}
                {cust.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{cust.address}</span>
                  </div>
                )}
              </div>

              {/* Upcoming Event or Note */}
              {cust.upcomingEvent && (
                <div
                  style={{
                    backgroundColor: 'var(--primary-soft)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    color: 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={13} />
                  <span>{cust.upcomingEvent}</span>
                </div>
              )}

              {/* Quotations summary pill */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--divider)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>
                  {clientQuotations.length} Quotations
                </span>

                {clientQuotations.length > 0 && (
                  <button
                    onClick={() => viewQuotation(clientQuotations[0].id)}
                    className="btn-ghost btn-sm"
                    style={{ fontSize: '11.5px', padding: '2px 6px' }}
                  >
                    View Latest Quote
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        subtitle="Manage client contact and corporate particulars."
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              <Check size={16} />
              <span>{editingCustomer ? 'Save Customer' : 'Add Customer'}</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Menon"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 94471 23456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company / Organization (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Menon & Co. Architects"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address / Location</label>
            <input
              type="text"
              placeholder="Panampilly Nagar, Kochi, Kerala"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Notes & Event Preferences</label>
            <textarea
              placeholder="Prefers spicy roasts, live counters, etc..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-textarea"
              rows={2}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
