CTA / action button — use whenever the user needs to take a primary or secondary action.

```jsx
// Primary (dark bg)
<Button variant="primary">Solutions</Button>

// Ghost (alongside primary on dark bg)
<Button variant="ghost" arrow={false}>Contact us ↗</Button>

// Secondary (light bg)
<Button variant="secondary" size="sm">Who we are</Button>

// Link style
<Button variant="link">Read case study</Button>

// Disabled
<Button variant="primary" disabled>Unavailable</Button>
```

Variants: `primary` (red fill) · `secondary` (outline, light bg) · `ghost` (outline, dark bg) · `link` (text + arrow)
Sizes: `sm` (13px / 9×16px pad) · `md` (14px / 12×20px pad — default) · `lg` (15px / 15×26px pad)
Arrow: enabled by default, pass `arrow={false}` to suppress
