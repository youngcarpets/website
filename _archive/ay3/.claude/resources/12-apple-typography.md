# Apple Typography & Layout Reference

## Type Scale (SF Pro)

SF Pro Display for 20pt+, SF Pro Text for 19pt and below.

| Style | Size (pt/px) | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| Large Title | 34 / 45px | Regular | 41pt / 55px | -0.41pt |
| Title 1 | 28 / 37px | Regular | 34pt / 45px | -0.43pt |
| Title 2 | 22 / 29px | Regular | 26pt / 35px | -0.41pt |
| Title 3 | 20 / 27px | Regular | 24pt / 32px | -0.38pt |
| Headline | 17 / 23px | Semibold | 22pt / 29px | -0.43pt |
| Body | 17 / 23px | Regular | 22pt / 29px | -0.43pt |
| Callout | 16 / 21px | Regular | 21pt / 28px | -0.41pt |
| Subheadline | 15 / 20px | Regular | 20pt / 27px | -0.24pt |
| Footnote | 13 / 17px | Regular | 18pt / 24px | -0.08pt |
| Caption 1 | 12 / 16px | Regular | 16pt / 21px | 0pt |
| Caption 2 | 11 / 15px | Regular | 13pt / 17px | 0.06pt |

## Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
```

## Spacing System

**Base grid:** 8pt

| Token | Value |
|---|---|
| xxs | 4px |
| xs | 8px |
| sm | 12px |
| md | 16px |
| lg | 20px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 40px |
| 4xl | 48px |

**Content margins:** 16px (compact) / 20px (regular)
**Min touch target:** 44 x 44px

## Corner Radii

| Token | Value | Use |
|---|---|---|
| sm | 6px | Small buttons, chips, badges |
| md | 10px | Buttons, inputs, cards |
| lg | 14px | Modals, larger cards |
| xl | 20px | Sheets, popovers |
| pill | 9999px | Pill buttons, tags |

Apple uses **squircle** (superellipse) curves, not circular arcs — CSS `border-radius` is a close approximation.
