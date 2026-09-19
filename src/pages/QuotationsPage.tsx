import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quotation } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  FileText,
  Plus,
  Search,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

export const QuotationsPage: React.FC = () => {
  const {
    quotations,
    createOrEditQuotation,
    viewQuotation,
    deleteQuotation,
    searchQuery: globalSearch
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const statuses: { label: string; value: string }[] = [
    { label: 'All Quotations', value: 'all' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Sent', value: 'Sent' },
    { label: 'Negotiation', value: 'Negotiation' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  const query = (localSearch || globalSearch).toLowerCase().trim();

  const filteredQuotations = quotations.filter((q: Quotation) => {
    if (selectedStatus !== 'all' && q.status !== selectedStatus) return false;
    if (query) {
      const matchNum = q.quotationNumber.toLowerCase().includes(query);
      const matchCustomer = q.customerName.toLowerCase().includes(query);
      const matchEvent = q.eventName.toLowerCase().includes(query);
      const matchVenue = q.eventVenue?.toLowerCase().includes(query);
      if (!matchNum && !matchCustomer && !matchEvent && !matchVenue) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title font-heading">Event Quotations</h1>
          <p className="page-subtitle">
            Manage commercial proposals, guest pricing, and client proposals.
          </p>
        </div>
        <button onClick={() => createOrEditQuotation()} className="btn btn-primary">
          <Plus size={16} />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div
        className="card"
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statuses.map((s) => {
            const count =
              s.value === 'all'
                ? quotations.length
                : quotations.filter((q: Quotation) => q.status === s.value).length;
            const isSelected = selectedStatus === s.value;

            return (
              <button
                key={s.value}
                onClick={() => setSelectedStatus(s.value)}
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
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by quote #, client name, event, or venue..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px', height: '40px' }}
          />
        </div>
      </div>

      {/* Quotation List */}
      {filteredQuotations.length === 0 ? (
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
            <FileText size={26} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 600 }}>No quotations found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Select a reusable menu and build your first customer quotation.
          </p>
          <button onClick={() => createOrEditQuotation()} className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>
            <Plus size={15} />
            <span>Create Quotation</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredQuotations.map((q: Quotation) => {
            let badgeClass = 'badge-neutral';
            if (q.status === 'Accepted') badgeClass = 'badge-success';
            else if (q.status === 'Sent') badgeClass = 'badge-primary';
            else if (q.status === 'Negotiation') badgeClass = 'badge-warning';
            else if (q.status === 'Rejected') badgeClass = 'badge-danger';

            return (
              <div
                key={q.id}
                className="card card-interactive"
                onClick={() => viewQuotation(q.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                {/* Left: Proposal Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                      {q.eventName}
                    </span>
                    <span className={`badge ${badgeClass}`}>{q.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                      {q.customerName}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {formatDate(q.eventDate)}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} /> {q.guestCount} Guests
                    </span>
                  </div>

                  {q.eventVenue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      <MapPin size={12} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                        {q.eventVenue}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Commercials & Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    marginLeft: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      {formatCurrency(q.grandTotal)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {q.quotationNumber}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => viewQuotation(q.id)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 12px' }}
                    >
                      <span>Proposal</span>
                      <ArrowUpRight size={14} />
                    </button>

                    <button
                      onClick={() => createOrEditQuotation(q.id)}
                      className="btn-ghost btn-icon btn-sm"
                      title="Edit Quotation"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => deleteQuotation(q.id)}
                      className="btn-danger-ghost btn-icon btn-sm"
                      title="Delete Quotation"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
