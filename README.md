# MenuQuote | Catering Food Menu & Quotation Management SaaS (PWA)

> **Build menus. Create quotations. Win events.**
> A modern, multi-tenant food menu and quotation platform designed specifically for catering companies, banquet halls, and event planners.

---

## 🌟 Key Features

- **🍽️ Reusable Food Item Catalog**: Maintain master dish repository with prices, estimated food costs, profit margins, vegetarian flags, and unit specifications (Per Person, Per Plate, Per Piece, Fixed).
- **🌍 Regional Cuisines & Meal Courses**: Categorize dishes across Kerala, South Indian, North Indian, Mughlai, Arabic, Continental, Indo-Chinese and meal courses (Welcome Drinks, Starters, Breads, Curries, Live Counters, Desserts).
- **📋 Reusable Menu Builder**: Create pre-packaged menus (e.g. *Premium Kerala Wedding Menu*, *Traditional Sadya*, *Corporate Lunch*) with predefined per-guest rates.
- **⚡ Guided Quotation Engine**:
  - 1-click base menu loading with automated guest calculation (`650 guests × ₹650/pax = ₹4,22,500`).
  - Item customization without altering the original master menu template.
  - Live Counters add-on (e.g. *Dosa Live Counter ₹12,000*) & Beverage Stations (e.g. *Fresh Fruit Juice ₹39,000*).
  - Commercials calculation with Flat/% Discounts, GST Tax, Advance deposit tracking, and Balance due.
- **📄 Customer Proposal & Letterhead PDF Export**:
  - Client-ready proposal view with company logo, GSTIN, FSSAI, itemized menu, and bank/UPI details.
  - Native high-contrast print-to-PDF formatting.
  - Direct WhatsApp Proposal message generator with pre-filled event breakdown.
  - Customer Mobile View simulator.
- **👥 Multi-Tenant & RBAC Ready**: Isolated workspace per catering company with customizable roles (*Owner*, *Manager*, *Sales*, *Staff*).
- **✨ 3-Minute Expo Demo Story Tour**: Interactive walkthrough showcase for expo demonstrations.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Custom Modern SaaS Design System (Soft Violet `#7C5CFC` & White `#FAF9FC`, Inter Typography)
- **Icons**: Lucide React
- **Architecture**: PWA Responsive (Desktop 2-column workspaces, Mobile bottom nav & bottom sheets)

---

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🏢 Demo Company Profile

- **Company**: Royal Feast Catering
- **Location**: Kochi, Kerala, India
- **Currency**: INR (₹) with Indian numbering format (Lakhs & Crores)
- **Sample Quotation**: `QT-2026-0148` for Rahul Menon (Rahul & Anjali Wedding Reception)
