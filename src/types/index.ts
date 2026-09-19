export type UserRole = 'owner' | 'manager' | 'sales' | 'staff';

export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Negotiation' | 'Accepted' | 'Rejected' | 'Expired';

export type PricingModel = 'Per Person' | 'Fixed Package' | 'Custom';

export type FoodUnit = 
  | 'Per Person' 
  | 'Per Plate' 
  | 'Per Piece' 
  | 'Per Bowl' 
  | 'Per KG' 
  | 'Per Litre' 
  | 'Per Tray' 
  | 'Fixed';

export interface Tenant {
  id: string;
  name: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  gstin?: string;
  fssai?: string;
  currency: string;
  currencySymbol: string;
  logoUrl?: string;
  address: string;
  terms: string[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    accountName: string;
    upiId: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Cuisine {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  itemCount?: number;
  status: 'active' | 'inactive';
}

export interface FoodCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  iconName?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  cuisineId: string;
  cuisineName: string;
  categoryId: string;
  categoryName: string;
  description: string;
  foodImage: string;
  sellingPrice: number;
  estimatedCost: number;
  unit: FoodUnit;
  isVegetarian: boolean;
  isLiveCounter?: boolean;
  isDrink?: boolean;
  isAvailable: boolean;
  preparationNotes?: string;
  status: 'active' | 'archived';
}

export interface MenuItem {
  id: string;
  foodItemId: string;
  foodName: string;
  categoryName: string;
  cuisineName: string;
  isVegetarian: boolean;
  unit: FoodUnit;
  unitPrice: number;
  quantity?: number;
  notes?: string;
  isLiveCounter?: boolean;
  isDrink?: boolean;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  cuisineTags: string[];
  pricingModel: PricingModel;
  pricePerPerson: number;
  fixedPackagePrice?: number;
  items: MenuItem[];
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  categoryOrder?: string[];
  tags?: string[];
}

export interface QuotationExtraItem {
  id: string;
  name: string;
  categoryName: string;
  type: 'Food' | 'Live Counter' | 'Drink' | 'Service' | 'Other';
  quantity: number;
  unit: FoodUnit;
  rate: number;
  total: number;
  notes?: string;
  isVegetarian?: boolean;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  createdAt: string;
  eventDate: string;
  validUntil: string;
  status: QuotationStatus;
  
  // Customer Info
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCompany?: string;

  // Event Info
  eventName: string;
  eventType: string;
  eventVenue: string;
  guestCount: number;

  // Menu Info
  baseMenuId?: string;
  baseMenuName?: string;
  menuPricePerPerson: number;
  menuTotal: number;
  includedItems: MenuItem[];

  // Extras
  additionalItems: QuotationExtraItem[];

  // Commercials
  subtotal: number;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  discountAmount: number;
  taxRate: number; // e.g. 5% or 18%
  taxAmount: number;
  additionalCharges: number;
  additionalChargesLabel?: string;
  grandTotal: number;
  advanceRequired: number;
  balanceAmount: number;

  // Notes & terms
  terms: string[];
  specialInstructions?: string;
  preparedBy: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  address: string;
  notes?: string;
  createdAt: string;
  totalQuotations?: number;
  acceptedQuotations?: number;
  totalRevenue?: number;
  upcomingEvent?: string;
}

export type QuotationTemplateStyle = 'Minimal' | 'Classic' | 'Premium';

export interface QuotationTemplateSettings {
  style: QuotationTemplateStyle;
  primaryColor: string;
  showCoverPage: boolean;
  showItemPrices: boolean;
  showLiveCountersSection: boolean;
  showBankDetails: boolean;
  quotationPrefix: string;
  footerNotes: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'menus' 
  | 'menu-builder' 
  | 'food-items' 
  | 'cuisines' 
  | 'categories' 
  | 'quotations' 
  | 'quotation-builder' 
  | 'quotation-preview' 
  | 'customers' 
  | 'settings';
