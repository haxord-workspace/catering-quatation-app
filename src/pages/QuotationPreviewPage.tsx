import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  formatDate,
  numberToWordsINR
} from '../utils/formatters';
import {
  ArrowLeft,
  Printer,
  Share2,
  Copy,
  Flame,
  GlassWater,
  UtensilsCrossed,
  Smartphone
} from 'lucide-react';
import { MenuItem, Quotation, QuotationExtraItem } from '../types';

export const QuotationPreviewPage: React.FC = () => {
  const {
    selectedQuotationId,
    quotations,
    tenant,
    updateQuotationStatus,
    setActiveTab,
    addToast
  } = useApp();

  const [isClientPortalMode, setIsClientPortalMode] = useState(false);

  const quotation =
    quotations.find((q: Quotation) => q.id === selectedQuotationId) || quotations[0];

  if (!quotation) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>No quotation selected</h3>
        <button onClick={() => setActiveTab('quotations')} className="btn btn-primary" style={{ marginTop: '12px' }}>
          Go to Quotations
        </button>
      </div>
    );
  }

  // Group included menu items by category
  const groupedMenu: { [category: string]: MenuItem[] } = {};
  quotation.includedItems.forEach((item: MenuItem) => {
    const cat = item.categoryName || 'Dishes';
    if (!groupedMenu[cat]) groupedMenu[cat] = [];
    groupedMenu[cat].push(item);
  });

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const message = `*CATERING QUOTATION - ${tenant.name}*\n\n` +
      `Dear ${quotation.customerName},\n` +
      `Thank you for considering us for *${quotation.eventName}*!\n\n` +
      `📅 *Date:* ${formatDate(quotation.eventDate)}\n` +
      `👥 *Guests:* ${quotation.guestCount} Pax\n` +
      `📍 *Venue:* ${quotation.eventVenue || 'As selected'}\n` +
      `🍽️ *Menu:* ${quotation.baseMenuName || 'Custom Menu'}\n\n` +
      `💰 *Grand Total:* ${formatCurrency(quotation.grandTotal)} (incl. Live counters & GST)\n` +
      `💳 *Advance Required:* ${formatCurrency(quotation.advanceRequired)}\n\n` +
      `View full proposal details online or download PDF.\n\n` +
      `Warm regards,\n*${quotation.preparedBy}*\n${tenant.phone}`;

    const url = `https://wa.me/${quotation.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'success',
      title: 'Proposal Link Copied',
      message: 'Shareable client proposal link copied to clipboard.'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('quotations')}
            className="btn btn-secondary btn-icon"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="page-title font-heading" style={{ fontSize: '20px' }}>
                {quotation.quotationNumber}
              </h1>
              <span
                className={`badge ${
                  quotation.status === 'Accepted'
                    ? 'badge-success'
                    : quotation.status === 'Sent'
                    ? 'badge-primary'
                    : 'badge-warning'
                }`}
              >
                {quotation.status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {quotation.eventName} • {quotation.customerName}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setIsClientPortalMode(!isClientPortalMode)}
            className="btn btn-secondary btn-sm"
            title="Preview how customer sees this on mobile"
          >
            <Smartphone size={15} />
            <span>{isClientPortalMode ? 'Admin View' : 'Client Mobile View'}</span>
          </button>

          <button onClick={handleWhatsAppShare} className="btn btn-secondary btn-sm" style={{ color: '#25D366' }}>
            <Share2 size={15} />
            <span>WhatsApp Share</span>
          </button>

          <button onClick={handleCopyLink} className="btn btn-secondary btn-sm">
            <Copy size={15} />
            <span>Copy Link</span>
          </button>

          <button onClick={handlePrint} className="btn btn-primary btn-sm">
            <Printer size={15} />
            <span>Print / Download PDF</span>
          </button>

          <select
            value={quotation.status}
            onChange={(e) => updateQuotationStatus(quotation.id, e.target.value as any)}
            className="form-select"
            style={{ width: 'auto', height: '36px', fontSize: '13px', padding: '0 10px' }}
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent to Client</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Accepted">Accepted / Confirmed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Letterhead Proposal Document */}
      <div
        className="quotation-document"
        style={{
          maxWidth: isClientPortalMode ? '480px' : '880px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: isClientPortalMode ? '24px' : 'var(--radius-lg)',
          boxShadow: isClientPortalMode
            ? '0 10px 40px rgba(0,0,0,0.15)'
            : 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          padding: isClientPortalMode ? '20px' : '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Header Letterhead */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            borderBottom: '2px solid var(--primary-soft)',
            paddingBottom: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(124, 92, 252, 0.3)'
                }}
              >
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <h2 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {tenant.name}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: 500 }}>
                  {tenant.tagline}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
              <div>{tenant.address}</div>
              <div>
                Phone: {tenant.phone} • Email: {tenant.email}
              </div>
              {tenant.gstin && <div>GSTIN: {tenant.gstin} | FSSAI: {tenant.fssai}</div>}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--primary-dark)',
                backgroundColor: 'var(--primary-soft)',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'inline-block',
                marginBottom: '6px'
              }}
            >
              CATERING PROPOSAL
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {quotation.quotationNumber}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Date: {formatDate(quotation.createdAt)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Valid Until: {formatDate(quotation.validUntil)}
            </div>
          </div>
        </div>

        {/* Customer & Event Details Box */}
        <div
          style={{
            backgroundColor: 'var(--surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Prepared For
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {quotation.customerName}
            </div>
            {quotation.customerCompany && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {quotation.customerCompany}
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {quotation.customerPhone} • {quotation.customerEmail}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Event Particulars
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {quotation.eventName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Date: <strong>{formatDate(quotation.eventDate)}</strong>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Guest Count: <strong>{quotation.guestCount} Guests</strong>
            </div>
            {quotation.eventVenue && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Venue: {quotation.eventVenue}
              </div>
            )}
          </div>
        </div>

        {/* Selected Menu Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--divider)', paddingBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                {quotation.baseMenuName || 'Selected Food Menu'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Base Package: {formatCurrency(quotation.menuPricePerPerson)} per person
              </span>
            </div>
            <span className="badge badge-primary">
              {quotation.includedItems.length} Dishes
            </span>
          </div>

          {/* Categorized Food Items Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isClientPortalMode ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
            {Object.keys(groupedMenu).map((catName) => (
              <div
                key={catName}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary-dark)',
                    borderBottom: '1px solid var(--divider)',
                    paddingBottom: '4px'
                  }}
                >
                  {catName}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {groupedMenu[catName].map((item: MenuItem) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                      <span className={item.isVegetarian ? 'veg-icon' : 'non-veg-icon'} style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {item.foodName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Counters & Drink Stations */}
        {quotation.additionalItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '6px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
                Special Live Counters & Beverages
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quotation.additionalItems.map((extra: QuotationExtraItem) => (
                <div
                  key={extra.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {extra.type === 'Live Counter' ? (
                      <Flame size={16} color="var(--warning-text)" />
                    ) : (
                      <GlassWater size={16} color="var(--info-text)" />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{extra.name}</div>
                      {extra.notes && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {extra.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--primary-dark)' }}>
                      {formatCurrency(extra.total)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {extra.quantity} {extra.unit} @ {formatCurrency(extra.rate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commercial Pricing Summary */}
        <div
          style={{
            borderTop: '2px solid var(--divider)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Base Food Menu ({quotation.guestCount} Guests × {formatCurrency(quotation.menuPricePerPerson)})
            </span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(quotation.menuTotal)}</span>
          </div>

          {quotation.additionalItems.map((extra: QuotationExtraItem) => (
            <div key={extra.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>+ {extra.name}</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(extra.total)}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', paddingTop: '4px', borderTop: '1px dashed var(--divider)' }}>
            <span style={{ fontWeight: 600 }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(quotation.subtotal)}</span>
          </div>

          {quotation.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--success-text)' }}>
              <span>Discount ({quotation.discountType === 'percentage' ? `${quotation.discountValue}%` : 'Special Promo'})</span>
              <span>- {formatCurrency(quotation.discountAmount)}</span>
            </div>
          )}

          {quotation.taxAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <span>Catering GST ({quotation.taxRate}%)</span>
              <span>+ {formatCurrency(quotation.taxAmount)}</span>
            </div>
          )}

          {/* Grand Total Box */}
          <div
            style={{
              marginTop: '10px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-soft)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-dark)' }}>
                GRAND TOTAL AMOUNT
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-dark)' }}>
                {formatCurrency(quotation.grandTotal)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontStyle: 'italic' }}>
                {numberToWordsINR(quotation.grandTotal)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--primary-dark)' }}>
                Advance Deposit: <strong>{formatCurrency(quotation.advanceRequired)}</strong>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--primary-dark)' }}>
                Balance Payable: <strong>{formatCurrency(quotation.balanceAmount)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Payment Information */}
        <div style={{ display: 'grid', gridTemplateColumns: isClientPortalMode ? '1fr' : '1.4fr 1fr', gap: '20px', fontSize: '12px', borderTop: '1px solid var(--divider)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Terms & Conditions
            </div>
            <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {quotation.terms?.map((t: string, idx: number) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          {tenant.bankDetails && (
            <div
              style={{
                backgroundColor: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                Bank & UPI Details
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Bank: {tenant.bankDetails.bankName}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Account: {tenant.bankDetails.accountNumber}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                IFSC: {tenant.bankDetails.ifsc}
              </div>
              <div style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>
                UPI ID: {tenant.bankDetails.upiId}
              </div>
            </div>
          )}
        </div>

        {/* Footer Signature */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '20px',
            borderTop: '1px solid var(--divider)',
            fontSize: '12px'
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Prepared by:</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{quotation.preparedBy}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ borderBottom: '1px solid #999', width: '160px', marginBottom: '4px' }} />
            <div style={{ color: 'var(--text-secondary)' }}>Authorized Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};
