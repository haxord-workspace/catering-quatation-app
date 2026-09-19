import React from 'react';
import { useApp } from '../context/AppContext';
import { Menu, MenuItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Layers,
  Plus,
  ArrowUpRight,
  Copy,
  Edit2,
  Trash2,
  UtensilsCrossed
} from 'lucide-react';

export const MenusPage: React.FC = () => {
  const {
    menus,
    createOrEditMenu,
    duplicateMenu,
    deleteMenu,
    startQuoteFromMenu
  } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title font-heading">Reusable Food Menus</h1>
          <p className="page-subtitle">
            Pre-packaged menus designed to be inserted into customer quotations with 1 click.
          </p>
        </div>
        <button onClick={() => createOrEditMenu()} className="btn btn-primary">
          <Plus size={16} />
          <span>New Food Menu</span>
        </button>
      </div>

      {/* Menus Grid */}
      {menus.length === 0 ? (
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
            <Layers size={26} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Create your first menu</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Combine your favorite dishes into a reusable menu for future event quotations.
          </p>
          <button onClick={() => createOrEditMenu()} className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>
            <Plus size={15} />
            <span>Create Menu</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {menus.map((menu: Menu) => {
            const vegCount = menu.items.filter((i: MenuItem) => i.isVegetarian).length;
            const nonVegCount = menu.items.length - vegCount;

            return (
              <div
                key={menu.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                {/* Top: Header & Tags */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {menu.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {menu.cuisineTags.map((tag: string) => (
                        <span key={tag} className="badge badge-primary" style={{ fontSize: '11px' }}>
                          {tag}
                        </span>
                      ))}
                      {menu.tags?.map((t: string) => (
                        <span key={t} className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      {formatCurrency(menu.pricePerPerson)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per guest</div>
                  </div>
                </div>

                {/* Description */}
                {menu.description && (
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {menu.description}
                  </p>
                )}

                {/* Items Summary Pills */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UtensilsCrossed size={14} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {menu.items.length} Included Dishes
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
                    <span>{vegCount} Veg</span>
                    {nonVegCount > 0 && <span>• {nonVegCount} Non-Veg</span>}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--divider)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <button
                    onClick={() => startQuoteFromMenu(menu.id)}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '6px 14px' }}
                  >
                    <span>Create Quotation</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => duplicateMenu(menu.id)}
                      className="btn-ghost btn-icon btn-sm"
                      title="Duplicate Menu"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => createOrEditMenu(menu.id)}
                      className="btn-ghost btn-icon btn-sm"
                      title="Edit Menu"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteMenu(menu.id)}
                      className="btn-danger-ghost btn-icon btn-sm"
                      title="Delete Menu"
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
