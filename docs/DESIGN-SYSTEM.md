# KCLUB MVP v4 — Design System

| Field            | Value      |
| ---------------- | ---------- |
| Document version | `1.0.0`    |
| Status           | Active     |
| Last updated     | 2026-06-19 |

## Purpose

This document is the single source of truth for all visual decisions in KCLUB MVP v4. Every UI component, layout, color choice, and spacing value must align with this document. AI agents and human developers must read this before building or modifying any UI.

**Rule:** If a visual decision is not covered here, do not invent it. Add a note in the task handoff and wait for a decision before implementing.

---

## 1. Technology Stack

- **Tailwind CSS v4** — utility-first styling. No custom CSS files unless Tailwind cannot achieve the result.
- **`@kclub/ui`** — shared primitive components. Use these before writing any custom markup.
- **`@kclub/config/tailwind`** — shared Tailwind theme preset. Both apps extend this config.
- **`cn()` utility** — from `@kclub/ui` — for conditional class merging. Always use `cn()`, never string concatenation for classes.
- **No inline `style={{}}` props** — use Tailwind classes only.
- **No arbitrary Tailwind values** like `w-[347px]` or `text-[13px]` unless explicitly approved here.

---

## 2. Color Palette

The palette has two layers: **zinc** (neutral base) and **brand** (accent). Dark mode is supported on all surfaces.

### 2.1 Neutral — Zinc Scale

All structural colors (text, borders, backgrounds, surfaces) use the `zinc` scale.

| Token | Tailwind class | Light mode use | Dark mode use |
| --- | --- | --- | --- |
| Primary text | `text-zinc-900` | Body copy, headings, labels | `dark:text-zinc-50` |
| Secondary text | `text-zinc-600` | Captions, helper text, muted | `dark:text-zinc-400` |
| Placeholder | `text-zinc-400` | Input placeholders | `dark:text-zinc-500` |
| Primary border | `ring-zinc-300` | Input rings, card borders | `dark:ring-zinc-700` |
| Subtle border | `ring-zinc-200` | Surface rings | `dark:ring-zinc-800` |
| Page background | `bg-white` | Page root | `dark:bg-zinc-950` |
| Surface background | `bg-white` | Cards, panels | `dark:bg-zinc-950` |
| Input background | *(transparent)* | Inherits surface | `dark:bg-zinc-900` |
| Button primary bg | `bg-zinc-900` | CTA buttons | `dark:bg-zinc-50` |
| Button primary text | `text-white` | CTA button label | `dark:text-zinc-950` |
| Button primary hover | `hover:bg-zinc-700` | CTA hover state | `dark:hover:bg-zinc-200` |
| Secondary button bg | `bg-white` | Secondary actions | `dark:bg-zinc-900` |
| Focus ring | `ring-zinc-900` | All focusable elements | `dark:ring-zinc-50` |

### 2.2 Brand — Teal Scale

The `brand` color is defined in `packages/config/tailwind/theme.ts` as a teal-based accent.

| Token | Value | Use |
| --- | --- | --- |
| `brand-50` | `#f0fdfa` | Brand tint backgrounds |
| `brand-100` | `#ccfbf1` | Brand light badges, highlights |
| `brand-500` | `#14b8a6` | Brand accent, active states, links (optional) |
| `brand-900` | `#134e4a` | Brand dark text on light brand backgrounds |

**Current status:** Brand color is defined but not yet applied in components. Use `brand-500` for brand accent elements (e.g., active tab indicator, highlighted badge, VIP badge background) when the design calls for a colored accent. Do not use brand color for structural UI (borders, backgrounds, text).

### 2.3 Semantic Colors

| Meaning | Classes |
| --- | --- |
| Success | `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100` |
| Error / Destructive | `bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300` |
| Warning | `bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300` |
| Info | `bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300` |

Semantic colors are used **only for status badges, alert banners, and inline validation messages** — not for layout.

---

## 3. Typography

Tailwind's default type scale is used. No custom fonts are defined — the system uses the native font stack.

### 3.1 Scale

| Role | Classes | Use |
| --- | --- | --- |
| Page heading | `text-2xl font-semibold text-zinc-900` | H1-level page titles |
| Section heading | `text-lg font-semibold text-zinc-900` | Card titles, section labels |
| Sub-heading | `text-base font-medium text-zinc-900` | Group labels, sub-sections |
| Body | `text-sm text-zinc-900` | Default body copy |
| Muted / caption | `text-sm text-zinc-600 dark:text-zinc-400` | Helper text, timestamps, captions |
| Label | `text-sm font-medium text-zinc-900 dark:text-zinc-50` | Form field labels |
| Small / meta | `text-xs text-zinc-500` | Tags, metadata, footnotes |

### 3.2 Rules

- Do not use `font-bold` — use `font-semibold` for headings and `font-medium` for emphasis.
- Do not use `text-black` or `text-white` directly — use the zinc scale.
- Line height is controlled by Tailwind defaults (`leading-6` for `text-sm` in forms).
- Do not mix font sizes within a single label or button.

---

## 4. Spacing

All spacing uses Tailwind's 4px base grid. Prefer named scale values over arbitrary ones.

### 4.1 Standard Spacing Values

| Context | Padding | Gap |
| --- | --- | --- |
| Page outer padding | `px-4 py-6` (mobile) / `px-6 py-10` (sm+) | — |
| Surface / Card inner padding | `px-8 py-10` | — |
| Form section | `px-0 py-0` inside Surface | `gap-4` between fields |
| Button (default) | `px-6 py-2.5` | — |
| Button (sm) | `px-4 py-2` | — |
| Button (lg) | `px-8 py-3` | — |
| Input field | `px-3 py-2.5` | — |
| Badge | `px-2.5 py-0.5` | — |
| Stack of form actions | — | `gap-3` |
| Stack of content cards | — | `gap-4` or `gap-6` |

### 4.2 Rules

- Do not use `p-5`, `p-7`, `p-9` — stay on the even rhythm (`p-4`, `p-6`, `p-8`, `p-10`).
- Use `gap-*` for flex/grid layouts, not margin between siblings.
- Do not use `margin-top` or `margin-bottom` on components — use `gap` on the parent.

---

## 5. Border Radius

| Element | Class |
| --- | --- |
| Input, button, badge (rounded) | `rounded-md` |
| Surface / card | `rounded-2xl` (via `sm:rounded-2xl`) |
| Full-round badge, avatar | `rounded-full` |
| Icon button | `rounded-md` |

Do not use `rounded-lg`, `rounded-xl`, or `rounded-sm` — these are not in the system.

---

## 6. Shadows and Rings

- Surfaces and buttons use `shadow-sm` — not `shadow`, `shadow-md`, or `shadow-lg`.
- Borders are implemented as Tailwind **rings** (`ring-1 ring-inset ring-zinc-300`), not `border-*` classes.
- Focus state always uses `focus-visible:ring-2 focus-visible:ring-offset-2` — never `outline` or `border` for focus.

---

## 7. Component Catalog

All components come from `@kclub/ui`. Before writing custom markup, check this table.

| Component | Import | Use for | Do NOT use for |
| --- | --- | --- | --- |
| `Button` | `@kclub/ui` | All clickable actions | Navigation links (use `<a>` or `<Link>`) |
| `IconButton` | `@kclub/ui` | Icon-only actions | Text actions |
| `Input` | `@kclub/ui` | All text inputs | Textareas, selects (build separately) |
| `Field` / `Label` / `FieldError` | `@kclub/ui` | Form field wrappers | Non-form labels |
| `Surface` | `@kclub/ui` | Auth cards, modal-like panels, centered content blocks | Full-width layout containers |
| `Container` | `@kclub/ui` | Max-width page wrapper | Individual component width control |
| `Badge` | `@kclub/ui` | Status labels, tags | Large pills, buttons |
| `EmptyState` | `@kclub/ui` | Empty list / no data states | Page-level errors |
| `PageState` | `@kclub/ui` | Full-page loading and error states | Inline loading |
| `SkipLink` | `@kclub/ui` | Accessibility skip-to-content | Any other use |

### 7.1 Button Variants

| Variant | Use |
| --- | --- |
| `primary` (default) | Main CTA: submit, confirm, proceed |
| `secondary` | Alternative actions: cancel, back, edit |
| `ghost` | Low-priority actions: links in nav, tertiary actions |

### 7.2 Badge Variants

| Variant | Use |
| --- | --- |
| `default` | Neutral status: ACTIVE, MEMBER |
| `outline` | Inactive or secondary status |
| `success` | Positive status: PUBLISHED, APPROVED, VIP |

For destructive statuses (REJECTED, BLOCKED, REVOKED), use semantic red classes directly until a `destructive` badge variant is added.

---

## 8. Icons

- **Use `lucide-react` exclusively** for all icons. Do not use Heroicons, Radix icons, or inline SVGs unless a specific icon does not exist in Lucide.
- Icon size: `size-4` (16px) for inline/button icons, `size-5` (20px) for standalone icons, `size-6` (24px) for decorative/empty state icons.
- Icons inside buttons: add `gap-2` between icon and label.
- Do not add `aria-hidden` manually — Lucide handles accessibility by default when no label is needed.

---

## 9. Dark Mode

- Dark mode is class-based: `dark:` prefix.
- Every component in `@kclub/ui` already has dark mode variants — do not override them.
- When building new components outside `@kclub/ui`, always add `dark:` variants for: background, text, border/ring, and focus ring.
- Do not build UI that only works in light mode.

---

## 10. Responsive Design

- Mobile-first. Default styles target mobile; `sm:`, `md:`, `lg:` breakpoints add desktop enhancements.
- `sm` (640px) is the primary breakpoint for layout changes (single to multi-column, card rounding).
- `Container` component handles max-width — do not add `max-w-*` to page-level wrappers manually.
- Do not use `xl:` or `2xl:` breakpoints unless explicitly required.

---

## 11. UI States — How to Handle Them

Every list, form, and data surface must handle all four states:

| State | How to implement |
| --- | --- |
| **Loading** | Use `PageState` for full-page; use a skeleton shimmer (`animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-md`) for inline |
| **Empty** | Use `EmptyState` component with a descriptive message and optional CTA |
| **Error** | Use `PageState` with error variant for page-level; use `FieldError` for form field errors |
| **Disabled** | Add `disabled` prop to interactive elements; style with `opacity-50 cursor-not-allowed` on the wrapper if needed |

Never show a blank screen or uncaught error to the user.

---

## 12. Forms

All forms follow this structure:

```tsx
<form className="flex flex-col gap-4">
  <Field>
    <Label htmlFor="name">Full name</Label>
    <Input id="name" name="name" placeholder="Your name" />
    <FieldError>{errors.name}</FieldError>
  </Field>

  <Field>
    <Label htmlFor="phone">Phone</Label>
    <Input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
    <FieldError>{errors.phone}</FieldError>
  </Field>

  <div className="flex flex-col gap-3">
    <Button type="submit" fullWidth>Submit</Button>
    <Button type="button" variant="ghost">Cancel</Button>
  </div>
</form>
```

- Always use `Field` + `Label` + `FieldError` — never raw `<label>` or bare error text.
- Submit button always `fullWidth` on mobile forms.
- Error messages go inside `FieldError`, never below the form.
- Do not use `placeholder` as a substitute for `Label`.

---

## 13. What Agents Must Not Do

- Do not create new color tokens outside the zinc/brand/semantic palette.
- Do not use `bg-gray-*`, `text-gray-*`, `border-gray-*` — use `zinc` equivalents.
- Do not build a custom button, input, or badge component — use `@kclub/ui`.
- Do not add `style={{}}` inline styles.
- Do not use arbitrary Tailwind values like `w-[500px]`, `text-[15px]`, `mt-[22px]`.
- Do not add CSS `@apply` directives in component files.
- Do not add new Tailwind plugins without an ADR.
- Do not use `rounded-lg` or `rounded-xl` — not in the system.
- Do not apply `shadow-md` or `shadow-lg` — use `shadow-sm` only.
- Do not build new primitives in app `components/` that duplicate what exists in `@kclub/ui`.

---

## 14. Adding New Components to `@kclub/ui`

When a new shared primitive is needed:

1. Check that no existing component covers the use case.
2. Add the component to `packages/ui/src/primitives/`.
3. Export it from `packages/ui/src/index.ts`.
4. Follow the same variant/cn pattern as existing primitives.
5. Add dark mode support.
6. Document it in this file under Section 7.

Do not add product-specific components (e.g., `MemberCard`, `BusinessRow`) to `@kclub/ui` — those belong in app `features/` or `components/`.

---

## Changelog

| Version | Date       | Summary                                         |
| ------- | ---------- | ----------------------------------------------- |
| `1.0.0` | 2026-06-19 | Initial design system documentation for MVP v4  |
