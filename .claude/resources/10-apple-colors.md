# Apple Standard Colors Reference

## System Colors

| Color | Light | Dark |
|---|---|---|
| systemRed | `#FF3B30` | `#FF453A` |
| systemOrange | `#FF9500` | `#FF9F0A` |
| systemYellow | `#FFCC00` | `#FFD60A` |
| systemGreen | `#28CD41` | `#32D74B` |
| systemMint | `#00C7BE` | `#06D6D6` |
| systemTeal | `#30B0C0` | `#40CBE0` |
| systemCyan | `#50B7D8` | `#6AC7EA` |
| systemBlue | `#007AFF` | `#0A84FF` |
| systemIndigo | `#5856D6` | `#5E5CE6` |
| systemPurple | `#AF52DE` | `#BF5AF0` |
| systemPink | `#FF2D55` | `#FF375F` |
| systemBrown | `#A2845E` | `#A78064` |

## Gray Palette

| Color | Light | Dark |
|---|---|---|
| systemGray | `#8E8E93` | `#8E8E93` |
| systemGray2 | `#AEAEB2` | `#636366` |
| systemGray3 | `#C7C7CC` | `#48484C` |
| systemGray4 | `#D1D1D6` | `#3A3A3C` |
| systemGray5 | `#E5E5EA` | `#2C2C2E` |
| systemGray6 | `#F2F2F7` | `#1C1C1E` |

## Semantic Colors — Labels

| Color | Light | Dark |
|---|---|---|
| label | `#000000` | `#FFFFFF` |
| secondaryLabel | `rgba(60, 60, 67, 0.60)` | `rgba(235, 235, 245, 0.60)` |
| tertiaryLabel | `rgba(60, 60, 67, 0.30)` | `rgba(235, 235, 245, 0.30)` |
| quaternaryLabel | `rgba(60, 60, 67, 0.20)` | `rgba(235, 235, 245, 0.20)` |
| placeholderText | `rgba(60, 60, 67, 0.30)` | `rgba(235, 235, 245, 0.30)` |

## Semantic Colors — Backgrounds

| Color | Light | Dark |
|---|---|---|
| systemBackground | `#FFFFFF` | `#000000` |
| secondarySystemBackground | `#F2F2F7` | `#1C1C1E` |
| tertiarySystemBackground | `#FFFFFF` | `#2C2C2E` |
| systemGroupedBackground | `#F2F2F7` | `#000000` |
| secondarySystemGroupedBackground | `#FFFFFF` | `#1C1C1E` |
| tertiarySystemGroupedBackground | `#F2F2F7` | `#2C2C2E` |

## Semantic Colors — Fills

| Color | Light | Dark |
|---|---|---|
| systemFill | `rgba(60, 60, 67, 0.20)` | `rgba(255, 255, 255, 0.20)` |
| secondarySystemFill | `rgba(60, 60, 67, 0.16)` | `rgba(255, 255, 255, 0.16)` |
| tertiarySystemFill | `rgba(60, 60, 67, 0.12)` | `rgba(255, 255, 255, 0.12)` |
| quaternarySystemFill | `rgba(60, 60, 67, 0.08)` | `rgba(255, 255, 255, 0.08)` |

## Semantic Colors — Separators

| Color | Light | Dark |
|---|---|---|
| separator | `rgba(60, 60, 67, 0.20)` | `rgba(84, 84, 88, 0.40)` |
| opaqueSeparator | `#C6C6C8` | `#38383A` |

## Mapping to app.css

| app.css Variable | Nearest Apple Token |
|---|---|
| `--color-text-primary` (#fafafa) | label (dark) |
| `--color-text-secondary` (#a1a1aa) | secondaryLabel (dark, opaque approx) |
| `--color-text-muted` (#71717a) | tertiaryLabel (dark, opaque approx) |
| `--color-surface` (#09090b) | systemBackground (dark) |
| `--color-danger` (#ef4444) | systemRed (dark, adjusted) |
| `--color-success` (#22c55e) | systemGreen (dark, adjusted) |
| `--color-cyan-accent` (#06b6d4) | systemTeal/systemCyan (custom blend) |
