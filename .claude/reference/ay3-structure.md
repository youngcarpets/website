# AY3 Website Structure

Quick reference for the old site layout. Source: `_archive/ay3/my-portal/src/routes/young-carpets/`

## Sections

```
Hero
├── Wordmark ("YOUNG")
├── "Proudly Canadian" badge
└── Tagline

Products
├── 9 product type cards (carpet, LVT, hardwood, etc.)
├── Modal popups per product
└── "Also" chip list

Services
├── Commercial Installation
├── Consultation
├── Maintenance & Repair
└── Seasonal Matting

Suppliers
└── Logo carousel (15+ brands)

About
├── "Since 1991" copy
└── 2 stat counters (years experience, jobs completed)

Map
├── Address
└── Embedded Google Maps

Contact
└── Team roster by department (name, phone, email)

Footer
├── Address
├── Phone, fax, hours
└── Social links
```

## Key File Locations

- **Main page:** `_archive/ay3/my-portal/src/routes/young-carpets/+page.svelte`
- **Components:** `_archive/ay3/my-portal/src/routes/young-carpets/components/`
- **Product data:** `_archive/ay3/my-portal/src/routes/young-carpets/data/products.ts`
- **Supplier data:** `_archive/ay3/my-portal/src/routes/young-carpets/data/suppliers.ts`
- **Team data:** `_archive/ay3/my-portal/src/routes/young-carpets/data/team.ts`
- **Design notes:** `_archive/ay3/docs/WEBSITE-IMPROVEMENTS.md`
