import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { ChevronRight, Play } from 'lucide-react';

export const DemoTourModal: React.FC = () => {
  const {
    isDemoTourOpen,
    setIsDemoTourOpen,
    currentDemoStep,
    setCurrentDemoStep,
    setActiveTab,
    viewQuotation,
    startQuoteFromMenu
  } = useApp();

  const steps = [
    {
      step: 1,
      title: 'Welcome to MenuQuote Expo Showcase',
      tagline: 'Build menus. Create quotations. Win events.',
      description:
        'MenuQuote allows catering and event companies to eliminate spreadsheet errors, build reusable culinary menus, and calculate customer quotes in under 2 minutes.',
      actionLabel: 'Explore Dashboard & Metrics',
      action: () => {
        setActiveTab('dashboard');
      }
    },
    {
      step: 2,
      title: 'Reusable Culinary Catalog & Cuisines',
      tagline: 'Organize by regional cuisines, meal courses & live counters.',
      description:
        'Maintain a single source of truth for food items with vegetarian tagging, price per person/plate, and cost margin calculations.',
      actionLabel: 'View Food Catalog',
      action: () => {
        setActiveTab('food-items');
      }
    },
    {
      step: 3,
      title: 'Pre-Packaged Reusable Menus',
      tagline: 'Build once. Reuse across hundreds of events.',
      description:
        'Menus like the "Premium Kerala Wedding Menu" contain 12 categorized dishes with a base price of ₹650 per guest. Edit them without affecting previous quotes.',
      actionLabel: 'Inspect Reusable Menus',
      action: () => {
        setActiveTab('menus');
      }
    },
    {
      step: 4,
      title: 'Quotation Engine: Instant Calculation',
      tagline: '650 Guests × ₹650/pax = ₹4,22,500 automatically calculated.',
      description:
        'Select client Rahul Menon, pick the base menu, input 650 guests. Add extra Dosa Live Counter (+₹12,000) and Fresh Juice (+₹39,000) with real-time tax and discounts.',
      actionLabel: 'Open Quotation Builder',
      action: () => {
        startQuoteFromMenu('menu-kerala-wedding');
      }
    },
    {
      step: 5,
      title: 'Client-Ready Proposal & WhatsApp Share',
      tagline: 'Letterhead PDF export & one-click WhatsApp sharing.',
      description:
        'Generate a clean, high-contrast customer quotation complete with company FSSAI/GSTIN details, itemized dishes, payment milestones, and instant acceptance status.',
      actionLabel: 'View Customer Proposal (QT-2026-0148)',
      action: () => {
        viewQuotation('quot-1');
      }
    }
  ];

  const current = steps[currentDemoStep] || steps[0];

  const handleNext = () => {
    current.action();
    if (currentDemoStep < steps.length - 1) {
      setCurrentDemoStep(currentDemoStep + 1);
    } else {
      setIsDemoTourOpen(false);
      setCurrentDemoStep(0);
    }
  };

  return (
    <Modal
      isOpen={isDemoTourOpen}
      onClose={() => setIsDemoTourOpen(false)}
      title="Interactive Expo Demo Story"
      subtitle={`Step ${currentDemoStep + 1} of ${steps.length}`}
      maxWidth="560px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <button
            onClick={() => {
              setIsDemoTourOpen(false);
              setCurrentDemoStep(0);
            }}
            className="btn btn-ghost btn-sm"
          >
            Exit Demo
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentDemoStep > 0 && (
              <button
                onClick={() => {
                  const prev = currentDemoStep - 1;
                  setCurrentDemoStep(prev);
                  steps[prev].action();
                }}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
            )}
            <button onClick={handleNext} className="btn btn-primary btn-sm">
              <span>{currentDemoStep === steps.length - 1 ? 'Finish Showcase' : 'Next Step'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Step Indicator Progress */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: i <= currentDemoStep ? 'var(--primary)' : 'var(--border)'
              }}
            />
          ))}
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--primary-lighter)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #E8E1FD'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
              {current.step}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>
              {current.tagline}
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {current.title}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {current.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              current.action();
              setIsDemoTourOpen(false);
            }}
            className="btn btn-soft-primary"
            style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
          >
            <Play size={16} fill="var(--primary-dark)" />
            <span>Go to: {current.actionLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
