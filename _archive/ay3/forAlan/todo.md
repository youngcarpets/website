# Alan's TODO

> **My personal task list for the Young Carpets website.** Separate from Claude's internal working memory. Anything here is stuff *I* need to do — mostly downloading assets that the sandbox can't fetch automatically.
>
> Tick items off as you complete them. For each asset, the path and the code field to flip after you drop the file are listed so you don't have to go digging.
>
> Claude will append new items to this file whenever a new placeholder ships. It will never remove items from here — only you do that.

---

## 🖼️ Material photos for the 6 feature product cards

These replace the symbolic SVG placeholders currently rendering in each product card. The site ships and looks fine without them, but real photo textures are more visceral.

**Target size:** 5:6 portrait, macro close-up, minimum 800×960px, ideally 1200×1440px. JPG is fine.
**Where files go:** `my-portal/static/young-carpets/materials/`
**After drop:** Open `my-portal/src/routes/young-carpets/+page.svelte`, find the `featureProducts[]` array around line 28, flip the `image: null` field to the file path.

- [ ] **Carpet** → `materials/carpet.jpg`
  - Source: https://unsplash.com/s/photos/carpet-texture
  - Search: "carpet texture", "carpet fiber close-up"
  - After drop: set `image: '/young-carpets/materials/carpet.jpg'`
- [ ] **Carpet Tile** → `materials/carpet-tile.jpg`
  - Source: https://www.pexels.com/search/carpet%20tile/
  - Search: "modular carpet tile", "office carpet tile"
  - After drop: set `image: '/young-carpets/materials/carpet-tile.jpg'`
- [ ] **LVT** → `materials/lvt.jpg`
  - Source: https://unsplash.com/s/photos/vinyl-plank
  - Search: "vinyl plank wood", "luxury vinyl tile"
  - After drop: set `image: '/young-carpets/materials/lvt.jpg'`
- [ ] **Hardwood** → `materials/hardwood.jpg`
  - Source: https://libreshot.com/wood-texture-macro-photography/ (or Unsplash "wood grain macro")
  - Search: "hardwood grain close-up", "oak macro", "wood texture"
  - After drop: set `image: '/young-carpets/materials/hardwood.jpg'`
- [ ] **Rubber** → `materials/rubber.jpg`
  - Source: https://www.freepik.com/photos/rubber-floor-texture (or Pexels "rubber floor")
  - Search: "rubber floor texture", "studded rubber", "gym floor"
  - After drop: set `image: '/young-carpets/materials/rubber.jpg'`
- [ ] **Ceramic** → `materials/ceramic.jpg`
  - Source: https://pixabay.com/images/search/ceramic%20tile/
  - Search: "ceramic tile close-up", "porcelain tile texture"
  - After drop: set `image: '/young-carpets/materials/ceramic.jpg'`

---

## 🏷️ Supplier logos for the Brands We Work With carousel

These replace the text wordmark fallbacks currently scrolling in the carousel. The carousel ships and looks fine without them.

**Target format:** SVG preferred (scales perfectly), PNG with transparent background as fallback. Monochrome or single-color; the CSS applies `filter: brightness(0) invert(1)` so anything becomes pure white on dark.
**Where files go:** `my-portal/static/young-carpets/suppliers/`
**How to find:** Open each supplier's homepage in a browser, right-click the header logo → "Save image as…". Or look for a `/press-kit` or `/brand-assets` page.
**After drop:** Open `my-portal/src/routes/young-carpets/+page.svelte`, find the `suppliers[]` array around line 89, flip the `logo: null` field to the file path.

- [ ] **Nora** → `suppliers/nora.svg` — ⭐ DIRECT URL CONFIRMED: https://www.nora.com/-/media/images/general-grafics/logos-corporate-design/logo-nora/nora_logo_black_svg.svg (easy 5-second download)
- [ ] **Tarkett** → `suppliers/tarkett.svg` — https://commercial.tarkett.com/
- [ ] **Beaulieu Canada** → `suppliers/beaulieu-canada.svg` — https://beaulieucanada.com/en
- [ ] **Interface** → `suppliers/interface.svg` — https://www.interface.com/
- [ ] **Forbo** → `suppliers/forbo.svg` — https://www.forbo.com/flooring/en-gl/
- [ ] **Shaw Contract** → `suppliers/shaw-contract.svg` — https://www.shawcontract.com/en-ca
- [ ] **Mohawk Group** → `suppliers/mohawk-group.svg` — https://www.mohawkgroup.com/
- [ ] **Patcraft** → `suppliers/patcraft.svg` — https://www.patcraft.com/
- [ ] **Gerflor** → `suppliers/gerflor.svg` — https://www.gerflorcanada.com/ca
- [ ] **Johnsonite** → `suppliers/johnsonite.svg` — https://commercial.tarkett.com/johnsonite
- [ ] **COREtec** → `suppliers/coretec.svg` — https://coretecfloors.com/en-us
- [ ] **Armstrong Flooring** → `suppliers/armstrong-flooring.svg` — https://www.armstrongflooring.com/commercial
- [ ] **ViFloor** → `suppliers/vifloor.svg` — https://www.vifloor.com/
- [ ] **Fuzion Flooring** → `suppliers/fuzion-flooring.svg` — https://www.fuzionflooring.com/
- [ ] **Centura** → `suppliers/centura.svg` — https://www.centura.ca/en
- [ ] **Euro Tile & Stone** → `suppliers/euro-tile-stone.svg` — https://eurotilestone.com/  *(local Ottawa supplier — you may have a personal contact)*
- [ ] **Olympia Tile** → `suppliers/olympia-tile.svg` — https://www.olympiatile.com/
- [ ] **Ceratec** → `suppliers/ceratec.svg` — https://www.ceratec.com/en/
- [ ] **Céragrès** → `suppliers/ceragres.svg` — https://www.ceragres.ca/

---

## 🍁 Canadian maple leaf SVG

Replaces the hand-drawn 7-point SVG placeholder in the "Proudly Canadian" hero badge and the "Canadian Owned & Operated" footer badge.

**Where file goes:** `my-portal/static/young-carpets/maple-leaf.svg`
**After drop:** Open `my-portal/src/routes/young-carpets/+page.svelte`, find the two inline `<svg class="yc-maple-leaf">` blocks (one in the hero, one in the footer), replace each with `<img class="yc-maple-leaf" src="/young-carpets/maple-leaf.svg" alt="" />`.

- [ ] **Maple leaf** → `maple-leaf.svg`
  - Source: https://freesvg.org/maple-leaf (CC0)
  - Alternative: https://commons.wikimedia.org/wiki/File:Maple_Leaf.svg
  - Note: Government of Canada flag artwork is technically restricted for commercial use under the Trade Marks Act. Use a stylized/reinterpreted maple leaf (freesvg CC0 or similar) rather than the exact flag leaf.

---

## ✅ Fonts — no action needed

The site uses Apple system fonts only (`-apple-system`, `SF Pro Display`, `SF Pro Text`, `SF Mono`). They render natively on iOS and macOS; other platforms fall back through the standard system font chain. No web font files to download.

---

## 📌 Notes

- **Placeholders are intentional** — every entry above has something rendering in its place right now. The site is fully functional without these assets. They're visual upgrades, not blockers.
- **Order doesn't matter** — do any of them whenever. The most visible improvement is probably the material photos (6 feature cards).
- **When you complete a task**, you can just tick the box here; Claude will also update the RELAY.md Pending Assets section on the next session so other devices see the updated state.
- **If you want Claude to add more todos to this file**, just say "add to my todos" or "alan todo: [thing]" and it'll append.
