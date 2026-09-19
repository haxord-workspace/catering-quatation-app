import React, { createContext, useContext, useState } from 'react';
import {
  Tenant,
  User,
  Cuisine,
  FoodCategory,
  FoodItem,
  Menu,
  Customer,
  Quotation,
  QuotationTemplateSettings,
  ActiveTab,
  QuotationStatus,
  UserRole
} from '../types';
import {
  initialTenant,
  initialUsers,
  initialCuisines,
  initialCategories,
  initialFoodItems,
  initialMenus,
  initialCustomers,
  initialQuotations,
  initialTemplateSettings
} from '../data/seedData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedQuotationId: string | null;
  setSelectedQuotationId: (id: string | null) => void;
  editingMenuId: string | null;
  setEditingMenuId: (id: string | null) => void;
  editingQuotationId: string | null;
  setEditingQuotationId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Multi-tenant & Auth
  tenant: Tenant;
  updateTenant: (tenant: Partial<Tenant>) => void;
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  availableUsers: User[];

  // Entities CRUD
  cuisines: Cuisine[];
  addCuisine: (cuisine: Omit<Cuisine, 'id'>) => void;
  updateCuisine: (id: string, cuisine: Partial<Cuisine>) => void;
  deleteCuisine: (id: string) => void;

  categories: FoodCategory[];
  addCategory: (category: Omit<FoodCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<FoodCategory>) => void;

  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  duplicateFoodItem: (id: string) => void;

  menus: Menu[];
  addMenu: (menu: Omit<Menu, 'id' | 'lastUpdated'>) => string;
  updateMenu: (id: string, menu: Partial<Menu>) => void;
  deleteMenu: (id: string) => void;
  duplicateMenu: (id: string) => void;

  quotations: Quotation[];
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt'>) => string;
  updateQuotation: (id: string, quotation: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => string;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  templateSettings: QuotationTemplateSettings;
  updateTemplateSettings: (settings: Partial<QuotationTemplateSettings>) => void;

  // Actions
  viewQuotation: (id: string) => void;
  createOrEditQuotation: (id?: string) => void;
  createOrEditMenu: (id?: string) => void;
  startQuoteFromMenu: (menuId: string) => void;

  // Feedback & Demo Tour
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;
  isDemoTourOpen: boolean;
  setIsDemoTourOpen: (open: boolean) => void;
  currentDemoStep: number;
  setCurrentDemoStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TENANT: 'menuquote_tenant',
  CUISINES: 'menuquote_cuisines',
  CATEGORIES: 'menuquote_categories',
  FOOD_ITEMS: 'menuquote_food_items',
  MENUS: 'menuquote_menus',
  QUOTATIONS: 'menuquote_quotations',
  CUSTOMERS: 'menuquote_customers',
  TEMPLATE_SETTINGS: 'menuquote_template_settings',
  USER_ROLE: 'menuquote_user_role'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>('quot-1');
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editingQuotationId, setEditingQuotationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo Tour State
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [currentDemoStep, setCurrentDemoStep] = useState(0);

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Multi-tenant & User State
  const [tenant, setTenant] = useState<Tenant>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TENANT);
    return saved ? JSON.parse(saved) : initialTenant;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole | null;
    return initialUsers.find((u) => u.role === savedRole) || initialUsers[0];
  });

  const setCurrentUserRole = (role: UserRole) => {
    const user = initialUsers.find((u) => u.role === role) || {
      id: `user-${role}`,
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      email: `${role}@royalfeast.example`,
      role
    };
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    addToast({
      type: 'info',
      title: `Switched Role to ${role.toUpperCase()}`,
      message: `Permissions adjusted for ${role} profile.`
    });
  };

  const updateTenant = (updates: Partial<Tenant>) => {
    setTenant((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.TENANT, JSON.stringify(next));
      return next;
    });
    addToast({
      type: 'success',
      title: 'Company Profile Updated',
      message: 'Changes saved successfully.'
    });
  };

  // Cuisines State
  const [cuisines, setCuisines] = useState<Cuisine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUISINES);
    return saved ? JSON.parse(saved) : initialCuisines;
  });

  const addCuisine = (cuisineData: Omit<Cuisine, 'id'>) => {
    const newCuisine: Cuisine = {
      ...cuisineData,
      id: `c-${Date.now()}`
    };
    setCuisines((prev) => {
      const next = [newCuisine, ...prev];
      localStorage.setItem(STORAGE_KEYS.CUISINES, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Cuisine Added', message: `${newCuisine.name} has been created.` });
  };

  const updateCuisine = (id: string, updates: Partial<Cuisine>) => {
    setCuisines((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem(STORAGE_KEYS.CUISINES, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Cuisine Updated' });
  };

  const deleteCuisine = (id: string) => {
    setCuisines((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUISINES, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'info', title: 'Cuisine Removed' });
  };

  // Categories State
  const [categories, setCategories] = useState<FoodCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const addCategory = (categoryData: Omit<FoodCategory, 'id'>) => {
    const newCategory: FoodCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => {
      const next = [...prev, newCategory];
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Category Added', message: `${newCategory.name} created.` });
  };

  const updateCategory = (id: string, updates: Partial<FoodCategory>) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      return next;
    });
  };

  // Food Items State
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    return saved ? JSON.parse(saved) : initialFoodItems;
  });

  const addFoodItem = (itemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: `f-${Date.now()}`
    };
    setFoodItems((prev) => {
      const next = [newItem, ...prev];
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Dish Added to Catalog', message: `${newItem.name} is ready for menus.` });
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Food Item Updated' });
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'info', title: 'Food Item Removed' });
  };

  const duplicateFoodItem = (id: string) => {
    const item = foodItems.find((f) => f.id === id);
    if (!item) return;
    const duplicated: FoodItem = {
      ...item,
      id: `f-${Date.now()}`,
      name: `${item.name} (Copy)`
    };
    setFoodItems((prev) => {
      const next = [duplicated, ...prev];
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Food Item Duplicated', message: `Created copy of ${item.name}.` });
  };

  // Menus State
  const [menus, setMenus] = useState<Menu[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENUS);
    return saved ? JSON.parse(saved) : initialMenus;
  });

  const addMenu = (menuData: Omit<Menu, 'id' | 'lastUpdated'>) => {
    const newId = `menu-${Date.now()}`;
    const newMenu: Menu = {
      ...menuData,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setMenus((prev) => {
      const next = [newMenu, ...prev];
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Menu Saved', message: `${newMenu.name} is ready for quotations.` });
    return newId;
  };

  const updateMenu = (id: string, updates: Partial<Menu>) => {
    setMenus((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : m
      );
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Menu Updated' });
  };

  const deleteMenu = (id: string) => {
    setMenus((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'info', title: 'Menu Removed' });
  };

  const duplicateMenu = (id: string) => {
    const m = menus.find((menu) => menu.id === id);
    if (!m) return;
    const duplicated: Menu = {
      ...m,
      id: `menu-${Date.now()}`,
      name: `${m.name} (Copy)`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setMenus((prev) => {
      const next = [duplicated, ...prev];
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Menu Duplicated', message: `Created copy of ${m.name}.` });
  };

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newId = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      totalQuotations: 0,
      acceptedQuotations: 0,
      totalRevenue: 0
    };
    setCustomers((prev) => {
      const next = [newCustomer, ...prev];
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Customer Added', message: `${newCustomer.name} added to records.` });
    return newId;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Customer Profile Updated' });
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'info', title: 'Customer Removed' });
  };

  // Quotations State
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'createdAt'>) => {
    const newId = `quot-${Date.now()}`;
    const newQuotation: Quotation = {
      ...quotationData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotations((prev) => {
      const next = [newQuotation, ...prev];
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(next));
      return next;
    });

    // Update customer stats
    if (newQuotation.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === newQuotation.customerId) {
            return {
              ...c,
              totalQuotations: (c.totalQuotations || 0) + 1,
              upcomingEvent: `${newQuotation.eventName} (${newQuotation.eventDate})`
            };
          }
          return c;
        })
      );
    }

    addToast({
      type: 'success',
      title: 'Quotation Created!',
      message: `${newQuotation.quotationNumber} for ${newQuotation.customerName} generated.`
    });
    return newId;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, ...updates } : q));
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Quotation Updated' });
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => {
      const next = prev.filter((q) => q.id !== id);
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'info', title: 'Quotation Deleted' });
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, status } : q));
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(next));
      return next;
    });
    addToast({
      type: status === 'Accepted' ? 'success' : 'info',
      title: `Status Changed to ${status}`,
      message: `Quotation status is now ${status}.`
    });
  };

  // Template Settings State
  const [templateSettings, setTemplateSettings] = useState<QuotationTemplateSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATE_SETTINGS);
    return saved ? JSON.parse(saved) : initialTemplateSettings;
  });

  const updateTemplateSettings = (settings: Partial<QuotationTemplateSettings>) => {
    setTemplateSettings((prev) => {
      const next = { ...prev, ...settings };
      localStorage.setItem(STORAGE_KEYS.TEMPLATE_SETTINGS, JSON.stringify(next));
      return next;
    });
    addToast({ type: 'success', title: 'Template Settings Saved' });
  };

  // Action Helpers
  const viewQuotation = (id: string) => {
    setSelectedQuotationId(id);
    setActiveTab('quotation-preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createOrEditQuotation = (id?: string) => {
    setEditingQuotationId(id || null);
    setActiveTab('quotation-builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createOrEditMenu = (id?: string) => {
    setEditingMenuId(id || null);
    setActiveTab('menu-builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startQuoteFromMenu = (menuId: string) => {
    setEditingQuotationId(null);
    setActiveTab('quotation-builder');
    sessionStorage.setItem('menuquote_preselected_menu', menuId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setTenant(initialTenant);
    setCuisines(initialCuisines);
    setCategories(initialCategories);
    setFoodItems(initialFoodItems);
    setMenus(initialMenus);
    setQuotations(initialQuotations);
    setCustomers(initialCustomers);
    setTemplateSettings(initialTemplateSettings);
    setCurrentUser(initialUsers[0]);
    setSelectedQuotationId('quot-1');
    setActiveTab('dashboard');
    addToast({
      type: 'success',
      title: 'Demo Data Restored',
      message: 'Workspace reset to default Royal Feast Catering showcase data.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedQuotationId,
        setSelectedQuotationId,
        editingMenuId,
        setEditingMenuId,
        editingQuotationId,
        setEditingQuotationId,
        searchQuery,
        setSearchQuery,
        tenant,
        updateTenant,
        currentUser,
        setCurrentUserRole,
        availableUsers: initialUsers,
        cuisines,
        addCuisine,
        updateCuisine,
        deleteCuisine,
        categories,
        addCategory,
        updateCategory,
        foodItems,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        duplicateFoodItem,
        menus,
        addMenu,
        updateMenu,
        deleteMenu,
        duplicateMenu,
        quotations,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        updateQuotationStatus,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        templateSettings,
        updateTemplateSettings,
        viewQuotation,
        createOrEditQuotation,
        createOrEditMenu,
        startQuoteFromMenu,
        toasts,
        addToast,
        removeToast,
        resetToDemoData,
        isDemoTourOpen,
        setIsDemoTourOpen,
        currentDemoStep,
        setCurrentDemoStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
