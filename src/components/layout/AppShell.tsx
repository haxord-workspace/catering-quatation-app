import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/Toast';
import { DemoTourModal } from '../common/DemoTourModal';
import { PwaInstallBanner } from '../common/PwaInstallBanner';

// Pages
import { DashboardPage } from '../../pages/DashboardPage';
import { FoodCatalogPage } from '../../pages/FoodCatalogPage';
import { CuisinesPage } from '../../pages/CuisinesPage';
import { CategoriesPage } from '../../pages/CategoriesPage';
import { MenusPage } from '../../pages/MenusPage';
import { MenuBuilderPage } from '../../pages/MenuBuilderPage';
import { QuotationsPage } from '../../pages/QuotationsPage';
import { QuotationBuilderPage } from '../../pages/QuotationBuilderPage';
import { QuotationPreviewPage } from '../../pages/QuotationPreviewPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { SettingsPage } from '../../pages/SettingsPage';

export const AppShell: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'food-items':
        return <FoodCatalogPage />;
      case 'cuisines':
        return <CuisinesPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'menus':
        return <MenusPage />;
      case 'menu-builder':
        return <MenuBuilderPage />;
      case 'quotations':
        return <QuotationsPage />;
      case 'quotation-builder':
        return <QuotationBuilderPage />;
      case 'quotation-preview':
        return <QuotationPreviewPage />;
      case 'customers':
        return <CustomersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      {/* Desktop Sidebar (Only visible on >=1024px desktop) */}
      <div className="desktop-sidebar-wrapper desktop-only">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <TopHeader />
        <main className="content-container">
          <PwaInstallBanner />
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Only visible on <1024px mobile/tablet) */}
      <div className="mobile-nav-wrapper mobile-only">
        <MobileNav />
      </div>

      {/* Global Components */}
      <ToastContainer />
      <DemoTourModal />
    </div>
  );
};
