/**
 * Small label / category tag.
 * `accent` — red uppercase text (section labels, category above headings)
 * `muted` — gray uppercase text (article tags, industry labels)
 * `outline` — bordered pill on dark bg
 * `solid` — filled red tag
 *
 * @example
 * <Badge label="About Us" variant="accent" />
 * <Badge label="High technology" variant="muted" />
 * <Badge label="B2B" variant="outline" />
 */
export interface BadgeProps {
  label: string;
  variant?: 'accent' | 'muted' | 'outline' | 'solid';
  style?: React.CSSProperties;
}
