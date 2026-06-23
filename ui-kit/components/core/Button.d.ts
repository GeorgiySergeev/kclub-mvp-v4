/**
 * CTA / action button with three variants.
 * Use `primary` for the most important action on a dark background.
 * Use `ghost` for secondary actions alongside a primary on dark bg.
 * Use `secondary` for actions on light backgrounds.
 * Use `link` for inline text links with arrow.
 *
 * @example
 * <Button variant="primary" size="md">Solutions</Button>
 * <Button variant="ghost" arrow={false}>Contact us ↗</Button>
 * <Button variant="secondary" size="sm">Who we are</Button>
 * <Button variant="link">Learn more</Button>
 *
 * @startingPoint section="Components" subtitle="CTA buttons — 3 variants × 3 sizes" viewport="700x180"
 */
export interface ButtonProps {
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Show trailing → arrow (default true) */
  arrow?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Renders as <a> when provided */
  href?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
