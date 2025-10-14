# Design Guidelines: GS1 Digital Link Generator

## Design Approach

**Selected Approach:** Design System - Material Design 3 inspired
**Rationale:** This is a utility-focused product management tool requiring clarity, efficiency, and professional presentation. Material Design provides excellent form handling patterns, clear data visualization, and a scalable component system suitable for both data entry and product display contexts.

**Core Principles:**
- **Clarity First:** Every element serves a functional purpose
- **Professional Credibility:** Conveys trustworthiness for product data management
- **Efficient Workflows:** Minimize friction in GTIN lookup and product entry
- **Technical Precision:** Reflect the accuracy required for GS1 standards

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 220 70% 50% (Professional blue for CTAs, active states)
- Surface: 0 0% 100% (Pure white for cards, forms)
- Background: 220 15% 97% (Subtle off-white for page background)
- Border: 220 13% 91% (Soft borders for inputs, cards)
- Text Primary: 220 15% 20% (Near-black for readability)
- Text Secondary: 220 10% 45% (Muted for labels, hints)
- Success: 142 76% 36% (For successful operations)
- Error: 0 72% 51% (For validation errors)

**Dark Mode:**
- Primary: 220 70% 60% (Lighter blue for dark backgrounds)
- Surface: 220 15% 12% (Elevated cards)
- Background: 220 15% 8% (Deep background)
- Border: 220 10% 20% (Subtle borders)
- Text Primary: 220 15% 95% (High contrast white)
- Text Secondary: 220 10% 65% (Muted labels)

**Accent (Sparingly):**
- Use only for critical status indicators (GTIN validation, upload states)
- Warning: 38 92% 50% (Amber for alerts)

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - Exceptional readability for forms and data
- Monospace: 'JetBrains Mono' - For GTIN codes, technical data

**Type Scale:**
- Hero/Page Titles: text-4xl (36px) font-bold
- Section Headers: text-2xl (24px) font-semibold
- Form Labels: text-sm (14px) font-medium uppercase tracking-wide
- Input Text: text-base (16px) font-normal
- Body Text: text-base (16px) leading-relaxed
- GTIN Display: text-lg (18px) font-mono
- Helper Text: text-sm (14px) text-secondary
- Barcode Labels: text-xs (12px) font-mono uppercase

### C. Layout System

**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 24
- Form field spacing: gap-6 (24px between fields)
- Section spacing: py-12 (48px vertical padding)
- Card padding: p-8 (32px internal padding)
- Container max-width: max-w-4xl for forms, max-w-6xl for product displays
- Grid gaps: gap-6 for cards, gap-4 for compact lists

**Responsive Breakpoints:**
- Mobile: Single column, full-width forms
- Tablet (md:): 2-column form layout where appropriate
- Desktop (lg:): Optimal reading width, sidebar possibilities

### D. Component Library

**Form Components:**
- **Input Fields:** Outlined style with floating labels, focus:ring-2 ring-primary, clear validation states
- **File Upload:** Drag-and-drop zone with prominent dashed border, preview thumbnails, format indicators
- **Dynamic Tables:** Add/remove row buttons, clear visual hierarchy with alternating row backgrounds
- **Search/Lookup:** Prominent GTIN input with instant validation feedback (green checkmark/red X)
- **Submit Actions:** Large, confident primary buttons (px-8 py-3)

**Product Display:**
- **Product Cards:** Clean white/surface cards with subtle shadow (shadow-md), rounded-xl corners
- **Image Display:** Contained within aspect-ratio-square containers, object-cover for consistency
- **Barcode Section:** Prominent monospace display with SVG barcode below (using JsBarcode)
- **Information Tables:** Zebra-striped rows for custom data tables, clear key-value separation

**Navigation:**
- **Header:** Sticky top bar with logo/title, minimal navigation (dark mode toggle)
- **Breadcrumbs:** For product detail pages showing GTIN path
- **Action Buttons:** Floating or fixed for primary actions (Save Product, Create Link)

**Feedback Elements:**
- **Validation Messages:** Inline below inputs with color-coded icons
- **Success Banners:** Green bar at top with checkmark icon and message
- **Loading States:** Spinner with subtle animation during GTIN checks, uploads
- **Empty States:** Friendly illustrations for no products, no image uploaded

### E. Animations

**Minimal and Purposeful:**
- Input focus: Smooth 200ms border color transition
- Card hover: Subtle lift with shadow-lg on hover (for product cards only)
- Success/Error: Gentle slide-in for notification banners (300ms ease-out)
- Loading: Smooth spinner rotation, no bouncing or excessive motion
- **No scroll-triggered animations** - maintain professional focus

---

## Page-Specific Guidelines

### Home/Form Page (Product Entry)
- **Layout:** Centered form container (max-w-4xl), clean white card on subtle background
- **Hierarchy:** GTIN input prominently at top, auto-check on blur
- **Visual Flow:** Logical field progression (GTIN → Name → Details → Image → Custom Tables → Submit)
- **Custom Tables Section:** Collapsible accordion style, each table as a mini card

### Product Detail Page (Digital Link)
- **Hero Section:** Product image large on left (or top on mobile), product name and GTIN on right
- **Information Grid:** 2-column layout (md:) showing all product metadata
- **Barcode Display:** Centered, prominent SVG barcode with GTIN code below in monospace
- **Custom Tables:** Each table as distinct section with header, clean zebra-striped rows
- **Layout:** max-w-6xl container for comfortable reading width

### Error/404 Page
- **Visual:** Centered error message with friendly icon
- **Content:** Clear message about invalid/missing GTIN, suggestion to return home
- **CTA:** Prominent button to return to form page

---

## Images

**Product Images:**
- Display in square aspect ratio containers (aspect-square) for consistency
- Use object-cover to prevent distortion
- Placeholder: Gray background with camera icon SVG when no image uploaded

**No Hero Image Needed** - This is a utility application focused on forms and data entry. Visual impact comes from clean UI, not hero graphics.

**Image Locations:**
1. **Form Page:** Image upload preview (small thumbnail 120x120px)
2. **Product Detail:** Large product image (400x400px desktop, 280x280px mobile)
3. **Product List (if implemented):** Grid of product thumbnails (200x200px)

---

## Accessibility & Dark Mode

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Dark mode: Consistent throughout entire application including all form inputs
- Form inputs in dark mode: Lighter surface (220 15% 12%) with visible borders
- Focus indicators: 2px ring around all interactive elements
- ARIA labels for barcode images, upload zones, dynamic table controls