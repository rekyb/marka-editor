# Design Tokens

This file contains the core design tokens derived from `DESIGN.md`. These tokens should be used across the application to ensure visual consistency.

## Colors

### Brand & Interactive
| Token | Value | Description |
| :--- | :--- | :--- |
| `color-primary` | `#6366F1` | Indigo: CTAs, active states, links, focus rings |
| `color-primary-hover` | `#4F46E5` | Darker indigo for hover states |
| `color-secondary` | `#20970B` | Green: Exclusively for brand highlight on homepage |

### Neutral & Surface
| Token | Value | Description |
| :--- | :--- | :--- |
| `color-background` | `#FAFAFA` | Page background (light warm gray) |
| `color-surface` | `#FFFFFF` | Cards, panels, modals, nav backdrop |
| `color-neutral` | `#9C9C9C` | Muted text, placeholders, disabled states |
| `color-border` | `#E8E8EC` | Subtle card borders, dividers, inputs |

### Text
| Token | Value | Description |
| :--- | :--- | :--- |
| `color-text-primary` | `#0A0A0A` | Near-black: Headings, body text |
| `color-text-secondary` | `#6B6B6B` | Descriptions, metadata |

### Semantic
| Token | Value | Description |
| :--- | :--- | :--- |
| `color-success` | `#10B981` | Published status, positive indicators |
| `color-warning` | `#F59E0B` | Pending states, caution banners |
| `color-error` | `#EF4444` | Destructive actions, validation errors |

---

## Typography

### Fonts
| Token | Value | Description |
| :--- | :--- | :--- |
| `font-display` | `Open Sans`, sans-serif | Headings (General Sans mentioned in text, Open Sans in list - following DESIGN.md text/list mapping) |
| `font-body` | `DM Sans`, sans-serif | Body and UI text |
| `font-code` | `JetBrains Mono`, monospace | Code, CLI, API keys |

### Font Sizes
| Token | Value |
| :--- | :--- |
| `size-display` | `72px` |
| `size-headline` | `60px` |
| `size-section-heading` | `32px` |
| `size-subhead` | `24px` |
| `size-body` | `15px` |
| `size-small` | `13px` |
| `size-caption` | `12px` |
| `size-overline` | `11px` (Uppercase) |

### Weights & Spacing
| Token | Value | Description |
| :--- | :--- | :--- |
| `weight-display` | `Bold` | Used for display and headings |
| `weight-body` | `Regular`, `Medium` | Used for UI and body text |
| `letter-spacing-display` | `-0.03em to -0.04em` | Tight spacing for bold headings |

---

## Spacing
**Base Unit:** `4px`

| Token | Value |
| :--- | :--- |
| `spacing-1` | `4px` |
| `spacing-2` | `8px` |
| `spacing-3` | `12px` |
| `spacing-4` | `16px` |
| `spacing-5` | `20px` |
| `spacing-6` | `24px` |
| `spacing-8` | `32px` |
| `spacing-10` | `40px` |
| `spacing-12` | `48px` |
| `spacing-16` | `64px` |
| `spacing-20` | `80px` |
| `spacing-24` | `96px` |

---

## Border Radius

| Token | Value | Applied To |
| :--- | :--- | :--- |
| `radius-xs` | `4px` | Tags, chips, badges, inline code |
| `radius-sm` | `6px` | Buttons, inputs, selects |
| `radius-md` | `8px` | Metadata cards, dropdowns, panels |
| `radius-lg` | `12px` | Kit preview cards, search bar |
| `radius-full` | `9999px` | Avatars, status dots, pills |

---

## Elevation

| Token | Value | Description |
| :--- | :--- | :--- |
| `shadow-hover` | `0 8px 30px rgba(0,0,0,0.08)` | Applied to cards on hover (+ -2px lift) |
| `shadow-primary-glow` | `0 4px 12px rgba(99,102,241,0.35)` | Applied to primary buttons on hover |
| `shadow-lg` | Standard large shadow | Dropdowns and popovers |
| `ring-focus` | `0 0 0 3px rgba(99,102,241,0.12)` | 3px indigo focus ring |
| `elevation-blur` | `backdrop-blur` | Navigation elevation |

---

## Grid & Containers

| Token | Value |
| :--- | :--- |
| `container-max-width` | `1280px` |
| `container-padding` | `24px` (Horizontal) |
| `grid-gap` | `20px - 24px` |
| `nav-height` | `56px` |
